"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
}

const orderSchema = z.object({
  type: z.enum(["PURCHASE", "SALES"]),
  customerSupplier: z.string().min(1, "Customer/Supplier is required"),
  status: z.enum([
    "PENDING",
    "APPROVED",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
  ]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be positive"),
        unitPrice: z.number().min(0, "Unit price must be positive"),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),
});

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  order?: any;
  onOrderSaved?: () => void;
}

export function OrderModal({
  open,
  onClose,
  order,
  onOrderSaved,
}: OrderModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: order || {
      type: "PURCHASE",
      customerSupplier: "",
      status: "PENDING",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (data: z.infer<typeof orderSchema>) => {
    setIsSubmitting(true);
    try {
      const method = order ? "PATCH" : "POST";
      const url = `/api/orders${order ? `/${order.id}` : ""}`;
      await axios({ method, url, data });

      toast.success(order ? "Order updated successfully" : "Order created successfully");
      onOrderSaved?.();
      onClose();
    } catch (error) {
      console.error("Failed to save order:", error);
      toast.error("Failed to save order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
    allowFloat = false
  ) => {
    const value = e.target.value;
    const numericValue = allowFloat ? parseFloat(value) : parseInt(value, 10);
    onChange(isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{order ? "Edit Order" : "Create New Order"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PURCHASE">Purchase Order</SelectItem>
                        <SelectItem value="SALES">Sales Order</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerSupplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("type") === "PURCHASE" ? "Supplier" : "Customer"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Order Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const product = products.find((p) => p.id === value);
                            if (product) {
                              form.setValue(`items.${index}.unitPrice`, product.price);
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            value={field.value}
                            onChange={(e) => handleNumericChange(e, field.onChange)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={field.value}
                            onChange={(e) => handleNumericChange(e, field.onChange, true)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="mb-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : "Save Order"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}












// "use client";

// import { useEffect, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useFieldArray, useForm } from "react-hook-form";
// import * as z from "zod";
// import axios from "axios";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, Trash2 } from "lucide-react";
// import { toast } from "sonner";

// // Define the interface for a product
// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }


// const orderSchema = z.object({
//   type: z.enum(["PURCHASE", "SALES"]),
//   customerSupplier: z.string().min(1, "Customer/Supplier is required"),
//   status: z.enum(["PENDING", "APPROVED", "PROCESSING", "COMPLETED", "CANCELLED"]),
//   items: z
//     .array(
//       z.object({
//         productId: z.string().min(1, "Product is required"),
//         quantity: z.number().min(1, "Quantity must be positive"),
//         unitPrice: z.number().min(0, "Unit price must be positive"),
//       })
//     )
//     .min(1, "At least one item is required"),
//   notes: z.string().optional(),
// });

// interface OrderModalProps {
//   open: boolean;
//   onClose: () => void;
//   order?: any;
//   // onOrderSaved: () => void;
//   onOrderSaved?: () => void;
// }


//   export function OrderModal({ open, onClose, order, onOrderSaved }: OrderModalProps) {

//     const [products, setProducts] = useState<Product[]>([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const form = useForm<z.infer<typeof orderSchema>>({
//       resolver: zodResolver(orderSchema),
//       defaultValues: order || {
//         type: "PURCHASE",
//         customerSupplier: "",
//         status: "PENDING",
//         items: [{ productId: "", quantity: 1, unitPrice: 0 }],
//         notes: "",
//       },
//     });

//     const { fields, append, remove } = useFieldArray({
//       control: form.control,
//       name: "items",
//     });

//     useEffect(() => {
//       const fetchProducts = async () => {
//         try {
//           const response = await axios.get("/api/products");
//           setProducts(response.data);
//         } catch (error) {
//           console.error("Failed to fetch products:", error);
//           toast.error("Failed to load products");
//         }
//       };
//       fetchProducts();
//     }, []);

//     const onSubmit = async (data: z.infer<typeof orderSchema>) => {
//       try {
//         setIsSubmitting(true);

//         const response = await axios({
//           method: order ? "PATCH" : "POST",
//           url: `/api/orders${order ? `/${order.id}` : ""}`,
//           data,
//         });

//         toast.success(order ? "Order updated successfully" : "Order created successfully");
//         // onOrderSaved();
//         onOrderSaved?.();
//         onClose();

//       } catch (error) {
//         console.error("Failed to save order:", error);
//         toast.error("Failed to save order");
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//     const handleNumericChange = (
//       e: React.ChangeEvent<HTMLInputElement>,
//       onChange: (value: number) => void,
//       allowFloat = false
//     ) => {
//       const value = e.target.value;
//       const numericValue = allowFloat ? parseFloat(value) : parseInt(value, 10);
//       onChange(isNaN(numericValue) ? 0 : numericValue);
//     };

//     return (
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent className="max-w-3xl">
//           <DialogHeader>
//             <DialogTitle>{order ? "Edit Order" : "Create New Order"}</DialogTitle>
//           </DialogHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Order Type</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="PURCHASE">Purchase Order</SelectItem>
//                           <SelectItem value="SALES">Sales Order</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="customerSupplier"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         {form.watch("type") === "PURCHASE" ? "Supplier" : "Customer"}
//                       </FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="status"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Status</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select status" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="PENDING">Pending</SelectItem>
//                           <SelectItem value="APPROVED">Approved</SelectItem>
//                           <SelectItem value="PROCESSING">Processing</SelectItem>
//                           <SelectItem value="COMPLETED">Completed</SelectItem>
//                           <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-medium">Order Items</h3>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Item
//                   </Button>
//                 </div>

//                 {fields.map((field, index) => (
//                   <div key={field.id} className="grid grid-cols-4 gap-4">
//                     <FormField
//                       control={form.control}
//                       name={`items.${index}.productId`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Product</FormLabel>
//                           <Select
//                             onValueChange={(value) => {
//                               field.onChange(value);
//                               const product = products.find((p) => p.id === value);
//                               if (product) {
//                                 form.setValue(`items.${index}.unitPrice`, product.price);
//                               }
//                             }}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select product" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {products.map((product) => (
//                                 <SelectItem key={product.id} value={product.id}>
//                                   {product.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`items.${index}.quantity`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Quantity</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               min="1"
//                               value={field.value}
//                               onChange={(e) => handleNumericChange(e, field.onChange)}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`items.${index}.unitPrice`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Unit Price</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               min="0"
//                               step="0.01"
//                               value={field.value}
//                               onChange={(e) => handleNumericChange(e, field.onChange, true)}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <div className="flex items-end">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => remove(index)}
//                         className="mb-2"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <FormField
//                 control={form.control}
//                 name="notes"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Notes</FormLabel>
//                     <FormControl>
//                       <Textarea {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button type="submit" disabled={isSubmitting} className="w-full">
//                 {isSubmitting ? "Saving..." : "Save Order"}
//               </Button>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//     );
//   }