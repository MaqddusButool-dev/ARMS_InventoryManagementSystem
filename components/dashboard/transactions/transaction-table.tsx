


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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Printer } from "lucide-react";
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
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

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

  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast({
        title: "Success",
        description: "Transaction deleted successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction.",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch(`/api/transaction/${updatedTransaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTransaction),
      });
      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }
      setTransactions((prev) =>
        prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );
      toast({
        title: "Success",
        description: "Transaction updated successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction.",
        variant: "destructive",
      });
    } finally {
      setEditTransaction(null);
    }
  };

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
              <TableHead>Order Number</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
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
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
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
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Eye, Edit, Trash } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "@/hooks/use-toast";

// type Transaction = {
//   id: string;
//   date: string;
//   type: string;
//   product: string;
//   quantity: number;
//   reference: string;
//   notes: string;
// };

// export function TransactionTable() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
//   const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/transaction", { method: "GET" });
//         if (!response.ok) {
//           throw new Error("Failed to fetch transactions");
//         }
//         const data = await response.json();
//         setTransactions(data);
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to load transactions.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   const deleteTransaction = async (id: string) => {
//     try {
//       const response = await fetch(`/api/transaction/${id}`, { method: "DELETE" });
//       if (!response.ok) {
//         throw new Error("Failed to delete transaction");
//       }
//       setTransactions((prev) => prev.filter((t) => t.id !== id));
//       toast({
//         title: "Success",
//         description: "Transaction deleted successfully.",
//         variant: "default",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete transaction.",
//         variant: "destructive",
//       });
//     }
//   };

//   const updateTransaction = async (updatedTransaction: Transaction) => {
//     try {
//       const response = await fetch(`/api/transaction/${updatedTransaction.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedTransaction),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update transaction");
//       }
//       setTransactions((prev) =>
//         prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
//       );
//       toast({
//         title: "Success",
//         description: "Transaction updated successfully.",
//         variant: "default",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update transaction.",
//         variant: "destructive",
//       });
//     } finally {
//       setEditTransaction(null);
//     }
//   };

//   return (
//     <div className="rounded-md border">
//       {loading ? (
//         <div className="p-4 text-center">Loading transactions...</div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Product</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Reference</TableHead>
//               <TableHead>Notes</TableHead>
//               <TableHead className="w-[150px]">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {transactions.length > 0 ? (
//               transactions.map((transaction) => (
//                 <TableRow key={transaction.id}>
//                   <TableCell>{transaction.date}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={
//                         transaction.type === "INBOUND"
//                           ? "default"
//                           : transaction.type === "OUTBOUND"
//                           ? "secondary"
//                           : "outline"
//                       }
//                     >
//                       {transaction.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>{transaction.product}</TableCell>
//                   <TableCell>
//                     {transaction.type === "OUTBOUND" ? "-" : ""}{transaction.quantity}
//                   </TableCell>
//                   <TableCell>{transaction.reference}</TableCell>
//                   <TableCell className="max-w-[200px] truncate">
//                     {transaction.notes}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       <Button variant="ghost" size="sm" onClick={() => setViewTransaction(transaction)}>
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm" onClick={() => setEditTransaction(transaction)}>
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm" onClick={() => deleteTransaction(transaction.id)}>
//                         <Trash className="h-4 w-4 text-black" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center">
//                   No transactions found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}

//       {/* View Dialog */}
//       {viewTransaction && (
//         <Dialog open={!!viewTransaction} onOpenChange={() => setViewTransaction(null)}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Transaction Details</DialogTitle>
//             </DialogHeader>
//             <div>
//               <p>Date: {viewTransaction.date}</p>
//               <p>Type: {viewTransaction.type}</p>
//               <p>Product: {viewTransaction.product}</p>
//               <p>Quantity: {viewTransaction.quantity}</p>
//               <p>Reference: {viewTransaction.reference}</p>
//               <p>Notes: {viewTransaction.notes}</p>
//               <Button className="mt-4">Print</Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Edit Dialog */}
//       {editTransaction && (
//         <Dialog open={!!editTransaction} onOpenChange={() => setEditTransaction(null)}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Edit Transaction</DialogTitle>
//             </DialogHeader>
//             <div>
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   updateTransaction(editTransaction);
//                 }}
//               >
//                 <input
//                   type="text"
//                   value={editTransaction.date}
//                   onChange={(e) =>
//                     setEditTransaction({ ...editTransaction, date: e.target.value })
//                   }
//                 />

//                 {/* Add more fields here */}
                


//                 <Button type="submit" className="mt-4">
//                   Save
//                 </Button>
//               </form>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }






















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
// import { MoreHorizontal, Eye, Printer, Trash } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "@/hooks/use-toast";

// type Transaction = {
//   id: string;
//   date: string;
//   type: string;
//   product: string;
//   quantity: number;
//   reference: string;
//   notes: string;
// };

// export function TransactionTable() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/transaction", { method: "GET" });
//         if (!response.ok) {
//           throw new Error("Failed to fetch transactions");
//         }
//         const data = await response.json();
//         setTransactions(data);
//       } catch (error: any) {
//         toast({
//           title: "Error",
//           description: error.message || "Failed to load transactions.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   return (
//     <div className="rounded-md border">
//       {loading ? (
//         <div className="p-4 text-center">Loading transactions...</div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Product</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Reference</TableHead>
//               <TableHead>Notes</TableHead>
//               <TableHead className="w-[150px]">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {transactions.length > 0 ? (
//               transactions.map((transaction) => (
//                 <TableRow key={transaction.id}>
//                   <TableCell>{transaction.date}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={
//                         transaction.type === "INBOUND"
//                           ? "default"
//                           : transaction.type === "OUTBOUND"
//                           ? "secondary"
//                           : "outline"
//                       }
//                     >
//                       {transaction.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>{transaction.product}</TableCell>
//                   <TableCell>
//                     {transaction.type === "OUTBOUND" ? "-" : ""}
//                     {transaction.quantity}
//                   </TableCell>
//                   <TableCell>{transaction.reference}</TableCell>
//                   <TableCell className="max-w-[200px] truncate">
//                     {transaction.notes}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       <Button variant="ghost" size="sm">
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Printer className="h-4 w-4"  />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Trash className="h-4 w-4 text-black" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center">
//                   No transactions found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }













