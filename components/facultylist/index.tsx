"use client";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa"; 
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import CreateStudentForm from "../approvecustomer/createstudent/page";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import PurchaseDeptForm from "../approvecustomer/purchasedept/page";

type PurchaseData = {
  id: string;
  email: string;
  name: string;
  mobilenumber: string;
  faculty_type: string;
  group: string;
  status: string;
};

type OrderData = PurchaseData & {
  edit: boolean;
  approve: boolean;
  reject: boolean;
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="relative bg-white p-6 rounded shadow-lg w-1/2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const FacultyList = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseData | null>(null);

  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const fetchOrderData = async () => {
    try {
      const response = await api.get('/faulty/list', { headers });
      setOrders(response.data || []);
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

  const handleButtonClick = (type: "edit" | "reject" | "approve", order: OrderData) => {
    setModalTitle(type === "edit" ? "Edit Purchase" : type === "reject" ? "Reject Purchase" : "Approve Purchase");
    setSelectedPurchase(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleStatus = async (id: string, status: string) => {
    const payload = {
      data: {
        status: status,
        user_id: id,
      },
    };

    try {
      const response = await api.post('/approve/user', payload, { headers });
      toast.success(`Purchase ${status === 'approved' ? 'approved' : 'rejected'} successfully!`); 
      fetchOrderData(); 
      closeModal(); 
    } catch (error) {
      // toast.error('Error submitting form'); 
      console.error('Error submitting form:', error);
    }
  };

  const handleUpdatePurchase = async () => {
    fetchOrderData(); 
    toast.success('Student updated successfully!'); 
    closeModal(); 
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Faculty List</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="p-2 border-b">ID</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Mobile</th>
            <th className="p-2 border-b">Group</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedOrders.map((order, index) => (
            <tr key={index}>
              <td className="p-2 border-b">{order.id}</td>
              <td className="p-2 border-b">{order.email}</td>
              <td className="p-2 border-b">{order.name}</td>
              <td className="p-2 border-b">{order.mobilenumber}</td>
              <td className="p-2 border-b">{order.group}</td>
              <td className="p-2 border-b">{order.status}</td>
              <td className="p-2 border-b">
                {order.edit && (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleButtonClick("edit", order)}
                  >
                    Edit
                  </button>
                )}
                {" | "}
                {order.approve && (
                  <>
                    <button className="text-green-500 hover:underline"
                      onClick={() => handleButtonClick("approve", order)}
                    >Approve</button>
                    <span className="px-2">|</span>
                  </>
                )}
                {order.reject && (
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleButtonClick("reject", order)}
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, orders.length)} of{" "}
          {orders.length} items
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

      {isModalOpen && selectedPurchase && modalTitle === 'Edit Purchase' && (
        <Modal title={modalTitle} onClose={closeModal}>
          <PurchaseDeptForm 
            purchaseData={selectedPurchase} 
            showtitle={false} 
            onClose={handleUpdatePurchase} 
          />
        </Modal>
      )}
      {isModalOpen && selectedPurchase && modalTitle === 'Reject Purchase' && (
        <Modal title={modalTitle} onClose={closeModal}>
          <div className="text-center">
            <div className="py-6">Are you sure you want to Reject?</div>
            <button onClick={() => handleStatus(selectedPurchase.id, 'notapproved')}
            className="bg-indigo-500 py-2 px-8 text-md text-white rounded-md me-4"
              >Yes</button> 
            <button onClick={closeModal} className="bg-red-500 py-2 px-8 text-md text-white rounded-md">No</button>
          </div>
        </Modal>
      )}
      {isModalOpen && selectedPurchase && modalTitle === 'Approve Purchase' && (
        <Modal title={modalTitle} onClose={closeModal}>
          <div className="text-center">
            <div className="py-6">Are you sure you want to Approve?</div>
            <button onClick={() => handleStatus(selectedPurchase.id, 'approved')}
             className="bg-indigo-500 py-2 px-8 text-md text-white rounded-md me-4">Yes</button> 
            <button onClick={closeModal} className="bg-red-500 py-2 px-8 text-md text-white rounded-md">No</button>
          </div>
        </Modal>
      )}
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default FacultyList;
