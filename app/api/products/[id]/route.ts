
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";


const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  categoryId: z.string().cuid(),
  description: z.string().optional(),
  quantity: z.number().int().nonnegative(),
  unit: z.string().min(1),
  minStock: z.number().int().nonnegative(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}



export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  
  try {
    
    const body = await req.json();
    const result = productSchema.safeParse(body);
   

    if (!result.success) {
      console.error("Validation failed:", result.error.issues);
      return new NextResponse("Invalid request body", { status: 400 });
    }
    

    const { name, sku, categoryId, description, quantity, unit, minStock } = result.data;
    
    const product = await prisma.product.update({
      
      where: {
        id: params.id,
      },
      data: {
        name,
        sku,
        categoryId,
        description,
        quantity,
        unit,
        minStock,
      },
      include: {
        category: true,
      },
      
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}



// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   console.log("line 96---------------------------------");
  
  
//   try {
//     console.log("line 99---------------------------------");
//     const product = await prisma.product.findUnique({
//       where: { id: params.id },
//     });
//     console.log("line 103---------------------------------");

//     if (!product) {
//       return new NextResponse("Product not found", { status: 404 });
//     }
//     console.log("line 108---------------------------------");
//     await prisma.transaction.deleteMany({
//       where: { productId: params.id },
//     });

//     console.log("line 113---------------------------------");
//     // Now delete the product
//     await prisma.product.delete({
//       where: { id: params.id },
//     });

//     return new NextResponse(null, { status: 204 });
//     console.log("line 120---------------------------------");
//   } catch (error: any) {
//     console.log("line 122---------------------------------");
//     console.error("[PRODUCT_DELETE]", error);
//     console.log("line 124---------------------------------");
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("Deleting product with ID:", params.id);

  try {
    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    console.log("Product found:", product);

    // Perform all operations in a transaction for atomicity
    await prisma.$transaction(async (prisma) => {
      // Nullify related order items
      const orderItems = await prisma.orderItem.findMany({
        where: { productId: params.id },
      });

      if (orderItems.length > 0) {
        console.log("Nullifying related order items...");
        await prisma.orderItem.updateMany({
          where: { productId: params.id },
          data: { productId: undefined },
        });
      }

      // Delete related transactions
      console.log("Deleting related transactions...");
      await prisma.transaction.deleteMany({
        where: { productId: params.id },
      });

      // Delete the product
      console.log("Deleting the product...");
      await prisma.product.delete({
        where: { id: params.id },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("[PRODUCT_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
