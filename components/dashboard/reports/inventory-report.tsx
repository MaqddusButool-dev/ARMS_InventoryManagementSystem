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

const inventoryData = [
  {
    category: "Steel Bars",
    totalItems: 1250,
    value: "$125,000",
    turnover: "4.2",
  },
  {
    category: "Steel Plates",
    totalItems: 850,
    value: "$212,500",
    turnover: "3.8",
  },
  {
    category: "Steel Pipes",
    totalItems: 1500,
    value: "$187,500",
    turnover: "5.1",
  },
  {
    category: "Steel Sheets",
    totalItems: 950,
    value: "$142,500",
    turnover: "4.5",
  },
];

export function InventoryReport() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Inventory Analysis</CardTitle>
        <CardDescription>Stock levels by category</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Turnover</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item) => (
              <TableRow key={item.category}>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">{item.totalItems}</TableCell>
                <TableCell className="text-right">{item.value}</TableCell>
                <TableCell className="text-right">{item.turnover}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}