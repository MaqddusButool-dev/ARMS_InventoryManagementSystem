// 'use client';

// import { Card } from "@/components/ui/card";
// import { AlertCircle } from "lucide-react";
// import axios from "axios";
// import { useState, useEffect } from 'react';
// // const lowStockItems = [
// //   { id: 1, name: "Steel Rebar", quantity: 50, minStock: 100 },
// //   { id: 2, name: "Steel Plate", quantity: 20, minStock: 50 },
// //   { id: 3, name: "Steel Pipe", quantity: 30, minStock: 75 },
// // ];

// export function LowStockAlerts() {
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const threshold = 10;
//   useEffect(() => {
//     const fetchLowStockItems = async () => {
//       try {
//         const response = await axios.get('/api/products');
//         const filteredItems = response.data.filter((item: { quantity: number; }) => item.quantity < threshold);
//         setLowStockItems(filteredItems);
//         // setLowStockItems(response.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLowStockItems();
//   }, []);

//   if (loading) {
//     return (
//       <Card className="p-6">
//         <p>Loading...</p>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="p-6">
//         <p>Error: {error}</p>
//       </Card>
//     );
//   }
//   return (
//     <Card className="p-6">
//       <div className="flex flex-col space-y-4">
//         <div className="flex items-center space-x-2">
//           <AlertCircle className="h-5 w-5 text-destructive" />
//           <h3 className="text-lg font-medium">Low Stock Alerts</h3>
//         </div>
//         <div className="space-y-4">
//           {lowStockItems.map((item) => (
//             <div
//               key={item.id}
//               className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
//             >
//               <div>
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   Min. Stock: {item.minStock}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-destructive font-medium">{item.quantity}</p>
//                 <p className="text-sm text-muted-foreground">Current Stock</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Card>
//   );
// }


'use client';

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from 'react';

// Type definition for the product item
interface Product {
  id: number;
  name: string;
  quantity: number;
  minStock: number;
}

export function LowStockAlerts() {
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Improved error type
  const threshold = 10;

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const response = await axios.get('/api/products');
        const filteredItems = response.data.filter((item: Product) => item.quantity < threshold);
        setLowStockItems(filteredItems);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message); // Axios-specific error handling
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <p>Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p>Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-medium">Low Stock Alerts</h3>
        </div>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Min. Stock: {item.minStock}
                </p>
              </div>
              <div className="text-right">
                <p className="text-destructive font-medium">{item.quantity}</p>
                <p className="text-sm text-muted-foreground">Current Stock</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}










// 'use client'
// import { Card } from "@/components/ui/card";
// import { AlertCircle } from "lucide-react";
// import axios from "axios";
// import { useState, useEffect } from 'react';

// export function LowStockAlerts() {
//   const [lowStockItems, setLowStockItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLowStockItems = async () => {
//       try {
//         const response = await axios.get('/api/products');
//         setLowStockItems(response.data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLowStockItems();
//   }, []);

//   if (loading) {
//     return (
//       <Card className="p-6">
//         <p>Loading...</p>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="p-6">
//         <p>Error: {error}</p>
//       </Card>
//     );
//   }

//   return (
//     <Card className="p-6">
//       <div className="flex flex-col space-y-4">
//         <div className="flex items-center space-x-2">
//           <AlertCircle className="h-5 w-5 text-destructive" />
//           <h3 className="text-lg font-medium">Low Stock Alerts</h3>
//         </div>
//         <div className="space-y-4">
//           {lowStockItems.map((item) => (
//             <div
//               key={item.id}
//               className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
//             >
//               <div>
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   Min. Stock: {item.minStock}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-destructive font-medium">{item.quantity}</p>
//                 <p className="text-sm text-muted-foreground">Current Stock</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Card>
//   );
// }