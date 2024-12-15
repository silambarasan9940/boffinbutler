import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { FaExclamationTriangle } from 'react-icons/fa'; // Add warning icon

type OrderData = {
  orderId: string;
  date: string;
  total: string;
  approvalStatus: string;
  status: string;
};

const QuoteListing = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const [quoteList, setQuoteList] = useState<OrderData[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const fetchQuoteListing = async () => {
    if(tokenApi) {
      try {
        const response = await api.get('/quote/list', { headers });
        setQuoteList(response.data);
        console.log('quote data list', response.data);
      } catch (error) {
        console.log('Failed to load data', error);
      }
    }
  };

  useEffect(() => {
    fetchQuoteListing();
  }, []);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Calculate displayed items based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrders = quoteList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">My Quotes</h1>

      {/* Conditional rendering for empty data */}
      {quoteList.length === 0 ? (
        <div>
          <div className="flex items-center justify-center bg-orange-300 p-4 rounded-md" style={{ background: "#fdf0d5", color: "#6f4400" }}>
            <FaExclamationTriangle className="mr-2" style={{ color: "#c07600" }} />
            You have no data
          </div>

          {/* Pagination Controls for empty data */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              Showing 0 - 0 of {quoteList.length} items
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
          </div>
        </div>
      ) : (
        <div>
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
              {displayedOrders.map((order, index) => (
                <tr key={index}>
                  <td className="p-2 border-b">{order.orderId}</td>
                  <td className="p-2 border-b">{order.date}</td>
                  <td className="p-2 border-b">{order.total}</td>
                  <td className="p-2 border-b">{order.approvalStatus}</td>
                  <td className="p-2 border-b">{order.status}</td>
                  <td className="p-2 border-b">
                    <button className="text-blue-500 hover:underline">Edit</button> |{' '}
                    <button className="text-blue-500 hover:underline">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls for non-empty data */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, quoteList.length)} of{' '}
              {quoteList.length} items
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
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteListing;
