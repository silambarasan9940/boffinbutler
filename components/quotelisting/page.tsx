import { useState } from 'react';

type OrderData = {
  orderId: string;
  date: string;
  total: string;
  approvalStatus: string;
  status: string;
};

const QuoteListing = () => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dummy order data
  const dummyOrders: OrderData[] = Array.from({ length: 2 }, (_, i) => ({
    orderId: `ORD${i + 1}`,
    date: '2024-10-01',
    total: `$${(Math.random() * 100 + 50).toFixed(2)}`,
    approvalStatus: 'Approved',
    status: 'Completed',
  }));

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Calculate displayed items based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrders = dummyOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Purchase Department List</h1>
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

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, dummyOrders.length)} of{' '}
          {dummyOrders.length} items
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
  );
};

export default QuoteListing;
