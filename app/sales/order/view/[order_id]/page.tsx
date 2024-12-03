"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import api from "@/services/api";
import { useSearchParams } from "next/navigation";
import ShippingPlacementDetails from "@/components/shippingorder/page";
import Link from "next/link";
import { AiOutlineDown } from "react-icons/ai";
import BackButton from "@/components/backbutton";

interface MediaGalleryEntry {
  id: number;
  media_type: string;
  label: string | null;
  position: number;
  disabled: boolean;
  types: string[];
  file: string;
}

interface ItemExtensionAttributes {
  image: MediaGalleryEntry[];
}

interface Item {
  amount_refunded: number;
  base_amount_refunded: number;
  discount_amount: number;
  discount_invoiced: number;
  discount_percent: number;
  free_shipping: number;
  item_id: number;
  name: string;
  order_id: number;
  price: number;
  product_id: number;
  qty_ordered: number;
  row_total: number;
  sku: string;
  weight: number;
  extension_attributes: ItemExtensionAttributes;
}

interface Order {
  increment_id: string;
  updated_at: string;
  status: string;
  shipping_description: string;
  items: Item[];
}

const OrderDetails: React.FC = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderProgress, setOrderProgress] = useState({
    approval_status: false,
    invoice_status: false,
    shipment_status: false,
    delivery_status: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceList, setInvoiceList] = useState([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Fetch API call
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/mtwo/me/orders/${id}`, { headers });
        setOrderDetails(response.data);

        // Dynamically set order progress based on order details
        const progress = {
          approval_status: response.data.extension_attributes.approval_status,
          invoice_status: response.data.extension_attributes.invoice_status,
          shipment_status: response.data.extension_attributes.shipment_status,
          delivery_status: response.data.extension_attributes.delivery_status,
          
        };
        setOrderProgress(progress);
        setInvoiceList(response.data.extension_attributes.invoice_data);
      } catch (error) {
        setError("Failed to load order details. Please try again.");
        console.log('Failed to load order details. Please try again.', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, tokenApi]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-11/12 mx-auto p-6 pt-20">
      <BackButton />
      <div className="text-center">
        <ShippingPlacementDetails status={orderProgress} />
        <h2 className="text-2xl font-bold">
          Order #{orderDetails?.increment_id}
        </h2>
        <p className="text-gray-600">
          Order Placed on {orderDetails?.updated_at}
        </p>
      </div>
      <div className="flex justify-items-end items-center">
        <div className="mt-4 space-x-4">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg">
            Print Order
          </button>
        </div>
        <div className="relative mt-4 space-x-4 ms-4">
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center"
          >
            <span>Invoices list</span>
            <AiOutlineDown className="h-4 w-4" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <ul className="py-1">
                {invoiceList.length > 0 ? (
                  invoiceList.map((item, index) => {
                    return <li key={index}>{item}</li>;
                  })
                ) : (
                  <p className="p-4 text-center">No Invoice Found</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 w-full">
        {/* Items Ordered */}
        <div>
          <h3 className="text-xl font-semibold">Items Ordered</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">SKU</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2 text-center">{item.sku}</td>
                    <td className="border p-2 text-center">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="border p-2 text-center">
                      {item.qty_ordered}
                    </td>
                    <td className="border p-2 text-center">
                      ₹{item.row_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
