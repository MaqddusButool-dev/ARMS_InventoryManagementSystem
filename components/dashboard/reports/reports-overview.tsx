"use client";

import { Card } from "@/components/ui/card";
import { FileBarChart, PackageSearch, ArrowUpDown } from "lucide-react";

const stats = [
  {
    title: "Total Transactions",
    value: "2,345",
    description: "Last 30 days",
    icon: ArrowUpDown,
    trend: "+12.5%",
  },
  {
    title: "Stock Turnover",
    value: "4.2",
    description: "Times per year",
    icon: PackageSearch,
    trend: "+5.2%",
  },
  {
    title: "Inventory Value",
    value: "$534,232",
    description: "Current value",
    icon: FileBarChart,
    trend: "+8.1%",
  },
];

export function ReportsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className="text-sm text-green-500">{stat.trend}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
}