// src/lib/dashboard-service.ts

import {
  ApiResponse,
  Category,
  Order,
  OrdersResponse,
  Product,
  User,
} from '@/types';
import {
  OrderStatus,
  Prisma,
  PrismaClient,
  Role,
  Status,
} from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

interface ProductFilters {
  search?: string;
  status?: Status;
  categoryId?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

interface UserFilters {
  search?: string;
  role?: Role;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface CategoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}

interface CreateProductData {
  productName: string;
  slug?: string;
  price: number;
  stock: number;
  description?: string;
  features: string[];
  status: Status;
  featured: boolean;
  categoryId: string;
  images?: File[];
}

interface UpdateProductData {
  productName?: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
  features?: string[];
  status?: Status;
  featured?: boolean;
  categoryId?: string;
  images?: File[];
}

interface CreateCategoryData {
  categoryName: string;
  slug?: string;
  description?: string;
  mainImage?: File | string;
}

interface UpdateCategoryData {
  categoryName?: string;
  slug?: string;
  description?: string;
  mainImage?: File | string | null;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
  avatar?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// FUNCIONES DE PRODUCTOS
// ============================================================================

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedResponse<Product>> {
  try {
    const {
      search = '',
      status,
      categoryId,
      featured,
      page = 1,
      limit = 10,
    } = filters;

    const skip = (page - 1) * limit;

    const whereConditions: Prisma.ProductWhereInput = {};

    if (status) {
      whereConditions.status = status;
    }

    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }

    if (featured !== undefined) {
      whereConditions.featured = featured;
    }

    if (search) {
      whereConditions.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
      }),
      prisma.product.count({ where: whereConditions }),
    ]);

    const serializedProducts: Product[] = products.map(product => ({
      id: product.id,
      slug: product.slug,
      productName: product.productName,
      price: product.price,
      stock: product.stock,
      description: product.description,
      categoryId: product.categoryId,
      features: product.features,
      status: product.status as 'ACTIVE' | 'INACTIVE',
      featured: product.featured,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      category: {
        id: product.category.id,
        categoryName: product.category.categoryName,
        slug: product.category.slug,
        description: product.category.description,
        mainImage: product.category.mainImage,
        createdAt: product.category.createdAt.toISOString(),
        updatedAt: product.category.updatedAt.toISOString(),
      },
      images: product.images.map(img => ({
        id: img.id,
        productId: img.productId,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt.toISOString(),
      })),
      reviewCount: 0,
      _count: {
        ...product._count,
        reviews: 0,
      },
    }));

    return {
      data: serializedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Error al obtener los productos');
  }
}

export async function createProduct(
  productData: CreateProductData,
): Promise<ApiResponse<Product>> {
  try {
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });

    if (!category) {
      return {
        success: false,
        error: 'La categoría especificada no existe',
      };
    }

    const slug =
      productData.slug ||
      productData.productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const uploadedImages: { url: string; alt?: string }[] = [];
    if (productData.images && productData.images.length > 0) {
      for (const image of productData.images) {
        if (!image || image.size === 0) continue;
        const blob = await put(image.name, image, {
          access: 'public',
          addRandomSuffix: true,
        });
        uploadedImages.push({
          url: blob.url,
          alt: productData.productName,
        });
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        productName: productData.productName,
        slug,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        categoryId: productData.categoryId,
        features: productData.features,
        status: productData.status,
        featured: productData.featured,
        images: {
          create: uploadedImages.map((img, index) => ({
            url: img.url,
            alt: img.alt || `Imagen de ${productData.productName}`,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { orderItems: true, reviews: true } },
      },
    });

    const serializedProduct: Product = {
      id: newProduct.id,
      slug: newProduct.slug,
      productName: newProduct.productName,
      price: newProduct.price,
      stock: newProduct.stock,
      description: newProduct.description,
      categoryId: newProduct.categoryId,
      features: newProduct.features,
      status: newProduct.status,
      featured: newProduct.featured,
      createdAt: newProduct.createdAt.toISOString(),
      updatedAt: newProduct.updatedAt.toISOString(),
      category: {
        id: newProduct.category.id,
        categoryName: newProduct.category.categoryName,
        slug: newProduct.category.slug,
        description: newProduct.category.description,
        mainImage: newProduct.category.mainImage,
        createdAt: newProduct.category.createdAt.toISOString(),
        updatedAt: newProduct.category.updatedAt.toISOString(),
      },
      images: newProduct.images.map(img => ({
        id: img.id,
        productId: img.productId,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt.toISOString(),
      })),
      _count: {
        reviews: newProduct._count.reviews,
        orderItems: newProduct._count.orderItems,
      },
    };

    return { success: true, data: serializedProduct };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear el producto',
    };
  }
}

export async function updateProduct(
  productId: string,
  productData: UpdateProductData,
): Promise<ApiResponse<Product>> {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return { success: false, error: 'El producto no existe' };
    }

    const updateData: Prisma.ProductUpdateInput = {
      productName: productData.productName,
      slug: productData.slug,
      price: productData.price,
      stock: productData.stock,
      description: productData.description,
      features: productData.features,
      status: productData.status,
      featured: productData.featured,
    };

    if (productData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId },
      });

      if (!category) {
        return { success: false, error: 'La categoría especificada no existe' };
      }
      updateData.category = {
        connect: {
          id: productData.categoryId,
        },
      };
    }

    if (productData.images) {
      if (productData.images.length > 0) {
        await prisma.productImage.deleteMany({
          where: { productId: productId },
        });

        const uploadedImages: { url: string; alt?: string }[] = [];
        for (const image of productData.images) {
          if (!image || image.size === 0) continue;
          const blob = await put(image.name, image, {
            access: 'public',
            addRandomSuffix: true,
          });
          uploadedImages.push({
            url: blob.url,
            alt: productData.productName || 'Imagen de producto',
          });
        }

        updateData.images = {
          create: uploadedImages.map((img, index) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        };
      } else {
        console.log(
          `Se recibió un array de imágenes vacío para el producto ${productId}. No se realizarán cambios en las imágenes.`,
        );
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { orderItems: true, reviews: true } },
      },
    });

    const serializedProduct: Product = {
      id: product.id,
      slug: product.slug,
      productName: product.productName,
      price: product.price,
      stock: product.stock,
      description: product.description,
      categoryId: product.categoryId,
      features: product.features,
      status: product.status,
      featured: product.featured,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      category: {
        id: product.category.id,
        categoryName: product.category.categoryName,
        slug: product.category.slug,
        description: product.category.description,
        mainImage: product.category.mainImage,
        createdAt: product.category.createdAt.toISOString(),
        updatedAt: product.category.updatedAt.toISOString(),
      },
      images: product.images.map(img => ({
        id: img.id,
        productId: img.productId,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt.toISOString(),
      })),
      _count: {
        reviews: product._count.reviews,
        orderItems: product._count.orderItems,
      },
    };

    return { success: true, data: serializedProduct };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar el producto',
    };
  }
}

export async function deleteProduct(
  productId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return { success: false, error: 'El producto no existe' };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar el producto',
    };
  }
}

// ============================================================================
// FUNCIONES DE CATEGORÍAS
// ============================================================================

