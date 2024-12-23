"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jan", inbound: 65, outbound: 45 },
  { date: "Feb", inbound: 75, outbound: 55 },
  { date: "Mar", inbound: 85, outbound: 65 },
  { date: "Apr", inbound: 95, outbound: 75 },
  { date: "May", inbound: 105, outbound: 85 },
  { date: "Jun", inbound: 115, outbound: 95 },
];

export function TransactionReport() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Monthly transaction volume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}