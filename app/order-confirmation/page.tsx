"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { CirclesWithBar } from "react-loader-spinner";
import api from "@/services/api";
import { Order, Address, Item } from "@/services/types/ordertypes/index";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useSearchParams } from "next/navigation";

const OrderConfirmationPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Fetch api call
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/mtwo/me/orders/${id}`, { headers });
        setOrderDetails(response.data);
        localStorage.removeItem("quote_id");
      } catch (error) {
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CirclesWithBar
          height="100"
          width="100"
          color="#625df5"
          outerCircleColor="#625df5"
          innerCircleColor="#625df5"
          barColor="#625df5"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs />

      <div className="w-full md:w-1/2 mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Order Confirmation
        </h1>

        <div
          className="bg-white rounded-lg p-6"
          style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
        >
          <div className="flex flex-col justify-center items-center">
            <AiOutlineCheckCircle className="text-green-500 w-16 h-16 mr-2" />
            <h2 className="text-xl font-semibold">Thank you for your order!</h2>
            <p className="mb-4">
              Your order number is:{" "}
              <strong>{orderDetails?.increment_id}</strong>
            </p>
          </div>

          {/* Shipping and Billing Information */}
          <div className="flex flex-col md:flex-row justify-between">
            {/* <div className="mb-4">
       <h3 className="text-lg font-medium mb-2">Shipping Address:</h3>
       <p>{orderDetails?.shi}</p>
      </div> */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Billing Address:</h3>
              <p>
                {orderDetails?.billing_address.firstname}{" "}
                {orderDetails?.billing_address.lastname}
              </p>
              <p>{orderDetails?.billing_address.email}</p>
              <p>{orderDetails?.billing_address.street}</p>
              <p>{orderDetails?.billing_address.city}</p>
              <p>{orderDetails?.billing_address.postcode}</p>
              <p>{orderDetails?.billing_address.region}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Order Summary:</h3>
            <ul className="list-none list-inside">
              {orderDetails?.items.map((item: any) => (
                <li key={item.id} className="flex justify-between">
                  <div className="text-left">
                    {item.name} (x {item.qty_ordered})
                  </div>

                  <div className="text-right">
                  ₹{item.price * item.qty_ordered}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Total Amount */}
          <div className="border-t pt-4 text-right">
            <h3 className="text-lg font-medium mb-2">Total Amount:</h3>
            <p className="text-2xl font-bold">
            ₹{orderDetails?.base_grand_total}
            </p>
          </div>

          {/* Button to navigate to Home or Orders Page */}
          <div className="mt-6 text-right">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              onClick={() => router.push("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

//export default OrderConfirmationPage;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationPage />
    </Suspense>
  );
}
