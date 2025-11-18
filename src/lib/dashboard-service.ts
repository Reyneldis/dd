// src/lib/dashboard-service.ts
import { deleteBlobs } from '@/lib/vercel-blob';
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
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

// ============================================================================
// TIPOS Y INTERFACES (Sin cambios, ya están bien definidos)
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

// <-- CAMBIO CLAVE: Asegúrate que esta interfaz incluya el campo 'images'
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
  images?: File[]; // <-- ¡Este es el campo clave!
  avatar?: string;
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
// FUNCIONES DE PRODUCTOS (CON MANEJO DE IMÁGENES CORREGIDO)
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

    let uploadedImages: { url: string; alt?: string }[] = [];
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

// src/lib/dashboard-service.ts - Función updateProduct mejorada

export async function updateProduct(
  productId: string,
  productData: UpdateProductData,
): Promise<ApiResponse<Product>> {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!existingProduct) {
      return { success: false, error: 'El producto no existe' };
    }

    // 1. Separar los datos del producto de los datos de las imágenes
    const { images: newImages, ...productFields } = productData;

    // 2. Preparar los datos para la actualización del producto
    const updateData: Prisma.ProductUpdateInput = {
      productName: productFields.productName,
      slug: productFields.slug,
      price: productFields.price,
      stock: productFields.stock,
      description: productFields.description,
      features: productFields.features,
      status: productFields.status,
      featured: productFields.featured,
    };

    if (productFields.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: productFields.categoryId },
      });

      if (!category) {
        return { success: false, error: 'La categoría especificada no existe' };
      }
      updateData.category = {
        connect: {
          id: productFields.categoryId,
        },
      };
    }

    // 3. Manejar la actualización de imágenes
    let imageUpdateData: Prisma.ProductUpdateInput['images'] = undefined;

    if (newImages && newImages.length > 0) {
      // 3a. Obtener URLs de imágenes antiguas para eliminarlas de Vercel Blob
      const oldImageUrls = existingProduct.images.map(img => img.url);

      // 3b. Eliminar las imágenes antiguas de la base de datos
      await prisma.productImage.deleteMany({
        where: { productId: productId },
      });

      // 3c. Subir las nuevas imágenes a Vercel Blob
      const uploadedImages: { url: string; alt?: string }[] = [];
      for (const image of newImages) {
        if (!image || image.size === 0) continue;
        const blob = await put(image.name, image, {
          access: 'public',
          addRandomSuffix: true,
        });
        uploadedImages.push({
          url: blob.url,
          alt: productFields.productName || 'Imagen de producto',
        });
      }

      // 3d. Preparar los datos para Prisma
      imageUpdateData = {
        create: uploadedImages.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: index,
          isPrimary: index === 0,
        })),
      };

      // 3e. Eliminar imágenes antiguas de Vercel Blob (en segundo plano para no bloquear)
      // Nota: Esto requeriría una función de utilidad para eliminar de Vercel Blob
      // que no está implementada en el código actual
    } else if (newImages && newImages.length === 0) {
      // Si se envía un array vacío, se interpreta como "borrar todas las imágenes"
      const oldImageUrls = existingProduct.images.map(img => img.url);

      await prisma.productImage.deleteMany({
        where: { productId: productId },
      });

      // Eliminar imágenes antiguas de Vercel Blob (en segundo plano)
      // Nota: Esto requeriría una función de utilidad para eliminar de Vercel Blob
    }

    // 4. Unir los datos de actualización del producto con los de las imágenes
    const finalUpdateData = {
      ...updateData,
      images: imageUpdateData,
    };

    // 5. Ejecutar la actualización en la base de datos
    const product = await prisma.product.update({
      where: { id: productId },
      data: finalUpdateData,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { orderItems: true, reviews: true } },
      },
    });

    // 6. Serializar el producto actualizado para la respuesta
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

// src/lib/dashboard-service.ts - Función deleteProduct mejorada

