"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

type Transaction = {
  id: string;
  date: string;
  type: string;
  product: string;
  quantity: number;
  reference: string;
  notes: string;
};

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/transaction", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load transactions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="rounded-md border">
      {loading ? (
        <div className="p-4 text-center">Loading transactions...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.type === "INBOUND"
                          ? "default"
                          : transaction.type === "OUTBOUND"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.product}</TableCell>
                  <TableCell>
                    {transaction.type === "OUTBOUND" ? "-" : ""}
                    {transaction.quantity}
                  </TableCell>
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.notes}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Print receipt</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}



























// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";

// const transactions = [
//   {
//     id: "1",
//     date: "2024-03-10",
//     type: "INBOUND",
//     product: "Steel Rebar",
//     quantity: 100,
//     reference: "PO-2024-001",
//     notes: "Regular stock replenishment",
//   },
//   {
//     id: "2",
//     date: "2024-03-10",
//     type: "OUTBOUND",
//     product: "Steel Plate",
//     quantity: 50,
//     reference: "SO-2024-001",
//     notes: "Customer order #12345",
//   },
//   {
//     id: "3",
//     date: "2024-03-09",
//     type: "ADJUSTMENT",
//     product: "Steel Pipe",
//     quantity: -5,
//     reference: "ADJ-2024-001",
//     notes: "Inventory count adjustment",
//   },
// ];

// export function TransactionTable() {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Date</TableHead>
//             <TableHead>Type</TableHead>
//             <TableHead>Product</TableHead>
//             <TableHead>Quantity</TableHead>
//             <TableHead>Reference</TableHead>
//             <TableHead>Notes</TableHead>
//             <TableHead className="w-[50px]"></TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {transactions.map((transaction) => (
//             <TableRow key={transaction.id}>
//               <TableCell>{transaction.date}</TableCell>
//               <TableCell>
//                 <Badge
//                   variant={
//                     transaction.type === "INBOUND"
//                       ? "default"
//                       : transaction.type === "OUTBOUND"
//                       ? "secondary"
//                       : "outline"
//                   }
//                 >
//                   {transaction.type}
//                 </Badge>
//               </TableCell>
//               <TableCell>{transaction.product}</TableCell>
//               <TableCell>
//                 {transaction.type === "OUTBOUND" ? "-" : ""}
//                 {transaction.quantity}
//               </TableCell>
//               <TableCell>{transaction.reference}</TableCell>
//               <TableCell className="max-w-[200px] truncate">
//                 {transaction.notes}
//               </TableCell>
//               <TableCell>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-8 w-8 p-0">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>View details</DropdownMenuItem>
//                     <DropdownMenuItem>Print receipt</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }