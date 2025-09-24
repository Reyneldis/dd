// src/lib/dashboard-service.ts

import { Category, Order, OrdersResponse, Product, User } from '@/types';
import { OrderStatus, PrismaClient, Role, Status } from '@prisma/client';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

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
  slug: string;
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
}

interface CreateCategoryData {
  categoryName: string;
  slug: string;
  description?: string;
  mainImage?: File | string;
}

interface UpdateCategoryData {
  categoryName?: string;
  slug?: string;
  description?: string;
  mainImage?: File | string | null; // Permitir null para eliminar la imagen
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
  avatar?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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

// src/lib/dashboard-service.ts

// ... código anterior ...

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

    // Construir condiciones de búsqueda
    const whereConditions: Record<string, unknown> = {};

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

    // Serializar productos
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
      createdAt: product.createdAt.toISOString(), // Convertir Date a string
      updatedAt: product.updatedAt.toISOString(), // Convertir Date a string
      category: {
        id: product.category.id,
        categoryName: product.category.categoryName,
        slug: product.category.slug,
        description: product.category.description,
        mainImage: product.category.mainImage,
        createdAt: product.category.createdAt.toISOString(), // Convertir Date a string
        updatedAt: product.category.updatedAt.toISOString(), // Convertir Date a string
      },
      images: product.images.map(img => ({
        id: img.id,
        productId: img.productId,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt.toISOString(), // Convertir Date a string
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

// ... código posterior ...

// Función para guardar imágenes localmente
async function saveImageLocally(
  image: File,
  productId: string,
): Promise<string> {
  // Crear directorio si no existe
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    // El directorio ya existe, ignorar error
    console.log(error);
  }

  // Generar nombre de archivo único
  const fileName = `${productId}-${Date.now()}-${image.name}`;
  const filePath = join(uploadDir, fileName);

  // Guardar archivo
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // Retornar URL pública
  return `/uploads/products/${fileName}`;
}

// src/lib/dashboard-service.ts

// ... código anterior ...

export async function createProduct(
  productData: CreateProductData,
): Promise<ApiResponse<Product>> {
  try {
    // Validar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });

    if (!category) {
      return {
        success: false,
        error: 'La categoría especificada no existe',
      };
    }

    // Generar slug si no se proporciona
    const slug =
      productData.slug ||
      productData.productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Crear el producto primero sin imágenes
    const product = await prisma.product.create({
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
      },
      include: {
        category: true,
        images: true,
      },
    });

    // Procesar imágenes si existen
    if (productData.images && productData.images.length > 0) {
      const imagePromises = productData.images.map(async (image, index) => {
        const imageUrl = await saveImageLocally(image, product.id);

        return prisma.productImage.create({
          data: {
            productId: product.id,
            url: imageUrl,
            alt: productData.productName,
            sortOrder: index,
            isPrimary: index === 0,
          },
        });
      });

      await Promise.all(imagePromises);
    }

    // Recuperar el producto con las imágenes actualizadas
    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // Serializar el producto para que coincida con el tipo Product
    const serializedProduct: Product = {
      id: updatedProduct!.id,
      slug: updatedProduct!.slug,
      productName: updatedProduct!.productName,
      price: updatedProduct!.price,
      stock: updatedProduct!.stock,
      description: updatedProduct!.description,
      categoryId: updatedProduct!.categoryId,
      features: updatedProduct!.features,
      status: updatedProduct!.status as 'ACTIVE' | 'INACTIVE',
      featured: updatedProduct!.featured,
      createdAt: updatedProduct!.createdAt.toISOString(), // Convertir Date a string
      updatedAt: updatedProduct!.updatedAt.toISOString(), // Convertir Date a string
      category: {
        id: updatedProduct!.category.id,
        categoryName: updatedProduct!.category.categoryName,
        slug: updatedProduct!.category.slug,
        description: updatedProduct!.category.description,
        mainImage: updatedProduct!.category.mainImage,
        createdAt: updatedProduct!.category.createdAt.toISOString(), // Convertir Date a string
        updatedAt: updatedProduct!.category.updatedAt.toISOString(), // Convertir Date a string
      },
      images: updatedProduct!.images.map(img => ({
        id: img.id,
        productId: img.productId,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt.toISOString(), // Convertir Date a string
      })),
      reviewCount: 0,
      _count: {
        reviews: 0,
        orderItems: 0,
      },
    };

    return {
      success: true,
      data: serializedProduct,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear el producto',
    };
  }
}

// ... código posterior ...

export async function updateProduct(
  productId: string,
  productData: UpdateProductData,
): Promise<ApiResponse<Product>> {
  try {
    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: 'El producto no existe',
      };
    }

    // Si se actualiza la categoría, verificar que existe
    if (productData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId },
      });

      if (!category) {
        return {
          success: false,
          error: 'La categoría especificada no existe',
        };
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: productData,
      include: {
        category: true,
        images: true,
      },
    });

    // Serializar el producto para que coincida con el tipo Product
    const serializedProduct: Product = {
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
      createdAt: product.createdAt.toISOString(), // Convertir Date a string
      updatedAt: product.updatedAt.toISOString(), // Convertir Date a string
      category: {
        id: product.category.id,
        categoryName: product.category.categoryName,
        slug: product.category.slug,
        description: product.category.description,
        mainImage: product.category.mainImage,
        createdAt: product.category.createdAt.toISOString(), // Convertir Date a string
        updatedAt: product.category.updatedAt.toISOString(), // Convertir Date a string
      },
      images: product.images.map(img => ({
        id: img.id,
        productId: img.productId,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
        createdAt: img.createdAt.toISOString(), // Convertir Date a string
      })),
      reviewCount: 0,
      _count: {
        reviews: 0,
        orderItems: 0,
      },
    };

    return {
      success: true,
      data: serializedProduct,
    };
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
    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: 'El producto no existe',
      };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return {
      success: true,
      data: { success: true },
    };
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

    const whereConditions: Record<string, unknown> = {};

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
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      _count: category._count,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Error al obtener las categorías');
  }
}

