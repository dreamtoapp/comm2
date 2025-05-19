"use server";
import db from "../../../../lib/prisma";

export const getAllProduct = async () => {
  const product = await db.product.findMany();
  return product;
};

export const getAllProductsWithSupplier = async (supplierId?: string) => {
 
  try {
    const products = await db.product.findMany({
      where: supplierId ? { supplierId } : undefined, // Filter by supplierId if provided
      include: {
        supplier: true, // Include supplier information
      },
    });
   
    return products;
  } catch (error) {
    console.error("Error fetching products with supplier info:", error);
    throw new Error("Failed to fetch products.");
  }
};

export async function getAllSuppliers() {
  return await db.supplier.findMany({ select: { id: true, name: true,type:true } });
}
