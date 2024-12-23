
"use client";

import { useState } from "react";
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
import { Edit2, Trash2 } from "lucide-react";
// import { ProductModal } from "./product-modal";
import { EditProductModal } from "./edit-product-modal";
import { useProducts, Product } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";


interface ProductListProps {
  refreshKey: boolean;
}

export function ProductList( { refreshKey }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, loading, deleteProduct, refreshProducts } = useProducts();
  const { toast } = useToast();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProduct(product.id);
        toast({
          title: "Product deleted",
          description: `${product.name} has been removed from the inventory.`,
        });
        refreshProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast({
          variant: "destructive",
          title: "Failed to delete product",
          description: `Could not remove ${product.name} from the inventory.`,
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {/* <ProductModal refreshProducts={refreshProducts} /> */}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product)}
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

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            refreshProducts();
          }}
        />
      )}
    </div>
  );
}






// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Edit2, Trash2 } from "lucide-react";
// import { ProductModal } from "./product-modal";
// import { useProducts, Product } from "@/hooks/use-products";
// import { useToast } from "@/hooks/use-toast";

// export function ProductList() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [isCreating, setIsCreating] = useState(false); // New state for Create Product
//   const { products, loading, deleteProduct } = useProducts();
//   const { toast } = useToast();

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = async (product: Product) => {
//     if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
//       try {
//         await deleteProduct(product.id);
//         toast({
//           title: "Product deleted",
//           description: `${product.name} has been removed from the inventory.`,
//         });
//       } catch (error) {
//         console.error("Failed to delete product:", error);
//       }
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Input
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
        
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>SKU</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Unit</TableHead>
//               <TableHead>Min Stock</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProducts.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-8">
//                   No products found. Add your first product to get started.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredProducts.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.name}</TableCell>
//                   <TableCell>{product.sku}</TableCell>
//                   <TableCell>{product.category.name}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                   <TableCell>{product.unit}</TableCell>
//                   <TableCell>{product.minStock}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setEditingProduct(product)}
//                       >
//                         <Edit2 className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDelete(product)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Modal for Creating or Editing Products */}
//       <ProductModal
//         open={isCreating || !!editingProduct}
//         onClose={() => {
//           setIsCreating(false);
//           setEditingProduct(null);
//         } }
//         product={editingProduct} children={undefined}      />
//     </div>
//   );
// }











// "use client";

// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Edit2, Trash2 } from "lucide-react";
// import { ProductModal } from "./product-modal";
// import { useProducts, Product } from "@/hooks/use-products";
// import { useToast } from "@/hooks/use-toast";

// export function ProductList() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const { products, loading, deleteProduct } = useProducts();
//   const { toast } = useToast();

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = async (product: Product) => {
//     if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
//       try {
//         await deleteProduct(product.id);
//         toast({
//           title: "Product deleted",
//           description: `${product.name} has been removed from the inventory.`,
//         });
//       } catch (error) {
//         console.error("Failed to delete product:", error);
//       }
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2">
//         <Input
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>SKU</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Unit</TableHead>
//               <TableHead>Min Stock</TableHead>
//               <TableHead>Actions</TableHead>
              
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProducts.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-8">
//                   No products found. Add your first product to get started.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredProducts.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.name}</TableCell>
//                   <TableCell>{product.sku}</TableCell>
//                   <TableCell>{product.category.name}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                   <TableCell>{product.unit}</TableCell>
//                   <TableCell>{product.minStock}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setEditingProduct(product)}
//                       >
//                         <Edit2 className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDelete(product)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <ProductModal
//         open={!!editingProduct}
//         onClose={() => setEditingProduct(null)}
//         product={editingProduct}
//       />
//     </div>
//   );
// }








// "use client";

// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Edit2, Trash2 } from "lucide-react";
// import { ProductModal } from "./product-modal";
// import { useProducts, Product } from "@/hooks/use-products";
// import { useToast } from "@/hooks/use-toast";

// export function ProductList() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const { products, loading, deleteProduct, refreshProducts } = useProducts(); // Ensure refresh is exposed
//   const { toast } = useToast();

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDelete = async (product: Product) => {
//     if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
//       try {
//         await deleteProduct(product.id);
//         toast({
//           title: "Product deleted",
//           description: `${product.name} has been removed from the inventory.`,
//         });
//         refreshProducts(); // Refresh the product list after deletion
//       } catch (error) {
//         console.error("Failed to delete product:", error);
//         toast({
//           variant: "destructive",
//           title: "Failed to delete product",
//           description: `Could not remove ${product.name} from the inventory.`,
//         });
//       }
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2">
//         <Input
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>SKU</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Unit</TableHead>
//               <TableHead>Min Stock</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProducts.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-8">
//                   No products found. Add your first product to get started.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredProducts.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.name}</TableCell>
//                   <TableCell>{product.sku}</TableCell>
//                   <TableCell>{product.category.name}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                   <TableCell>{product.unit}</TableCell>
//                   <TableCell>{product.minStock}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setEditingProduct(product)}
//                       >
//                         <Edit2 className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDelete(product)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <ProductModal
//         open={!!editingProduct}
//         onClose={() => {
//           setEditingProduct(null);
//           refreshProducts(); // Refresh products on modal close to reflect changes
//         } }
//         product={editingProduct} children={undefined}      />
//     </div>
//   );
// }















// import { useState, useMemo, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Edit2, Trash2 } from "lucide-react";
// import { ProductModal } from "./product-modal";
// import { useProducts, Product } from "@/hooks/use-products";
// import { useToast } from "@/hooks/use-toast";

// interface ProductListProps {}

// const ProductList: React.FC<ProductListProps> = () => {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const { products, loading, deleteProduct } = useProducts();
//   const { toast } = useToast();

//   const filteredProducts = useMemo(() => {
//     return products.filter((product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [products, searchTerm]);

//   const handleDelete = async (product: Product) => {
//     if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
//       try {
//         await deleteProduct(product.id);
//         toast({
//           title: "Product deleted",
//           description: `${product.name} has been removed from the inventory.`,
//         });
//       } catch (error) {
//         toast({
//           title: "Error deleting product",
//           description: "Please try again.",
//         });
//         console.error("Failed to delete product:", error);
//       }
//     }
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-2">
//         <Input
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="max-w-sm"
//           aria-label="Search products"
//         />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>SKU</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Unit</TableHead>
//               <TableHead>Min Stock</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredProducts.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center py-8">
//                   No products found. Add your first product to get started.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredProducts.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.name}</TableCell>
//                   <TableCell>{product.sku}</TableCell>
//                   <TableCell>{product.category.name}</TableCell>
//                   <TableCell>{product.quantity}</TableCell>
//                   <TableCell>{product.unit}</TableCell>
//                   <TableCell>{product.minStock}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => setEditingProduct(product)}
//                         aria-label={`Edit ${product.name}`}
//                       >
//                         <Edit2 className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDelete(product)}
//                         aria-label={`Delete ${product.name}`}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <ProductModal
//         open={!!editingProduct}
//         onClose={() => setEditingProduct(null)}
//         product={editingProduct}
//       />
//     </div>
//   );
// };

// export default ProductList;