// Función para guardar imágenes de categorías localmente
async function saveCategoryImageLocally(
  image: File,
  categoryId: string,
): Promise<string> {
  // Crear directorio si no existe
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'categories');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    // El directorio ya existe, ignorar error
    console.log(error);
  }

  // Generar nombre de archivo único
  const fileName = `${categoryId}-${Date.now()}-${image.name}`;
  const filePath = join(uploadDir, fileName);

  // Guardar archivo
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // Retornar URL pública
  return `/uploads/categories/${fileName}`;
}

export async function createCategory(
  categoryData: CreateCategoryData,
): Promise<ApiResponse<Category>> {
  try {
    // Generar slug si no se proporciona
    const slug =
      categoryData.slug ||
      categoryData.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Verificar que el slug no existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return {
        success: false,
        error: 'Ya existe una categoría con este slug',
      };
    }

    // Crear la categoría primero sin imagen
    const category = await prisma.category.create({
      data: {
        categoryName: categoryData.categoryName,
        slug,
        description: categoryData.description,
      },
    });

    // Procesar imagen si existe
    if (categoryData.mainImage) {
      let imageUrl: string;

      if (categoryData.mainImage instanceof File) {
        imageUrl = await saveCategoryImageLocally(
          categoryData.mainImage,
          category.id,
        );
      } else {
        imageUrl = categoryData.mainImage; // Es una URL existente
      }

      await prisma.category.update({
        where: { id: category.id },
        data: { mainImage: imageUrl },
      });
    }

    // Recuperar la categoría con la imagen actualizada
    const updatedCategory = await prisma.category.findUnique({
      where: { id: category.id },
    });

    // Serializar la categoría para que coincida con el tipo Category
    const serializedCategory: Category = {
      id: updatedCategory!.id,
      categoryName: updatedCategory!.categoryName,
      slug: updatedCategory!.slug,
      description: updatedCategory!.description,
      mainImage: updatedCategory!.mainImage,
      createdAt: updatedCategory!.createdAt.toISOString(), // Convertir Date a string
      updatedAt: updatedCategory!.updatedAt.toISOString(), // Convertir Date a string
      _count: {
        products: 0,
      },
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
    // Verificar que la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return {
        success: false,
        error: 'La categoría no existe',
      };
    }

    // Si se actualiza el slug, verificar que no existe
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

    // Preparar datos para la actualización
    type CategoryUpdateData = {
      categoryName?: string;
      slug?: string;
      description?: string;
      mainImage?: string | null;
    };

    const updateData: CategoryUpdateData = {
      categoryName: categoryData.categoryName,
      slug: categoryData.slug,
      description: categoryData.description,
    };

    // Procesar imagen si existe
    if (categoryData.mainImage !== undefined) {
      if (categoryData.mainImage instanceof File) {
        // Es un nuevo archivo de imagen
        updateData.mainImage = await saveCategoryImageLocally(
          categoryData.mainImage,
          categoryId,
        );
      } else if (categoryData.mainImage === null) {
        // Se quiere eliminar la imagen
        updateData.mainImage = null;
      } else {
        // Es una URL existente
        updateData.mainImage = categoryData.mainImage;
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });

    return {
      success: true,
      data: category as Category,
    };
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

