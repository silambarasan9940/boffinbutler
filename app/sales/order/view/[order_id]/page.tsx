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
import Loader from "@/components/loader";

interface MediaGalleryEntry {
  id: number;
  media_type: string;
  label: string | null;
  position: number;
  disabled: boolean;
  types: string[];
  file: string;
}

interface AppliedTax {
  amount: number;
}

interface ExtensionAttributes {
  applied_taxes: AppliedTax[];
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
  percent:number;
}

interface Order {
  increment_id: string;
  updated_at: string;
  status: string;
  shipping_description: string;
  items: Item[];
  subtotal?: number;
  shipping_amount?: number;
  grand_total?: number;
  gst_percentage?: number;
  gst_amount?: number;
  tax_amount?: number;
  grand_total_incl_tax?: number;
  tax_percent?:number;
  subtotal_incl_tax?:number;
  extension_attributes?: ExtensionAttributes;
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
  };

  useEffect(() => {
   
    const fetchOrderDetails = async () => {

      try {
        const response = await api.get(`/mtwo/me/orders/${id}`, { headers });
        setOrderDetails(response.data);
        setInvoiceList(response.data.extension_attributes.invoice_data);
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
        console.log("Failed to load order details. Please try again.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    
  }, [id, tokenApi]);

  const printOrder = () => {
    const printWindow = window.open("", "_blank");
    const printContent = document.getElementById("printable-section")?.innerHTML;
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 8px;
                text-align: left;
                border: 1px solid #ddd;
              }
               
                h2,p {
                text-align: center;
                }
                button {
                display:none;
                }
            </style>
          </head>
          <body>
            <h2>Order Details</h2>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const response = await api.get(`invoice/${invoiceId}`, {
        headers,
      });
  
      if (typeof response.data === "string") {
        const base64Data = response.data;
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Invoice-${invoiceId}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error: any) {
      console.error("Failed to download the invoice:", error.message);
      setError("Failed to download the invoice. Please try again.");
    }
  };
  
  

  if (loading) return <div><Loader/></div>;

  return (
    <div className="w-11/12 mx-auto p-6 pt-20">
      <BackButton />
      <div className="text-center">
      <ShippingPlacementDetails status={orderProgress} />
      </div>
      <div id="printable-section">
      <div className="text-center mt-3">
        <h2 className="text-2xl font-bold">
          Order #{orderDetails?.increment_id}
        </h2>
        <p className="text-gray-600">
          Order Placed on {orderDetails?.updated_at}
        </p>
      </div>
      <div className="flex justify-items-end items-center">
        <div className="mt-4 space-x-4">
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg" onClick={printOrder}>
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
                  invoiceList.map((invoiceId, index) => {
                    return <li key={index} className="p-2 cursor-pointer border-b-2 border-gray-300 hover:bg-gray-100 last:border-none"
                    onClick={() => downloadInvoice(invoiceId)}
                    >Invoice #{invoiceId}</li>;
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
          <h3 className="text-xl font-semibold pb-3">Items Ordered</h3>
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
              <tfoot className="w-full bg-gray-200 mt-3">
                <tr className="subtotal">
                  <th
                    colSpan={4}
                    className="p-2 text-right font-semibold"
                    scope="row"
                  >
                    Subtotal
                  </th>
                  <td className="p-2 text-right font-medium">
                    ₹{orderDetails?.subtotal?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr className="shipping">
                  <th
                    colSpan={4}
                    className="p-2 text-right font-semibold"
                    scope="row"
                  >
                    Shipping &amp; Handling
                  </th>
                  <td className="p-2 text-right font-medium">
                    ₹{orderDetails?.shipping_amount?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr className="grand_total">
                  <th
                    colSpan={4}
                    className="border p-2 text-right font-bold"
                    scope="row"
                  >
                    Grand Total (Excl.Tax)
                  </th>
                  <td className="p-2 text-right font-bold">
                    ₹{orderDetails?.grand_total?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr className="totals">
                  <td colSpan={4} className="p-2 text-right font-semibold">
                    GST {orderDetails?.tax_percent || "18"}%
                  </td>
                  <td className="p-2 text-right font-medium">
                  ₹{orderDetails?.extension_attributes?.applied_taxes?.[0]?.amount?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr className="totals-tax-summary">
                  <th
                    colSpan={4}
                    className="border p-2 text-right font-semibold"
                    scope="row"
                  >
                    Tax
                  </th>
                  <td className="p-2 text-right font-medium">
                    ₹{orderDetails?.tax_amount?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr className="grand_total_incl">
                  <th
                    colSpan={4}
                    className="border p-2 text-right font-bold"
                    scope="row"
                  >
                    Grand Total (Incl.Tax)
                  </th>
                  <td className="p-2 text-right font-bold">
                    ₹{orderDetails?.subtotal_incl_tax?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OrderDetails;
