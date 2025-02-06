"use client"

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import client from '@/sanity/lib/client';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart: React.FC = () => {
  const [monthlySales, setMonthlySales] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    async function fetchOrders() {
      const res = await client.fetch(
        `*[_type == "customerOrder" && status == "delivered"] {
          orderDate,
          totalAmount
        }`
      );

      // Empty sales array for 12 months
      const salesData = Array(12).fill(0);

      // Processing orders
      res.forEach((order: { orderDate: string; totalAmount: number }) => {
        const monthIndex = new Date(order.orderDate).getMonth(); // Get month (0-11)
        salesData[monthIndex] += order.totalAmount; // Add total amount to respective month
      });

      setMonthlySales(salesData);
    }

    fetchOrders();
  }, []);

  // Chart Data
  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Sales',
        data: monthlySales,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  // Responsive options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to adjust height based on container
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: window.innerWidth < 600 ? 12 : 14, // Smaller font for mobile
          },
        },
      },
      title: {
        display: true,
        text: 'Monthly Sales Data',
        font: {
          size: window.innerWidth < 600 ? 16 : 20, // Smaller title for mobile
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 600 ? 10 : 12, // Smaller ticks for mobile
          },
        },
        title: {
          display: true,
          text: 'Months',
          font: {
            size: window.innerWidth < 600 ? 12 : 14, // Smaller title for mobile
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: window.innerWidth < 600 ? 10 : 12, // Smaller ticks for mobile
          },
        },
        title: {
          display: true,
          text: 'Sales Amount (Rs)',
          font: {
            size: window.innerWidth < 600 ? 12 : 14, // Smaller title for mobile
          },
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl mt-5 font-bold mb-4  text-gray-700">Sales Analytics</h2>
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]"> {/* Adjust height for different screens */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