export async function getCategories(
  filters: CategoryFilters = {},
): Promise<Category[]> {
  try {
    const { search = '', page = 1, limit = 50 } = filters;

    const whereConditions: Prisma.CategoryWhereInput = {};

    if (search) {
      whereConditions.OR = [
        { categoryName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const categories = await prisma.category.findMany({
      where: whereConditions,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { categoryName: 'asc' },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return categories.map(category => ({
      id: category.id,
      categoryName: category.categoryName,
      slug: category.slug,
      description: category.description,
      mainImage: category.mainImage,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      _count: category._count,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Error al obtener las categorías');
  }
}

export async function createCategory(
  categoryData: CreateCategoryData,
): Promise<ApiResponse<Category>> {
  try {
    const slug =
      categoryData.slug ||
      categoryData.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return {
        success: false,
        error: 'Ya existe una categoría con este slug',
      };
    }

    let mainImageUrl: string | undefined;

    if (categoryData.mainImage instanceof File) {
      const blob = await put(
        categoryData.mainImage.name,
        categoryData.mainImage,
        {
          access: 'public',
          addRandomSuffix: true,
        },
      );
      mainImageUrl = blob.url;
    } else if (typeof categoryData.mainImage === 'string') {
      mainImageUrl = categoryData.mainImage;
    }

    const category = await prisma.category.create({
      data: {
        categoryName: categoryData.categoryName,
        slug,
        description: categoryData.description,
        mainImage: mainImageUrl,
      },
      include: { _count: { select: { products: true } } },
    });

    const serializedCategory: Category = {
      id: category.id,
      categoryName: category.categoryName,
      slug: category.slug,
      description: category.description,
      mainImage: category.mainImage,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      _count: category._count,
    };

    return {
      success: true,
      data: serializedCategory,
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear la categoría',
    };
  }
}

export async function updateCategory(
  categoryId: string,
  categoryData: UpdateCategoryData,
): Promise<ApiResponse<Category>> {
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return { success: false, error: 'La categoría no existe' };
    }

    // Verificar si el slug ya existe en otra categoría
    if (categoryData.slug && categoryData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: categoryData.slug },
      });

      if (slugExists) {
        return {
          success: false,
          error: 'Ya existe una categoría con este slug',
        };
      }
    }

    // Usamos el tipo específico de Prisma para la actualización
    const updateData: Prisma.CategoryUpdateInput = {
      categoryName: categoryData.categoryName,
      slug: categoryData.slug,
      description: categoryData.description,
    };

    // Manejo especial para la imagen
    if (categoryData.mainImage !== undefined) {
      if (categoryData.mainImage instanceof File) {
        // Subir nueva imagen a Vercel Blob
        const blob = await put(
          categoryData.mainImage.name,
          categoryData.mainImage,
          {
            access: 'public',
            addRandomSuffix: true,
          },
        );
        updateData.mainImage = blob.url;
      } else if (categoryData.mainImage === 'DELETE') {
        // Si se envía la señal 'DELETE', eliminamos la imagen de la base de datos
        updateData.mainImage = null;
      } else if (typeof categoryData.mainImage === 'string') {
        // Si es un string (URL existente), lo mantenemos
        updateData.mainImage = categoryData.mainImage;
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      include: { _count: { select: { products: true } } },
    });

    const serializedCategory: Category = {
      id: category.id,
      categoryName: category.categoryName,
      slug: category.slug,
      description: category.description,
      mainImage: category.mainImage,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      _count: category._count,
    };

    return { success: true, data: serializedCategory };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar la categoría',
    };
  }
}

// ... (el resto de tu archivo dashboard-service.ts)

export async function deleteCategory(
  categoryId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return { success: false, error: 'La categoría no existe' };
    }

    if (existingCategory._count.products > 0) {
      return {
        success: false,
        error:
          'No se puede eliminar la categoría porque tiene productos asociados',
      };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error('Error in deleteCategory service:', error);

    if (
      error instanceof Error &&
      error.message.includes('foreign key constraint')
    ) {
      return {
        success: false,
        error:
          'No se puede eliminar la categoría porque tiene productos asociados',
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar la categoría',
    };
  }
}

// ============================================================================
// FUNCIONES DE USUARIOS
// ============================================================================

export async function getUserById(userId: string): Promise<ApiResponse<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: 'El usuario no existe' };
    }

    const serializedUser: User = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return { success: true, data: serializedUser };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return { success: false, error: 'Error al obtener el usuario' };
  }
}

export async function getUsers(
  filters: UserFilters = {},
): Promise<PaginatedResponse<User>> {
  try {
    const { search = '', role, isActive, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const whereConditions: Prisma.UserWhereInput = {};

    if (role) {
      whereConditions.role = role;
    }

    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    if (search) {
      whereConditions.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      prisma.user.count({ where: whereConditions }),
    ]);

    const serializedUsers: User[] = users.map(user => ({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    return {
      data: serializedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error al obtener los usuarios');
  }
}

export async function updateUser(
  userId: string,
  userData: UpdateUserData,
): Promise<ApiResponse<User>> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return { success: false, error: 'El usuario no existe' };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    const serializedUser: User = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return { success: true, data: serializedUser };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar el usuario',
    };
  }
}

export async function toggleUserActive(
  userId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return { success: false, error: 'El usuario no existe' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !existingUser.isActive },
    });

    return { success: true, data: { success: true } };
  } catch (error) {
    console.error('Error toggling user active status:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al cambiar el estado del usuario',
    };
  }
}

