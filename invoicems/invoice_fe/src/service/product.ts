import { smClient } from "@/lib";

// Product Category DTO
export interface CreateCategoryDTO {
  createdBy: string | null;
  createdDate: string | null;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  categoryId?: string;
  categoryName: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface CategoryResponse {
  createdBy: string | null;
  createdDate: string | null;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  categoryId: string;
  categoryName: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ProductResponse {
  productId: string;
  productName: string;
  productCode: string;
  categoryId: string;
  description: string;
  unitPrice: string;
  stockUnit: string;
  taxRate: string;
  status: "ACTIVE" | "INACTIVE";
  quantity?: number;
  createdBy?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

export type CreateProductDTO = Omit<ProductResponse, "productId" | "createdDate" | "lastModifiedDate" | "createdBy"> & {
  createdBy?: string | null;
};

// Create Product Category
export const createProductCategory = async (
  categoryData: CreateCategoryDTO
): Promise<CategoryResponse> => {
  try {
    const response = await smClient.post(
      "category/createCategory",
      categoryData
    );
    console.log("Category created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Get all Product Categories
export const getProductCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await smClient.get("category/getAllCategories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<ProductResponse[]> => {
  const response = await smClient.get("product/getAllProducts");
  return response.data;
};

export const createProduct = async (productData: CreateProductDTO): Promise<ProductResponse> => {
  const response = await smClient.post("product/createProduct", productData);
  return response.data;
};

// Get Product Category by ID
export const getProductCategoryById = async (
  categoryId: string
): Promise<CategoryResponse> => {
  try {
    const response = await smClient.get(
      `category/getCategoryById/${categoryId}`
    );
    console.log("Category fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// Update Product Category
export const updateProductCategory = async (
  categoryId: string,
  categoryData: Partial<CreateCategoryDTO>
): Promise<CategoryResponse> => {
  try {
    const response = await smClient.put(
      `category/updateByCategoryId/${categoryId}`,
      categoryData
    );
    console.log("Category updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete Product Category
export const deleteProductCategory = async (
  categoryId: string
): Promise<void> => {
  try {
    await smClient.delete(`category/deleteCategory/${categoryId}`);
    console.log("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
