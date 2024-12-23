import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear(); 

  return `${day}-${month}-${year}`;
}

const currentDate = new Date();
const formattedDate = formatDate(currentDate);
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerSupplier, status, items, notes } = body;
    const totalAmount = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );
    

    const uniqueId = Math.floor(Math.random() * 10000);
    const order = await prisma.order.create({
      
      
      data: {
        orderNumber: `${type === "PURCHASE" ? "PO" : "SO"}-${formattedDate}-${uniqueId}`,
        // orderNumber: `${type === "PURCHASE" ? "PO" : "SO"}-${formattedDate}`,
        type,
        status,
        [type === "PURCHASE" ? "supplier" : "customer"]: customerSupplier,
        totalAmount,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
          
        },
        
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log(" api line 77----------------------------------------")

    return NextResponse.json(order);
    console.log(" api line 80----------------------------------------")
  } catch (error) {
    console.log(" api line 82----------------------------------------")
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
    
  }
  console.log(" api line 81 end api ----------------------------------------")
}