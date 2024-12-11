"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import TestimonialSlider from "@/components/testimonial/Testimonial";
import "@/src/assests/css/custom.css";
import CheckoutSteps from "@/components/checkoutcard/CheckoutSteps";
import CartSummaryShipping from "@/components/cart/shipping/CartSummaryShipping";
import api from "@/services/api";
import { useRouter } from "next/navigation"; 
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const ShippingPage = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);

  const [cartTotals, setCartTotals] = useState({
    grand_total: 0,
    subtotal: 0,
    discount_amount: 0,
    shipping_amount: 0,
    tax_amount: 0,
    items_qty: 0,
  });

  const [address, setAddress] = useState({ addresses: [] });
  const [shippingMethods, setShippingMethods] = useState([]); 
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null); 
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
  };

  const router = useRouter(); 
  
  const fetchCartData = async () => {
    if(tokenApi) {
      try {
        const response = await api.get("/carts/mine/totals", { headers });
        setCartTotals(response.data);
      } catch (error) {
        console.error("Error fetching cart totals:", error);
      }
    }
  };

  const fetchSavingAddresses = async () => {
    if(tokenApi) {
      try {
        const addressesResponse = await api.get("/customers/me", { headers });
        setAddress(addressesResponse.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }
  };

  // UseEffect to fetch cart totals and addresses
  useEffect(() => {

    fetchCartData();
    fetchSavingAddresses();
  }, []);

  // New useEffect to fetch address ID when addresses are fetched
  useEffect(() => {
    if (address.addresses.length > 0) {
      const addressIdString = address?.addresses[0]?.id?.toString();
      fetchShippingMethods(addressIdString); 
    }
  }, [address]);

  const fetchShippingMethods = async (addressId: string) => {
    try {
      const response = await api.post(
        "/carts/mine/estimate-shipping-methods-by-address-id",
        {
          addressId: addressId,
        },
        { headers }
      );

      setShippingMethods(response.data);
      // Set the first shipping method as selected initially
      if (response.data.length > 0) {
        setSelectedShippingMethod(response.data[0].carrier_code); 
      }
      
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    }
  };

  const handleNext = () => {
    router.push("/cart/shipping/checkout"); 
  };

  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 bg-white mx-auto">
        <CheckoutSteps page="shipping" />

        <div className="flex flex-col md:flex-row justify-between mt-8">
          <div className="w-full md:w-3/5 min-h-96 mx-auto px-4 border border-gray-300 rounded-xl flex flex-col">
            {/* Shipping address */}
            <h2 className="text-xl font-semibold py-4 border-b border-gray-300">Shipping Address</h2>

            <div className="pt-3">
              {address.addresses.length > 0 ? (
                address.addresses.map((addr: any, index: number) => (
                  <div key={index} className="mb-4">
                    <p>{addr.firstname} {addr.lastname}</p>
                    <p>{addr.company}</p>
                    <p>{addr.street.join(", ")}</p>
                    <p>{addr.city}</p>
                    <p>{addr.region.region}</p>
                    <p>{addr.postcode}</p>
                  </div>
                ))
              ) : (
                <p className="flex items-center justify-center">No addresses found</p>
              )}
            </div>

            {/* Shipping Methods */}
            <h2 className="text-xl font-semibold py-4 border-b border-gray-300">Shipping Methods</h2>
            <div className="pb-2 pt-3">
              {shippingMethods.length > 0 ? (
                shippingMethods.map((method: any, index: number) => (
                  <div key={index} className="flex items-center mb-4">
                   <div className="flex flex-row">
                   <input
                      type="radio"
                      checked={selectedShippingMethod === method.carrier_code}
                      onChange={() => setSelectedShippingMethod(method.carrier_code)}
                      className="rounded-full cursor-pointer"
                    />
                    <label className="ml-2">
                    ₹ {method.amount}
                    </label>
                   </div>
                   <div className="px-4">{method.method_title}</div>
                   <div>{method.carrier_title}</div>
                  </div>
                ))
              ) : (
                <p className="flex items-center justify-center">No shipping methods available</p>
              )}
            </div>

          </div>

          {/* Cart Summary */}
          <div className="w-full md:w-2/5 mt-8 md:mt-0">
            <CartSummaryShipping
              grandtotal={cartTotals.grand_total}
              subtotal={cartTotals.subtotal}
              discountAmount={cartTotals.discount_amount}
              shippingAmount={cartTotals.shipping_amount}
              taxAmount={cartTotals.tax_amount}
              itemsQty={cartTotals.items_qty}
              isShippingPage={true}
              totalAmount={cartTotals.grand_total}
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-full bg-gray-100 mt-8">
        <TestimonialSlider />
      </div>
    </>
  );
};

export default ShippingPage;
