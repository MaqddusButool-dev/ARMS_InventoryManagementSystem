import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { name, sku, categoryId, description, quantity, unit, minStock } = body;
    const product = await prisma.product.create({
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
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}