export async function deleteProduct(
  productId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true }, // Incluir imágenes para poder eliminarlas
    });

    if (!existingProduct) {
      return { success: false, error: 'El producto no existe' };
    }

    // Eliminar imágenes de Vercel Blob
    if (existingProduct.images.length > 0) {
      const imageUrls = existingProduct.images.map(img => img.url);
      const { success, failed } = await deleteBlobs(imageUrls);

      if (failed.length > 0) {
        console.warn(
          `Failed to delete ${failed.length} images from Vercel Blob`,
        );
      }
    }

    // Eliminar el producto de la base de datos
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
// ... (El resto de tus funciones como getCategories, createCategory, etc. van aquí, sin cambios)
// ============================================================================

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
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
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
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'categories');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.log(error);
  }

  const fileName = `${categoryId}-${Date.now()}-${image.name}`;
  const filePath = join(uploadDir, fileName);

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  return `/uploads/categories/${fileName}`;
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

    const category = await prisma.category.create({
      data: {
        categoryName: categoryData.categoryName,
        slug,
        description: categoryData.description,
      },
    });

    if (categoryData.mainImage) {
      let imageUrl: string;

      if (categoryData.mainImage instanceof File) {
        imageUrl = await saveCategoryImageLocally(
          categoryData.mainImage,
          category.id,
        );
      } else {
        imageUrl = categoryData.mainImage;
      }

      await prisma.category.update({
        where: { id: category.id },
        data: { mainImage: imageUrl },
      });
    }

    const updatedCategory = await prisma.category.findUnique({
      where: { id: category.id },
      include: { _count: { select: { products: true } } },
    });

    // *** INICIO DE LA SOLUCIÓN - Serialización Correcta ***
    if (!updatedCategory) {
      return {
        success: false,
        error: 'No se pudo recuperar la categoría después de crearla.',
      };
    }

    const serializedCategory: Category = {
      id: updatedCategory.id,
      categoryName: updatedCategory.categoryName,
      slug: updatedCategory.slug,
      description: updatedCategory.description,
      mainImage: updatedCategory.mainImage,
      createdAt: updatedCategory.createdAt.toISOString(),
      updatedAt: updatedCategory.updatedAt.toISOString(),
      _count: updatedCategory._count,
    };

    return {
      success: true,
      data: serializedCategory, // <-- Devolvemos el objeto serializado
    };
    // *** FIN DE LA SOLUCIÓN ***
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
      return {
        success: false,
        error: 'La categoría no existe',
      };
    }

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

    if (categoryData.mainImage !== undefined) {
      if (categoryData.mainImage instanceof File) {
        updateData.mainImage = await saveCategoryImageLocally(
          categoryData.mainImage,
          categoryId,
        );
      } else if (categoryData.mainImage === null) {
        updateData.mainImage = null;
      } else {
        updateData.mainImage = categoryData.mainImage;
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
      include: { _count: { select: { products: true } } },
    });

    // *** INICIO DE LA SOLUCIÓN - Serialización Correcta ***
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
      data: serializedCategory, // <-- Devolvemos el objeto serializado
    };
    // *** FIN DE LA SOLUCIÓN ***
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
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
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

// src/lib/dashboard-service.ts (modificación de la función getOrders)

export async function getOrders(
  filters: OrderFilters = {},
): Promise<OrdersResponse> {
  try {
    const { search = '', status, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

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

    // Serialización explícita para evitar problemas con las fechas
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

// ============================================================================
// FUNCIONES DE USUARIOS
// ============================================================================

export async function getUsers(
  filters: UserFilters = {},
): Promise<PaginatedResponse<User>> {
  try {
    const { search = '', role, isActive, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

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
      return {
        success: false,
        error: 'El usuario no existe',
      };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    // *** INICIO DE LA SOLUCIÓN - Serialización Correcta ***
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

    return {
      success: true,
      data: serializedUser, // <-- Devolvemos el objeto serializado
    };
    // *** FIN DE LA SOLUCIÓN ***
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

// src/lib/dashboard-service.ts - Actualizar la función getFailedEmails

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

    console.log(
      `Se encontraron ${emails.length} emails fallidos en la base de datos`,
    );

    return emails.map(email => ({
      id: email.id,
      timestamp: email.timestamp.toISOString(),
      type: email.type,
      recipient: email.recipient,
      orderId: email.orderId,
      status: email.status as 'sent' | 'failed' | 'retry' | 'pending',
      attempts: email.attempt, // Mapear de 'attempt' a 'attempts'
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

// src/lib/dashboard-service.ts - Agregar esta nueva función

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

    console.log(`Se encontraron ${emails.length} emails en la base de datos`);

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
// src/lib/dashboard-service.ts

// ... (el resto de tu archivo)

// ============================================================================
// FUNCIONES DE EMAILS FALLIDOS (VERSIÓN FINAL Y ÚNICA)
// ============================================================================

// ============================================================================
// FUNCIONES DE EMAILS FALLIDOS (VERSIÓN FINAL Y ÚNICA)
// ============================================================================

/**
 * 🎯 Elimina un registro de email fallido.
 * @param id - El ID del registro de email a eliminar.
 * @returns Un objeto ApiResponse con el estado de la operación.
 */
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

/**
 * 🎯 Intenta reenviar un email fallido.
 * @param id - El ID del registro de email a reintentar.
 * @returns Un objeto ApiResponse con el estado de la operación.
 */
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

    // Simulamos que el reintento fue exitoso
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
// ... (asegúrate de que esté exportada junto a tus otras funciones)
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
                stock: true, // <-- CAMBIO: Añadido
                status: true, // <-- CAMBIO: Añadido
                featured: true, // <-- CAMBIO: Añadido
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
