import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import CartItem from "../../CartItem";
import api from "@/services/api";
import { GoTag } from "react-icons/go";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { resetCount, setCount } from "@/redux/store/slices/cartItemCountSlice";

interface BillingAddress {
  customer_address_id?: string;
  country_id?: string;
  region_id?: number;
  region_code?: string;
  region?: string;
  customer_id?: string;
  street?: string[];
  company?: string | null;
  telephone?: string;
  fax?: string | null;
  postcode?: string;
  city?: string;
  firstname?: string;
  lastname?: string;
  middlename?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  vat_id?: string | null;
  custom_attributes?: any[];
  save_in_address_book?: boolean;
}

interface CartData {
  billing_address?: BillingAddress | null;
}

interface CartSummaryCheckoutProps {
  grandtotal: number;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  itemsQty: number;
  isCheckoutPage?: boolean;
  isShippingPage?: boolean;
  isShippingPageHeight?: boolean;
  isBorderHidden?: boolean;
}

// Totals Interface
interface Totals {
  grand_total: number;
  base_grand_total: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount: number;
  base_discount_amount: number;
  subtotal_with_discount: number;
  base_subtotal_with_discount: number;
  shipping_amount: number;
  base_shipping_amount: number;
  shipping_discount_amount: number;
  base_shipping_discount_amount: number;
  tax_amount: number;
  base_tax_amount: number;
  weee_tax_applied_amount: null;
  shipping_tax_amount: number;
  base_shipping_tax_amount: number;
  subtotal_incl_tax: number;
  shipping_incl_tax: number;
  base_shipping_incl_tax: number;
  base_currency_code: string;
  quote_currency_code: string;
  coupon_code: string;
  items_qty: number;
}
declare global {
  interface Window {
   Razorpay: any;
  }
 
 }
