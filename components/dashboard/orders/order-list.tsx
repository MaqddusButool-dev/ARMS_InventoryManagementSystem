
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, Plus, Trash2 } from "lucide-react";
import { OrderModal } from "./order-modal";
import { OrderDetailsModal } from "./order-details-modal";
import { toast } from "sonner";

interface Filters {
  type: string | null;
  status: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  type: string;
  status: string;
  supplier?: string;
  customer?: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      name: string;
    };
  }>;
}

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({ type: null, status: null });
  const [modalState, setModalState] = useState<{
    mode: "create" | "edit" | "view" | null;
    order: Order | null;
  }>({ mode: null, order: null });
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/orders");
      setOrders(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    }
  };

  const getStatusColor = (status: string): "warning" | "info" | "default" | "success" | "destructive" => {
    const colors: Record<string, "warning" | "info" | "default" | "success" | "destructive"> = {
      PENDING: "warning",
      APPROVED: "info",
      PROCESSING: "default",
      COMPLETED: "success",
      CANCELLED: "destructive",
    };
    return colors[status] || "default";
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.type === null || order.type === filters.type) &&
      (filters.status === null || order.status === filters.status)
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select
            value={filters.type || undefined}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                type: value === "all" ? null : value,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PURCHASE">Purchase</SelectItem>
              <SelectItem value="SALES">Sales</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.status || undefined}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value === "all" ? null : value,
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer/Supplier</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>
                    <Badge>{order.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.type === "PURCHASE" ? order.supplier : order.customer}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setModalState({ mode: "view", order: order })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setModalState({ mode: "edit", order: order })
                        }
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {modalState.mode === "edit" || modalState.mode === "create" ? (
        <OrderModal
          open={!!modalState.mode}
          onClose={() => setModalState({ mode: null, order: null })}
          order={modalState.order}
          onOrderSaved={fetchOrders}
        />
      ) : modalState.mode === "view" ? (
        <OrderDetailsModal
          open={!!modalState.mode}
          onClose={() => setModalState({ mode: null, order: null })}
          order={modalState.order}
        />
      ) : null}
    </div>
  );
}