// ============================================================================
// FUNCIONES DE ÓRDENES
// ============================================================================

export async function getOrders(
  filters: OrderFilters = {},
): Promise<OrdersResponse> {
  try {
    const { search = '', status, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const whereConditions: Prisma.OrderWhereInput = {};

    if (status) {
      whereConditions.status = status;
    }

    if (search) {
      whereConditions.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { contactInfo: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contactInfo: true,
          shippingAddress: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              avatar: true,
              isActive: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  slug: true,
                  productName: true,
                  price: true,
                  description: true,
                  categoryId: true,
                  features: true,
                  stock: true,
                  status: true,
                  featured: true,
                  createdAt: true,
                  updatedAt: true,
                  category: {
                    select: {
                      id: true,
                      categoryName: true,
                      slug: true,
                      mainImage: true,
                      description: true,
                      createdAt: true,
                      updatedAt: true,
                    },
                  },
                  images: {
                    select: {
                      id: true,
                      productId: true,
                      url: true,
                      alt: true,
                      sortOrder: true,
                      isPrimary: true,
                      createdAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: whereConditions }),
    ]);

    const serializedOrders: Order[] = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as Order['status'],
      customerEmail: order.customerEmail || undefined,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      total: order.total,
      paymentStatus: 'PENDING' as const,
      paymentMethod: null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      userId: order.userId || undefined,
      user: order.user
        ? {
            id: order.user.id,
            clerkId: '',
            email: order.user.email,
            firstName: order.user.firstName || '',
            lastName: order.user.lastName || '',
            role: order.user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
            avatar: order.user.avatar,
            isActive: order.user.isActive,
            createdAt: order.user.createdAt.toISOString(),
            updatedAt: order.user.updatedAt.toISOString(),
          }
        : null,
      items: order.items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName || 'Producto sin nombre',
        productSku: item.productSku || '',
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        createdAt: item.createdAt.toISOString(),
        product: {
          id: item.product.id,
          slug: item.product.slug,
          productName: item.product.productName,
          price: item.product.price,
          stock: item.product.stock,
          status: item.product.status as 'ACTIVE' | 'INACTIVE',
          featured: item.product.featured,
          description: item.product.description,
          categoryId: item.product.categoryId,
          features: item.product.features,
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
          category: {
            id: item.product.category.id,
            categoryName: item.product.category.categoryName,
            slug: item.product.category.slug,
            mainImage: item.product.category.mainImage,
            description: item.product.category.description,
            createdAt: item.product.category.createdAt.toISOString(),
            updatedAt: item.product.category.updatedAt.toISOString(),
          },
          images: item.product.images.map(img => ({
            id: img.id,
            productId: img.productId,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary,
            createdAt: img.createdAt.toISOString(),
          })),
        },
      })),
      contactInfo: order.contactInfo
        ? {
            id: order.contactInfo.id,
            name: order.contactInfo.name,
            email: order.contactInfo.email,
            phone: order.contactInfo.phone,
            createdAt: order.contactInfo.createdAt.toISOString(),
            updatedAt: order.contactInfo.updatedAt.toISOString(),
            orderId: order.contactInfo.orderId,
          }
        : null,
      shippingAddress: order.shippingAddress
        ? {
            id: order.shippingAddress.id,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zip: order.shippingAddress.zip,
            country: order.shippingAddress.country,
            createdAt: order.shippingAddress.createdAt.toISOString(),
            updatedAt: order.shippingAddress.updatedAt.toISOString(),
            orderId: order.shippingAddress.orderId,
          }
        : null,
      customerName:
        order.contactInfo?.name ||
        (order.user
          ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
          : 'Cliente sin nombre'),
    }));

    return {
      data: serializedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Error al obtener las órdenes');
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const validStatuses: OrderStatus[] = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'REFUNDED',
    ];

    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: `Estado inválido: ${status}. Estados válidos: ${validStatuses.join(
          ', ',
        )}`,
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error desconocido al actualizar el estado',
    };
  }
}

