// "use client";
// import { Card } from "@/components/ui/card";
// import { Package2, ArrowDownCircle, ArrowUpCircle, AlertCircle } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from 'axios';

// // const stats = {
// //   totalProducts: 150,
// //   lowStock: 3,
// //   inboundToday: 12,
// //   outboundToday: 8,
// // };

// // export function DashboardStats() {
// //   const [stats, setStats] = useState({
// //     totalProducts: 0,
// //     lowStock: 0,
// //     inboundToday: 0,
// //     outboundToday: 0,
// //   });

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const response = await fetch("/api/dashboard");
// //         const data = await response.json();
// //         setStats(data);
// //       } catch (error) {
// //         console.error(error);
// //       }
// //     };

// //     fetchStats();
// //   }, []);
// // export function DashboardStats() {
// //   const [stats, setStats] = useState({
// //     totalProducts: 0,
// //     lowStock: 0,
// //     inboundToday: 0,
// //     outboundToday: 0,
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const response = await axios.get('/api/dashboard');
// //         setStats(response.data);
// //       } catch (error) {
// //         setError(error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchStats();
// //   }, []);
// interface Stats {
//   totalProducts: number[] | null;
//   lowStock: number;
//   inboundToday: number;
//   outboundToday: number;
// }

// export function DashboardStats() {
//   const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState(null);
//   const [stats, setStats] = useState<Stats | null>(null);


//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await axios.get<Stats>('/api/dashboard');
//         setStats(response.data);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);


//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       <Card className="p-6">
//         <div className="flex items-center space-x-2">
//           <Package2 className="h-4 w-4 text-muted-foreground" />
//           <h3 className="text-sm font-medium">Total Products</h3>
//         </div>
//         <div className="mt-4">
//           <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
//         </div>
//       </Card>
      
//       <Card className="p-6">
//         <div className="flex items-center space-x-2">
//           <AlertCircle className="h-4 w-4 text-destructive" />
//           <h3 className="text-sm font-medium">Low Stock Items</h3>
//         </div>
//         <div className="mt-4">
//           <p className="text-2xl font-bold">{stats?.lowStock || 0}</p>
//         </div>
//       </Card>
      
//       <Card className="p-6">
//         <div className="flex items-center space-x-2">
//           <ArrowDownCircle className="h-4 w-4 text-green-500" />
//           <h3 className="text-sm font-medium">Inbound Today</h3>
//         </div>
//         <div className="mt-4">
//           <p className="text-2xl font-bold">{stats?.inboundToday || 0}</p>
//         </div>
//       </Card>
      
//       <Card className="p-6">
//         <div className="flex items-center space-x-2">
//           <ArrowUpCircle className="h-4 w-4 text-blue-500" />
//           <h3 className="text-sm font-medium">Outbound Today</h3>
//         </div>
//         <div className="mt-4">
//           <p className="text-2xl font-bold">{stats?.outboundToday || 0}</p>
//         </div>
//       </Card>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Package2, ArrowDownCircle, ArrowUpCircle, AlertCircle } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  lowStock: number;
  inboundToday: number;
  outboundToday: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStock: 0,
    inboundToday: 0,
    outboundToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-pulse bg-gray-200 rounded" />
              <div className="h-4 w-24 animate-pulse bg-gray-200 rounded" />
            </div>
            <div className="mt-4">
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Package2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Total Products</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-medium">Low Stock Items</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{stats.lowStock}</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <ArrowDownCircle className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-medium">Inbound Today</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{stats.inboundToday}</p>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <ArrowUpCircle className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Outbound Today</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{stats.outboundToday}</p>
        </div>
      </Card>
    </div>
  );
}