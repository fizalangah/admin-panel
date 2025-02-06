// import { BsFillCartCheckFill } from "react-icons/bs";
import { FcSalesPerformance } from "react-icons/fc";
 import { IoIosApps } from "react-icons/io";
// import { PiUsersThreeFill } from "react-icons/pi";
import { PiUsersFourFill } from "react-icons/pi";
// import { SiProtonmail } from "react-icons/si";
import { AiFillProduct } from "react-icons/ai";
import client from "@/sanity/lib/client";
import BarChart from "./components/BarChart";

type Product = {
  _id: string;
  name: string;
  price: number;
  stockLevel: number;
  discountPercentage: number;
  image: string;
  category: string;
};

type OrderItem = {
  product: Product;
  quantity: number;
};

type OrderData = {
  _id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
};

type User = {
  role: string;
};

async function getProducts(): Promise<number> {
  const res: Product[] = await client.fetch(
    `*[_type == "product"] {
      _id,
      name,
      price,
      stockLevel,
      discountPercentage,
      "image": image.asset->url,
      category
    }`
  );

  return res.length;
}


const fetchUsers = async (): Promise<number> => {
  const response = await fetch("https://e-commerce-dashboard-gules.vercel.app/api/auth/users", {
    cache: "no-store",
  });
  const data: { users: User[] } = await response.json();
  const adminUsers = data.users.filter((user) => user.role === "user");
  return adminUsers.length;
};

async function getOrders(): Promise<OrderData[]> {
  const res: OrderData[] = await client.fetch(`*[_type == "customerOrder"] {
    _id,
    customerName,
    phone,
    email,
    address,
    orderDate,
    totalAmount,
    status,
    items[] {
      product->{
        name,
        "image": image.asset->url,
        price,
        description,
        discountPercentage,
        isFeaturedProduct,
        stockLevel,
        category,
        tags
      },
      quantity
    }
  }`);
  return res;
}

export default async function Home() {
 
  const users = await fetchUsers();
  const product = await getProducts();
  const orders = await getOrders();

 
  const deliveredOrders = orders.filter((order) => order.status === "delivered");
  const totalSales = deliveredOrders.length;

  return (
    <div className="mt-9">
      <h2 className="text-2xl font-bold mb-6 pl-4 text-black">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-3">
        <div className="bg-gradient-to-r from-slate-600 to-slate-400 shadow-slate-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <span>
            <h3 className="text-lg font-semibold">Total Sales</h3>
            <p className="text-2xl font-bold">{totalSales}</p>
          </span>
          <FcSalesPerformance  className="text-[80px]" />
        </div>

        <div className="bg-gradient-to-r from-slate-600 to-slate-400 shadow-slate-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <span>
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl font-bold">{orders.length}</p>
          </span>
          <IoIosApps className="text-[70px]" />
        </div>

        <div className="bg-gradient-to-r from-slate-600 to-slate-400 shadow-slate-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <span>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{users}</p>
          </span>
          <PiUsersFourFill className="text-[70px]" />
        </div>

        <div className="bg-gradient-to-r from-slate-600 to-slate-400 shadow-slate-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <span>
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-2xl font-bold">{product}</p>
          </span>
          <AiFillProduct className="text-[50px] text-orang-900" />
        </div>
      </div>

      <div className="my-5">
        <BarChart />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 pl-4 text-gray-700">Recent Orders</h3>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">{item._id}</td>
                  <td className="px-6 py-4">{item.customerName}</td>
                  <td className="px-6 py-4">{new Date(item.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{item.totalAmount}</td>
                  <td className="px-6 py-4">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




