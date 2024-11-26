"use client";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useRouter } from 'next/navigation';
// Define interfaces for API response
interface OrderItem {
  item_id: number;
  name: string;
  price: number;
  qty_ordered: number;
}

interface BillingAddress {
  firstname: string;
  lastname: string;
  city: string;
  country_id: string;
}

interface Order {
  entity_id:string;
  increment_id: string;
  created_at: string;
  grand_total: number;
  status: string;
  total_item_count: number;
  billing_address: BillingAddress;
  items: OrderItem[];
}

interface OrdersResponse {
  items: Order[];
  total_count: number; 
}

interface MyOrderProps {
  hideOrdersHeading?: boolean;
  hideOrderItemShowing?: boolean;
}
 
const MyOrder:React.FC<MyOrderProps> = ({ hideOrdersHeading = true, hideOrderItemShowing = true, }) => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const router = useRouter()
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const fetchOrderData = async () => {
    try {
      const response = await api.get<OrdersResponse>(`/mtwo/me/orders?searchCriteria[pageSize]=${itemsPerPage}&searchCriteria[currentPage]=${currentPage}`, { headers });
      setOrders(response.data.items);
      setTotalCount(response.data.total_count);
      console.log(response.data, 'order history');
    } catch (error) {
      console.log("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [currentPage, itemsPerPage]); 

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); 
  };

  // Calculate displayed items based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-6">
       {hideOrdersHeading && <h1 className="text-2xl font-semibold mb-4 text-center">My Orders</h1>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-2 border-b">Order #</th>
            <th className="p-2 border-b">Date</th>
            <th className="p-2 border-b">Order Total</th>
            <th className="p-2 border-b">Approval Status</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td className="p-2 border-b">{order.increment_id}</td>
              <td className="p-2 border-b">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="p-2 border-b">₹ {order.grand_total}</td>
              <td className="p-2 border-b">{order.status}</td>
              <td className="p-2 border-b">{order.status}</td>
              <td className="p-2 border-b">
                <button className="text-blue-500 hover:underline" onClick={() => router.push(`/sales/order/view/order_id?id=${order.entity_id}`)}>View Order</button> |{' '}
                {/* <button className="text-blue-500 hover:underline" onClick={() => router.push('/cart')}>Reorder</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hideOrderItemShowing && <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount} items
        </div>

        <div className="flex items-center">
          <span className="mr-2">Show</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border p-1 rounded-md"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <span className="ml-2">per page</span>
        </div>
      </div>}
    </div>
  );
};

export default MyOrder;
