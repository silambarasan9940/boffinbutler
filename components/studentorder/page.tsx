import api from "@/services/api";
import { useEffect, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import Link from "next/link";
interface Item {
  name: string;
  sku: string;
  price: number;
  sub_total: number;
}

interface Order {
  id: string;
  increment_id: string;
  customer_email: string;
  name: string;
  grand_total: string;
  items: Item[];
  approve: boolean;
  approve_code: number;
  approve_text: boolean;
  pd_approve: boolean;
  pd_approve_text: string;
  pd_approve_code: number;
  approve_reject_status: string;
  reject: boolean;
  reject_code: number;
  reject_text: string;
  pay_button_link: string;
}

const StudentOrder = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const itemsPerPageOptions = [5, 10, 15];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [orders, setOrders] = useState<Order[]>([]);
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };
  const fetchOrderData = async () => {
    try {
      const response = await api.get("/student/orders", { headers });
      setOrders(response.data[0]);
      
    } catch (error) {
      console.log("Failed load data response", error);
    }
  };
  useEffect(() => {
    fetchOrderData();
  }, []);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const displayedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Students Orders
      </h1>

      {totalItems === 0 ? (
        <div className="rounded-sm flex p-3 bg-[#fdf0d5] text-[#6f4400] items-center">
          <IoWarning className="text-2xl text-[#c07600] mr-2" />
          You have no data.
        </div>
      ) : (
        <>
          {/* Orders table */}
          <div className="overflow-auto">
          <table className="w-full border border-gray-300 mb-4 sm:table">
            <thead>
              <tr className="bg-gray-200 text-gray-700 font-semibold">
                <th className="border border-gray-300 p-3 text-left">
                  Order ID
                </th>
                <th className="border border-gray-300 p-3 text-left">Email</th>
                <th className="border border-gray-300 p-3 text-left">Name</th>
                <th className="border border-gray-300 p-3 text-left">Total</th>
                <th className="border border-gray-300 p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order, index) => (
                <tr
                  key={index}
                  className="bg-white text-gray-700 hover:bg-gray-50"
                >
                  <td className="border border-gray-300 p-3">{order.id}</td>
                  <td className="border border-gray-300 p-3">
                    {order.customer_email}
                  </td>
                  <td className="border border-gray-300 p-3">{order.name}</td>
                  <td className="border border-gray-300 p-3">
                    {parseFloat(order.grand_total).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <span>{order.approve_reject_status}</span>
                    {order.pay_button_link && (
                      <span>
                        <Link
                          href={order.pay_button_link}
                          className="text-blue-600 hover:underline ml-2"
                        >
                          Pay ({order.grand_total})
                        </Link>
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Detailed items table inside each order row */}
              {displayedOrders.map((order, orderIndex) => (
                <tr key={`details-${orderIndex}`} className="bg-gray-50">
                  <td colSpan={5} className="p-4 border border-gray-300">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">
                      Order Details for {order.id}
                    </h2>
                    <div className="overflow-auto">
                    <table className="w-full border border-gray-300">
                      <thead className="bg-gray-200 text-gray-600 font-medium">
                        <tr>
                          <th className="border border-gray-300 p-3 text-left">
                            Item
                          </th>
                          <th className="border border-gray-300 p-3 text-left">
                            SKU
                          </th>
                          <th className="border border-gray-300 p-3 text-left">
                            Unit Price
                          </th>
                          <th className="border border-gray-300 p-3 text-left">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, itemIndex) => (
                          <tr
                            key={itemIndex}
                            className="text-gray-600 hover:bg-gray-100"
                          >
                            <td className="border border-gray-300 p-3">
                              {item.name}
                            </td>
                            <td className="border border-gray-300 p-3">
                              {item.sku}
                            </td>
                            <td className="border border-gray-300 p-3">
                              {item.price.toFixed(2)}
                            </td>
                            <td className="border border-gray-300 p-3">
                              {item.sub_total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Mobile view: Stack order details */}
          <div className="sm:hidden">
            {displayedOrders.map((order, index) => (
              <div
                key={index}
                className="mb-4 border border-gray-200 p-4 rounded"
              >
                <h3 className="font-semibold text-xl mb-2">
                  Order ID: {order.id}
                </h3>
                <p>
                  <strong>Email:</strong> {order.customer_email}
                </p>
                <p>
                  <strong>Name:</strong> {order.name}
                </p>
                <p>
                  <strong>Total:</strong> {order.grand_total}
                </p>
                <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2">
                  View
                </button>

                <h4 className="font-semibold mt-4">Order Details:</h4>
                <ul>
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="mb-2">
                      <p>
                        <strong>Item:</strong> {item.name}
                      </p>
                      <p>
                        <strong>SKU:</strong> {item.sku}
                      </p>
                      {/* <p><strong>Qty:</strong> {item.qty}</p> */}
                      <p>
                        <strong>Unit Price:</strong> {item.price}
                      </p>
                      <p>
                        <strong>Subtotal:</strong> {item.sub_total}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pagination info and controls */}
          <div className="flex justify-between items-center mt-4">
            <p>
              Items {startItem} to {endItem} of {totalItems} total
            </p>

            {/* Pagination controls */}
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="flex items-center">
              <label htmlFor="itemsPerPage" className="mr-2">
                Show
              </label>
              <select
                id="itemsPerPage"
                className="border p-2 rounded"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="ml-2">per page</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentOrder;