const CartSummaryCheckout: React.FC<CartSummaryCheckoutProps> = ({
  isCheckoutPage = false,
  isShippingPage = false,
  isShippingPageHeight = false,
  isBorderHidden = false,
  grandtotal,
  subtotal,
  discountAmount,
  shippingAmount,
  taxAmount,
  itemsQty,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [placeOrder, setPlaceOrder] = useState("");
  const [cartData, setCartData] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState<Totals | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const paymentMethod = useSelector((state: RootState) => state.payment.method);
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
  };
  const razorHeaders = {
    "Content-Type":'multipart/form-data'
  };
  const fetchCartData = async () => {
    if(tokenApi) {
      try {
        const response = await api.get("/carts/mine", { headers });
        // if has data
        if(response.data.id){
        setCartData(response.data);
        fetchPayment();
      } else{

        // route to cart page
        router.push('/cart/');
      }

      } catch (error) {
        console.log("Failed to fetch cart data", error);
        throw error;
      }
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject("Razorpay script could not be loaded.");
      };
      document.body.appendChild(script);
    });
  };
  
  const fetchPlaceOrder = async () => {
    // const timestamp = new Date().getTime();
    // console.log(timestamp);
   
    const payload = {
      cartId: localStorage.getItem("quote_id"),
      billingAddress: {
        customerAddressId:
          cartData?.billing_address?.customer_address_id || null,
        countryId: cartData?.billing_address?.country_id || null,
        regionId: cartData?.billing_address?.region_id || null,
        regionCode: cartData?.billing_address?.region_code || null,
        region: cartData?.billing_address?.region || null,
        customerId: cartData?.billing_address?.customer_id || null,
        street: cartData?.billing_address?.street || [],
        company: cartData?.billing_address?.company || null,
        telephone: cartData?.billing_address?.telephone || null,
        fax: cartData?.billing_address?.fax || null,
        postcode: cartData?.billing_address?.postcode || null,
        city: cartData?.billing_address?.city || null,
        firstname: cartData?.billing_address?.firstname || null,
        lastname: cartData?.billing_address?.lastname || null,
        middlename: cartData?.billing_address?.middlename || null,
        prefix: cartData?.billing_address?.prefix || null,
        suffix: cartData?.billing_address?.suffix || null,
        vatId: cartData?.billing_address?.vat_id || null,
        customAttributes: cartData?.billing_address?.custom_attributes || [],
        saveInAddressBook:
          cartData?.billing_address?.save_in_address_book || null,
      },
      paymentMethod: {
        method: paymentMethod,
        po_number: null,
        additional_data: null,
      },
      
    };

    try {
      if(paymentMethod === 'razorpay') {
        await loadRazorpayScript();

        const paymentResponse = await api.post(
           `https://beta.boffinbutler.com/razorpay/payment/order?${Math.random().toString(36).substring(10)}`,
          {
            email:"TEST_Punithavel+faculty@gmail.com",
            billing_address: payload.billingAddress,
            cart_id: payload.cartId,
          }, {headers: razorHeaders, }
  
        );
        console.log(paymentResponse, 'payment');

       if((paymentResponse.status === 200) && (paymentResponse.data.success)) {
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
        const options = {
          key: razorpayKey, 
          amount: paymentResponse.data.amount,
          currency: "INR",
          name: `${payload.billingAddress.firstname} ${payload.billingAddress.lastname}`,
          // description: "Test Transaction",
          order_id: paymentResponse.data.rzp_order,
          handler: async (handlerResponse: any) => {
            console.log(handlerResponse, 'handler resp')
            
              

            const paymentCheckResponse = await api.post(
              `https://beta.boffinbutler.com/razorpay/payment/order?${Math.random().toString(36).substring(10)}`,
             {
              order_check: 1,
             }, {headers: razorHeaders, }
     
           );
           console.log(paymentCheckResponse, 'handler paymentCheckResponse')
           if(paymentCheckResponse.data.success) {
             dispatch(resetCount());
             const response = await api.post(
               "/carts/mine/payment-information",
               payload,
               { headers }
             );
             setPlaceOrder(response.data);
             toast.success("Your Order has been placed", {
               icon: <FaCheckCircle className="text-green-500" />,
               progressStyle: { backgroundColor: "green" },
               autoClose: 1000,
               onClose: () => router.push(`/order-confirmation?id=${response.data}`),
             });
             
           }
           
          },
          prefill: {
            name: `${payload.billingAddress.firstname} ${payload.billingAddress.lastname}`,
            email: "johndoe@example.com",
            contact: payload.billingAddress.telephone,
          },
          theme: {
            color: "#3399cc",
          },
        };
        
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
       }
        
        
      }else{
        const response = await api.post(
          "/carts/mine/payment-information",
          payload,
          { headers }
        );
        setPlaceOrder(response.data);
        if (response.status === 200) {
          dispatch(resetCount());
          toast.success("Your Order has been placed", {
            icon: <FaCheckCircle className="text-green-500" />,
            progressStyle: { backgroundColor: "green" },
            autoClose: 1000,
            onClose: () => router.push(`/order-confirmation?id=${response.data}`),
          });
        } else {
          console.error("Error placing order: response unsuccessful");
          toast.error("There was an issue placing your order.", {
            icon: <FaExclamationCircle className="text-red-500" />,
            progressStyle: { backgroundColor: "red" },
          });
      }
      
      }

    } catch (error) {
      console.error("Failed to place order:", error);
      // toast.error("There was an issue placing your order.", {
      //   icon: <FaExclamationCircle className="text-red-500" />,
      //   progressStyle: { backgroundColor: "red" },
      // });
    }
  };

  const fetchPayment = async () => {
    try {
      const response = await api.get("/carts/mine/payment-information", {
        headers,
      });
      setPaymentSummary(response.data.totals);
    } catch (error) {
      console.log("Failed to load data", error);
    }
  };
  const fetchApplyPromoCode = async () => {
    try {
      const response = await api.put(
        `/carts/mine/coupons/${promoCode}`,
        {},
        { headers }
      );
      console.log("Apply Promo code", response.data);
    } catch (error) {
      console.error("Error applying promo code");
    }
  };

  const fetchDeletePromoCode = async () => {
    try {
      const response = await api.delete(`/carts/mine/coupons`, { headers });
      console.log("Delete Promo code", response.data);
    } catch (error) {
      console.error("Error Delete promo code", error);
    }
  };

  const handleApplyPromoCode = () => {
    fetchApplyPromoCode().then(() => {
      setIsApplied(true);
      fetchPayment();
    });
  };

  const handleDeletePromoCode = () => {
    fetchDeletePromoCode().then(() => {
      setPromoCode("");
      setIsApplied(false);
      fetchPayment();
    });
  };

  return (
    <>
      <div
        className={`w-full ${
          isShippingPageHeight ? "md:mt-0" : ""
        } min-h-96 p-4 mt-3 md:ms-3 bg-white rounded-xl ${
          isCheckoutPage
            ? "border-none md:p-2 md:m-2 md:ms-0"
            : "border border-gray-300"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {CartSummaryCheckout.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <div>
            <div className="flex justify-between font-bold mt-4">
              <span>Subtotal:</span>
              <span>₹ {paymentSummary?.subtotal}</span>
            </div>
            {Math.abs(paymentSummary?.discount_amount ?? 0) > 0 && (
              <>
                <div className="flex justify-between mt-2">
                  <span>Discount</span>
                  <span className="text-indigo-500 font-bold">
                    ₹ {paymentSummary?.discount_amount ?? 0}
                  </span>
                </div>
                {paymentSummary?.coupon_code && (
                  <div className="flex justify-between mt-2">
                    <span>Coupon Code</span>
                    <span className="text-indigo-500 font-bold">
                      {paymentSummary?.coupon_code ?? ""}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between mt-2">
              <span>Delivery Fee</span>
              <span className="font-bold">
                ₹ {paymentSummary?.shipping_amount}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Tax</span>
              <span className="font-bold">₹ {paymentSummary?.tax_amount}</span>
            </div>
            <div className="flex justify-between font-bold mt-4 pt-3 border-t border-gray-300">
              <span>Total:</span>
              <span>₹ {paymentSummary?.grand_total}</span>
            </div>

            {/* <PromoCode /> */}
            {/* Promo Code Input and Button */}
            <div className="mt-4 flex">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Add promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="border rounded-full p-2 w-full pl-10 focus:border-indigo-500 transition-colors duration-200"
                  disabled={isApplied}
                />

                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <GoTag className="text-gray-300 ms-2" />
                </div>
              </div>
              {isApplied ? (
                <button
                  onClick={handleDeletePromoCode}
                  className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-transform transform hover:scale-105 ml-2 rounded-full"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={handleApplyPromoCode}
                  className="bg-customBlue text-white px-4 py-2 hover:bg-indigo-600 transition-transform transform hover:scale-105 ml-2 rounded-full"
                >
                  Apply
                </button>
              )}
            </div>
            <div className="mt-4">
              <button
                className="w-full flex flex-row items-center justify-center 
              bg-customBlue text-white px-4 py-2 hover:bg-indigo-600 transition-transform 
              transform hover:scale-105 rounded-full"
                onClick={fetchPlaceOrder}
              >
                Place Your Order <GoArrowRight className="ms-2" />
              </button>
              <ToastContainer
                position="top-center"
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
              />
            </div>

            {/* Secure Checkout and Additional Info for Checkout and Shipping Pages */}
            {(isCheckoutPage || isShippingPage) && (
              <div className="mt-4 flex items-center text-black text-sm font-semibold">
                <MdLockOutline className="mr-2" />
                <span className="">Secure Checkout - SSL Encrypted</span>
              </div>
            )}
            {(isCheckoutPage || isShippingPage) && (
              <p className="mt-2 text-gray-600 text-sm pb-4">
                By placing your order, you agree to our Terms & Conditions and
                Privacy Policy.
              </p>
            )}
          </div>
        )}
      </div>
      {/* <div className='p-4'>
      <div className='flex flex-row items-center justify-between border-b border-gray-300 pb-3'>
        <div className='text-xl font-semibold'>Shipping to </div>
        <div><MdOutlineEdit /></div>
      </div>

      <div className='flex flex-row items-center justify-between border-b border-gray-300 pb-3'>
        <div className='text-xl font-semibold'>Shipping Method </div>
        <div><MdOutlineEdit /></div>
      </div>
    </div> */}
    </>
  );
};

export default CartSummaryCheckout;
