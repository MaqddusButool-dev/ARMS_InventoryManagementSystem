"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const stockLevels = [
  {
    product: "Steel Rebar",
    quantity: 500,
    minStock: 100,
    maxStock: 1000,
    status: "Optimal",
  },
  {
    product: "Steel Plate",
    quantity: 50,
    minStock: 100,
    maxStock: 500,
    status: "Low",
  },
  {
    product: "Steel Pipe",
    quantity: 450,
    minStock: 200,
    maxStock: 600,
    status: "Optimal",
  },
  {
    product: "Steel Beam",
    quantity: 580,
    minStock: 300,
    maxStock: 600,
    status: "High",
  },
];

export function StockReport() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>Current inventory status by product</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Max Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockLevels.map((item) => (
                <TableRow key={item.product}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>{item.maxStock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Low"
                          ? "destructive"
                          : item.status === "High"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Optimal Stock Items
            </CardTitle>
            <span className="text-2xl font-bold text-green-500">24</span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <span className="text-2xl font-bold text-red-500">3</span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Stock Items</CardTitle>
            <span className="text-2xl font-bold text-blue-500">5</span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock Utilization
            </CardTitle>
            <span className="text-2xl font-bold">78%</span>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}