export async function deleteCategory(
  categoryId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log('Deleting category with ID:', categoryId);

    // Verificar que la categoría existe
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

    console.log('Existing category:', existingCategory);

    if (!existingCategory) {
      console.error('Category not found');
      return {
        success: false,
        error: 'La categoría no existe',
      };
    }

    // Verificar que no tiene productos asociados
    console.log('Product count:', existingCategory._count.products);
    if (existingCategory._count.products > 0) {
      console.error('Category has associated products');
      return {
        success: false,
        error:
          'No se puede eliminar la categoría porque tiene productos asociados',
      };
    }

    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });

    console.log('Deleted category:', deletedCategory);

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    console.error('Error in deleteCategory service:', error);

    // Capturar error específico de Prisma para restricción de clave foránea
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);

      if (error.message.includes('foreign key constraint')) {
        console.error('Foreign key constraint detected');
        return {
          success: false,
          error:
            'No se puede eliminar la categoría porque tiene productos asociados',
        };
      }
    }

    // Si el error es de Prisma, intentar obtener más información
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as {
        code: string;
        meta?: Record<string, unknown>;
      };
      console.error('Prisma error code:', prismaError.code);
      console.error('Prisma error meta:', prismaError.meta);
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
      return {
        success: false,
        error: 'El usuario no existe',
      };
    }

    const serializedUser: User = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      success: true,
      data: serializedUser,
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {
      success: false,
      error: 'Error al obtener el usuario',
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

    // Construir condiciones de búsqueda
    const whereConditions: Record<string, unknown> = {};

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

    // Serializar las órdenes
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
            clerkId: '', // No disponible en la consulta actual
            email: order.user.email,
            firstName: order.user.firstName || '',
            lastName: order.user.lastName || '',
            role: order.user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
            avatar: order.user.avatar,
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
      // Agregar customerName para compatibilidad con RecentOrdersTable
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
    // Validar que el status sea válido
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

// ============================================================================
// FUNCIONES DE USUARIOS
// ============================================================================

export async function getUsers(
  filters: UserFilters = {},
): Promise<PaginatedResponse<User>> {
  try {
    const { search = '', role, isActive, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    // Construir condiciones de búsqueda
    const whereConditions: Record<string, unknown> = {};

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

    // Serializar usuarios
    const serializedUsers: User[] = users.map(user => ({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        error: 'El usuario no existe',
      };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    return {
      success: true,
      data: user as User,
    };
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
    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        error: 'El usuario no existe',
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !existingUser.isActive },
    });

    return {
      success: true,
      data: { success: true },
    };
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
// FUNCIONES DE EMAILS FALLIDOS
// ============================================================================

export async function getFailedEmails() {
  try {
    console.log('Consultando emails fallidos en la base de datos...');

    // Verificar si la tabla EmailMetrics existe
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

    console.log(
      `Se encontraron ${emails.length} emails fallidos en la base de datos`,
    );

    return emails.map(email => ({
      id: email.id,
      timestamp: email.timestamp.toISOString(),
      type: email.type,
      recipient: email.recipient,
      orderId: email.orderId,
      status: email.status,
      attempt: email.attempt,
      error: email.error,
      order: email.order,
    }));
  } catch (error) {
    console.error('Error en getFailedEmails:', error);

    // Si el error es que la tabla no existe, lo mostramos claramente
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

export async function retryEmail(
  emailId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    await prisma.emailMetrics.update({
      where: { id: emailId },
      data: {
        status: 'retry',
        attempt: { increment: 1 },
      },
    });

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    console.error('Error retrying email:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al reintentar el email',
    };
  }
}

// ============================================================================
// FUNCIONES DEL DASHBOARD PRINCIPAL
// ============================================================================

export async function getDashboardStats() {
  try {
    // Estadísticas básicas
    const [totalOrders, pendingOrders, totalProducts, totalUsers] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.product.count(),
        prisma.user.count(),
      ]);

    // Ventas por categoría
    const salesByCategory = (await prisma.$queryRaw`
      SELECT c."categoryName" as name, COALESCE(SUM(oi.quantity * oi.price), 0) as sales
      FROM "categories" c
      LEFT JOIN "products" p ON c.id = p."categoryId"
      LEFT JOIN "order_items" oi ON p.id = oi."productId"
      GROUP BY c."categoryName"
      ORDER BY sales DESC
    `) as { name: string; sales: number }[];

    // Pedidos por estado
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

    // Productos más vendidos
    const topProducts = (await prisma.$queryRaw`
      SELECT p."productName", COALESCE(SUM(oi.quantity), 0)::integer as "totalSold"
      FROM "products" p
      LEFT JOIN "order_items" oi ON p.id = oi."productId"
      GROUP BY p.id, p."productName"
      ORDER BY "totalSold" DESC
      LIMIT 5
    `) as { productName: string; totalSold: number }[];

    // Pedidos recientes - Ahora obtenemos los datos completos de Order
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

    // Serializar las órdenes al formato Order[]
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
            clerkId: '', // No disponible en la consulta actual
            email: order.user.email,
            firstName: order.user.firstName || '',
            lastName: order.user.lastName || '',
            role: order.user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
            avatar: order.user.avatar,
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
      // Agregar customerName para compatibilidad con RecentOrdersTable
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
      recentOrders: serializedOrders, // Ahora devuelve Order[] con customerName
      totalRevenue: 0, // Calcular si es necesario
      averageOrderValue: 0, // Calcular si es necesario
      conversionRate: 0, // Calcular si es necesario
      monthlyGrowth: 0, // Calcular si es necesario
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Error al obtener las estadísticas del dashboard');
  }
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

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
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: 'Orden no encontrada',
      };
    }

    // Serializar la orden (similar a getOrders)
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
      // Agregar customerName para compatibilidad con RecentOrdersTable
      customerName:
        order.contactInfo?.name ||
        (order.user
          ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim()
          : 'Cliente sin nombre'),
    };

    return {
      success: true,
      data: serializedOrder,
    };
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al obtener la orden',
    };
  }
}
