import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total products
    const totalProducts = await prisma.product.count();

    // Get low stock items
    const lowStock = await prisma.product.count({
      where: {
        quantity: {
          lte: prisma.product.fields.minStock,
        },
      },
    });

    // Get today's transactions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inboundToday = await prisma.transaction.count({
      where: {
        type: "INBOUND",
        createdAt: {
          gte: today,
        },
      },
    });

    const outboundToday = await prisma.transaction.count({
      where: {
        type: "OUTBOUND",
        createdAt: {
          gte: today,
        },
      },
    });

    // Get chart data for the last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      return date;
    }).reverse();

    const chartData = await Promise.all(
      dates.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const [inbound, outbound] = await Promise.all([
          prisma.transaction.count({
            where: {
              type: "INBOUND",
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
          }),
          prisma.transaction.count({
            where: {
              type: "OUTBOUND",
              createdAt: {
                gte: date,
                lt: nextDate,
              },
            },
          }),
        ]);

        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          inbound,
          outbound,
        };
      })
    );

    return NextResponse.json({
      stats: {
        totalProducts,
        lowStock,
        inboundToday,
        outboundToday,
      },
      chartData,
    });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}