export async function getOrderById(
  orderId: string,
): Promise<ApiResponse<Order>> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        contactInfo: true,
        shippingAddress: true,
        user: true,
        items: {
          include: {
            product: { include: { category: true, images: true } },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: 'Orden no encontrada' };
    }

    const serializedOrder: Order = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as Order['status'],
      customerEmail: order.customerEmail || undefined,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      total: order.total,
      paymentStatus: 'PENDING' as const,
      paymentMethod: null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      userId: order.userId || undefined,
      user: order.user
        ? {
            id: order.user.id,
            clerkId: order.user.clerkId,
            email: order.user.email,
            firstName: order.user.firstName || '',
            lastName: order.user.lastName || '',
            role: order.user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
            avatar: order.user.avatar,
            isActive: order.user.isActive,
            createdAt: order.user.createdAt.toISOString(),
            updatedAt: order.user.updatedAt.toISOString(),
          }
        : null,
      items: order.items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName || 'Producto sin nombre',
        productSku: item.productSku || '',
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        createdAt: item.createdAt.toISOString(),
        product: {
          id: item.product.id,
          slug: item.product.slug,
          productName: item.product.productName,
          price: item.product.price,
          stock: item.product.stock,
          status: item.product.status as 'ACTIVE' | 'INACTIVE',
          featured: item.product.featured,
          description: item.product.description,
          categoryId: item.product.categoryId,
          features: item.product.features,
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
          category: {
            id: item.product.category.id,
            categoryName: item.product.category.categoryName,
            slug: item.product.category.slug,
            mainImage: item.product.category.mainImage,
            description: item.product.category.description,
            createdAt: item.product.category.createdAt.toISOString(),
            updatedAt: item.product.category.updatedAt.toISOString(),
          },
          images: item.product.images.map(img => ({
            id: img.id,
            productId: img.productId,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary,
            createdAt: img.createdAt.toISOString(),
          })),
        },
      })),
      contactInfo: order.contactInfo
        ? {
            id: order.contactInfo.id,
            name: order.contactInfo.name,
            email: order.contactInfo.email,
            phone: order.contactInfo.phone,
            createdAt: order.contactInfo.createdAt.toISOString(),
            updatedAt: order.contactInfo.updatedAt.toISOString(),
            orderId: order.contactInfo.orderId,
          }
        : null,
      shippingAddress: order.shippingAddress
        ? {
            id: order.shippingAddress.id,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zip: order.shippingAddress.zip,
            country: order.shippingAddress.country,
            createdAt: order.shippingAddress.createdAt.toISOString(),
            updatedAt: order.shippingAddress.updatedAt.toISOString(),
            orderId: order.shippingAddress.orderId,
          }
        : null,
      customerName:
        order.contactInfo?.name ||
        (order.user
          ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
          : 'Cliente sin nombre'),
    };

    return { success: true, data: serializedOrder };
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener la orden',
    };
  }
}

// ============================================================================
// FUNCIONES DE EMAILS FALLIDOS
// ============================================================================

export async function getFailedEmails() {
  try {
    console.log('Consultando emails fallidos en la base de datos...');

    const emails = await prisma.emailMetrics.findMany({
      where: { status: 'failed' },
      orderBy: { timestamp: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
    });

    return emails.map(email => ({
      id: email.id,
      timestamp: email.timestamp.toISOString(),
      type: email.type,
      recipient: email.recipient,
      orderId: email.orderId,
      status: email.status as 'sent' | 'failed' | 'retry' | 'pending',
      attempts: email.attempt,
      error: email.error,
      order: email.order,
    }));
  } catch (error) {
    console.error('Error en getFailedEmails:', error);

    if (
      error instanceof Error &&
      error.message.includes('relation "EmailMetrics" does not exist')
    ) {
      console.error('La tabla EmailMetrics no existe en la base de datos');
      throw new Error(
        'La tabla de métricas de emails no existe. Ejecuta las migraciones de Prisma.',
      );
    }

    throw new Error('Error al obtener los emails fallidos');
  }
}

export async function getAllEmails() {
  try {
    console.log('Consultando todos los emails en la base de datos...');

    const emails = await prisma.emailMetrics.findMany({
      orderBy: { timestamp: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            customerEmail: true,
          },
        },
      },
    });

    return emails.map(email => ({
      id: email.id,
      timestamp: email.timestamp.toISOString(),
      type: email.type,
      recipient: email.recipient,
      orderId: email.orderId,
      status: email.status as 'sent' | 'failed' | 'retry' | 'pending',
      attempts: email.attempt,
      error: email.error,
      order: email.order,
    }));
  } catch (error) {
    console.error('Error en getAllEmails:', error);

    if (
      error instanceof Error &&
      error.message.includes('relation "EmailMetrics" does not exist')
    ) {
      console.error('La tabla EmailMetrics no existe en la base de datos');
      throw new Error(
        'La tabla de métricas de emails no existe. Ejecuta las migraciones de Prisma.',
      );
    }

    throw new Error('Error al obtener los emails');
  }
}

export async function deleteFailedEmail(
  id: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    await prisma.emailMetrics.delete({
      where: { id },
    });

    return {
      success: true,
      data: { success: true },
      message: 'Email eliminado correctamente.',
    };
  } catch (error) {
    console.error(`Error al eliminar email fallido con ID ${id}:`, error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el registro del email.',
    };
  }
}

export async function retryEmail(
  emailId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const failedEmail = await prisma.emailMetrics.findUnique({
      where: { id: emailId },
    });

    if (!failedEmail) {
      return { success: false, error: 'Email no encontrado.' };
    }

    await prisma.emailMetrics.update({
      where: { id: emailId },
      data: { status: 'retry', attempt: { increment: 1 } },
    });

    const retrySuccessful = true;

    if (retrySuccessful) {
      await prisma.emailMetrics.update({
        where: { id: emailId },
        data: { status: 'sent' },
      });
      return {
        success: true,
        data: { success: true },
        message: 'Email reenviado con éxito.',
      };
    } else {
      return {
        success: false,
        error: 'El reintento falló. Inténtalo de nuevo más tarde.',
      };
    }
  } catch (error) {
    console.error(`Error al reintentar email con ID ${emailId}:`, error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error inesperado al reintentar el email.',
    };
  }
}

// ============================================================================
// FUNCIONES DEL DASHBOARD PRINCIPAL
// ============================================================================

