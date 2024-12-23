"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownAZ, ArrowUpAZ, Calendar } from "lucide-react";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: string;
}

export function TransactionFilters() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [type, setType] = useState<string>("");

  // Fetch filtered transactions from the server
  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `/api/transaction?sortBy=${sortBy}&sortOrder=${sortOrder}&type=${type}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data: Transaction[] = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Re-fetch data whenever filters change
  useEffect(() => {
    fetchTransactions();
  }, [sortBy, sortOrder, type]);

  return (
    <div>
      <div className="flex items-center gap-4">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "amount")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </span>
            </SelectItem>
            <SelectItem value="amount">
              <span className="flex items-center gap-2">
                <span className="font-mono">$</span>
                Amount
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? (
            <ArrowUpAZ className="h-4 w-4" />
          ) : (
            <ArrowDownAZ className="h-4 w-4" />
          )}
        </Button>

        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="INBOUND">Inbound</SelectItem>
            <SelectItem value="OUTBOUND">Outbound</SelectItem>
            <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border-b border-gray-200 p-2 flex justify-between"
            >
              <span>{transaction.date}</span>
              <span>${transaction.amount}</span>
              <span>{transaction.type}</span>
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}



























// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ArrowDownAZ, ArrowUpAZ, Calendar } from "lucide-react";

// interface TransactionFiltersProps {
//   sortBy: "date" | "amount";
//   sortOrder: "asc" | "desc";
//   type: string;
//   onSortByChange: (value: "date" | "amount") => void;
//   onSortOrderChange: () => void;
//   onTypeChange: (value: string) => void;
// }

// export function TransactionFilters({
//   sortBy,
//   sortOrder,
//   type,
//   onSortByChange,
//   onSortOrderChange,
//   onTypeChange,
// }: TransactionFiltersProps) {
//   return (
//     <div className="flex items-center gap-4">
//       <Select value={sortBy} onValueChange={onSortByChange}>
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="Sort by" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="date">
//             <span className="flex items-center gap-2">
//               <Calendar className="h-4 w-4" />
//               Date
//             </span>
//           </SelectItem>
//           <SelectItem value="amount">
//             <span className="flex items-center gap-2">
//               <span className="font-mono">$</span>
//               Amount
//             </span>
//           </SelectItem>
//         </SelectContent>
//       </Select>

//       <Button variant="outline" size="icon" onClick={onSortOrderChange}>
//         {sortOrder === "asc" ? (
//           <ArrowUpAZ className="h-4 w-4" />
//         ) : (
//           <ArrowDownAZ className="h-4 w-4" />
//         )}
//       </Button>

//       <Select value={type} onValueChange={onTypeChange}>
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="All Types" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="">All Types</SelectItem>
//           <SelectItem value="INBOUND">Inbound</SelectItem>
//           <SelectItem value="OUTBOUND">Outbound</SelectItem>
//           <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }