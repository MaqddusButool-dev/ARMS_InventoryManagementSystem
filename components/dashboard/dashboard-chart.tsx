// "use client";

// import { Card } from "@/components/ui/card";
// import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

// const data = [
//   { date: "Mar 1", inbound: 4, outbound: 3 },
//   { date: "Mar 2", inbound: 3, outbound: 2 },
//   { date: "Mar 3", inbound: 5, outbound: 4 },
//   { date: "Mar 4", inbound: 2, outbound: 3 },
//   { date: "Mar 5", inbound: 4, outbound: 2 },
//   { date: "Mar 6", inbound: 3, outbound: 5 },
//   { date: "Mar 7", inbound: 6, outbound: 3 },
// ];

// export function DashboardChart() {
//   return (
//     <Card className="p-6">
//       <div className="flex flex-col space-y-4">
//         <h3 className="text-lg font-medium">Transaction Overview</h3>
//         <div className="h-[300px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data}>
//               <XAxis 
//                 dataKey="date" 
//                 stroke="#888888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 stroke="#888888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `${value}`}
//               />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="inbound"
//                 stroke="hsl(var(--chart-1))"
//                 strokeWidth={2}
//                 dot={false}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="outbound"
//                 stroke="hsl(var(--chart-2))"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </Card>
//   );
// }





"use client";
import axios from "axios";
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function DashboardChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/orders');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Transaction Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}