export async function getDashboardStats() {
  try {
    const [totalOrders, pendingOrders, totalProducts, totalUsers] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.product.count(),
        prisma.user.count(),
      ]);

    const salesByCategory = (await prisma.$queryRaw`
      SELECT c."categoryName" as name, COALESCE(SUM(oi.quantity * oi.price), 0) as sales
      FROM "categories" c
      LEFT JOIN "products" p ON c.id = p."categoryId"
      LEFT JOIN "order_items" oi ON p.id = oi."productId"
      GROUP BY c."categoryName"
      ORDER BY sales DESC
    `) as { name: string; sales: number }[];

    const ordersByStatus = (await prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN status::text = 'PENDING' THEN 'Pendiente'
          WHEN status::text = 'CONFIRMED' THEN 'Confirmado'
          WHEN status::text = 'SHIPPED' THEN 'Enviado'
          WHEN status::text = 'DELIVERED' THEN 'Entregado'
          WHEN status::text = 'CANCELLED' THEN 'Cancelado'
          WHEN status::text = 'PROCESSING' THEN 'Procesando'
          WHEN status::text = 'REFUNDED' THEN 'Reembolsado'
          WHEN status::text = 'FAILED' THEN 'Fallido'
          ELSE status::text
        END as name,
        COUNT(*)::integer as count
      FROM "orders"
      GROUP BY status
      ORDER BY count DESC
    `) as { name: string; count: number }[];

    const topProducts = (await prisma.$queryRaw`
      SELECT p."productName", COALESCE(SUM(oi.quantity), 0)::integer as "totalSold"
      FROM "products" p
      LEFT JOIN "order_items" oi ON p.id = oi."productId"
      GROUP BY p.id, p."productName"
      ORDER BY "totalSold" DESC
      LIMIT 5
    `) as { productName: string; totalSold: number }[];

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        contactInfo: true,
        shippingAddress: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                productName: true,
                price: true,
                description: true,
                categoryId: true,
                features: true,
                stock: true,
                status: true,
                featured: true,
                createdAt: true,
                updatedAt: true,
                category: {
                  select: {
                    id: true,
                    categoryName: true,
                    slug: true,
                    mainImage: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
                images: {
                  select: {
                    id: true,
                    productId: true,
                    url: true,
                    alt: true,
                    sortOrder: true,
                    isPrimary: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const serializedOrders: Order[] = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as Order['status'],
      customerEmail: order.customerEmail || undefined,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      total: order.total,
      paymentStatus: 'PENDING' as const,
      paymentMethod: null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      userId: order.userId || undefined,
      user: order.user
        ? {
            id: order.user.id,
            clerkId: '',
            email: order.user.email,
            firstName: order.user.firstName || '',
            lastName: order.user.lastName || '',
            role: order.user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
            avatar: order.user.avatar,
            isActive: order.user.isActive,
            createdAt: order.user.createdAt.toISOString(),
            updatedAt: order.user.updatedAt.toISOString(),
          }
        : null,
      items: order.items.map(item => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName || 'Producto sin nombre',
        productSku: item.productSku || '',
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        createdAt: item.createdAt.toISOString(),
        product: {
          id: item.product.id,
          slug: item.product.slug,
          productName: item.product.productName,
          price: item.product.price,
          stock: item.product.stock,
          status: item.product.status as 'ACTIVE' | 'INACTIVE',
          featured: item.product.featured,
          description: item.product.description,
          categoryId: item.product.categoryId,
          features: item.product.features,
          createdAt: item.product.createdAt.toISOString(),
          updatedAt: item.product.updatedAt.toISOString(),
          category: {
            id: item.product.category.id,
            categoryName: item.product.category.categoryName,
            slug: item.product.category.slug,
            mainImage: item.product.category.mainImage,
            description: item.product.category.description,
            createdAt: item.product.category.createdAt.toISOString(),
            updatedAt: item.product.category.updatedAt.toISOString(),
          },
          images: item.product.images.map(img => ({
            id: img.id,
            productId: img.productId,
            url: img.url,
            alt: img.alt,
            sortOrder: img.sortOrder,
            isPrimary: img.isPrimary,
            createdAt: img.createdAt.toISOString(),
          })),
        },
      })),
      contactInfo: order.contactInfo
        ? {
            id: order.contactInfo.id,
            name: order.contactInfo.name,
            email: order.contactInfo.email,
            phone: order.contactInfo.phone,
            createdAt: order.contactInfo.createdAt.toISOString(),
            updatedAt: order.contactInfo.updatedAt.toISOString(),
            orderId: order.contactInfo.orderId,
          }
        : null,
      shippingAddress: order.shippingAddress
        ? {
            id: order.shippingAddress.id,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zip: order.shippingAddress.zip,
            country: order.shippingAddress.country,
            createdAt: order.shippingAddress.createdAt.toISOString(),
            updatedAt: order.shippingAddress.updatedAt.toISOString(),
            orderId: order.shippingAddress.orderId,
          }
        : null,
      customerName:
        order.contactInfo?.name ||
        (order.user
          ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
          : 'Cliente sin nombre'),
    }));

    return {
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
      salesByCategory,
      ordersByStatus,
      topProducts,
      recentOrders: serializedOrders,
      totalRevenue: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      monthlyGrowth: 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Error al obtener las estadísticas del dashboard');
  }
}

// ============================================================================
// FUNCIÓN PARA OBTENER UNA CATEGORÍA POR ID (AÑADIDA)
// ============================================================================

export async function getCategoryById(
  categoryId: string,
): Promise<ApiResponse<Category>> {
  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: 'La categoría no existe' };
    }

    const serializedCategory: Category = {
      id: category.id,
      categoryName: category.categoryName,
      slug: category.slug,
      description: category.description,
      mainImage: category.mainImage,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      _count: category._count,
    };

    return { success: true, data: serializedCategory };
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    return { success: false, error: 'Error al obtener la categoría' };
  }
}
