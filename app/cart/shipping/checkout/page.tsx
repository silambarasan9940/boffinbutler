"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import CheckoutSteps from "@/components/checkoutcard/CheckoutSteps";
import CartSummaryCheckout from "@/components/cart/shipping/chaeckout/CartSummaryCheckout";
import api from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Address, CustomAttribute, ExtensionAttributes, CustomerResponse } from '@/services/types/address-types/index';
import { UseDispatch } from "react-redux";
import {setPaymentMethod} from '@/redux/store/slices/paymentSlice';
import {useRouter} from "next/navigation";


const PaymentMethod: React.FC = () => {
  const tokenApi = useSelector((state:RootState) => state.auth.token);

  const [customerAddress, setCustomerAddress] = useState<CustomerResponse | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]); 
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showBillingAdd, setShowBillingAdd] = useState("");
  const [cartId, setCartId] = useState<string | null>(null);

  const dispatch = useDispatch();
  
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
  };

  // Fetch customer address from API or localStorage
  const fetchCustomerAddress = async () => {
    const storedAddress = localStorage.getItem('customerAddress');
    if (storedAddress) {
      setCustomerAddress(JSON.parse(storedAddress));
    } else {
      try {
        const response = await api.get('/customers/me', { headers });
        setCustomerAddress(response.data);
        localStorage.setItem('customerAddress', JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching address", error);
      }
    }
  };

  // Fetch payment options based on customer address
  const fetchPaymentOption = async () => {
    if (!customerAddress) return; 
  
    try {
      const response = await api.post('/carts/mine/shipping-information', {
        addressInformation: {
          shipping_address: {
            customerAddressId: customerAddress.addresses[0].id.toString(),
            countryId: customerAddress.addresses[0].country_id,
            regionId: customerAddress.addresses[0].region_id.toString(),
            regionCode: customerAddress.addresses[0].region.region_code,
            region: customerAddress.addresses[0].region.region,
            customerId: customerAddress.id.toString(),
            street: customerAddress.addresses[0].street,
            company: customerAddress.addresses[0].company,
            telephone: customerAddress.addresses[0].telephone,
            fax: null,
            postcode: customerAddress.addresses[0].postcode,
            city: customerAddress.addresses[0].city,
            firstname: customerAddress.addresses[0].firstname,
            lastname: customerAddress.addresses[0].lastname,
            middlename: null,
            prefix: null,
            suffix: null,
            vatId: null,
            customAttributes: [],
          },
          billing_address: {
            customerAddressId: customerAddress.addresses[0].id.toString(),
            countryId: customerAddress.addresses[0].country_id,
            regionId: customerAddress.addresses[0].region_id.toString(),
            regionCode: customerAddress.addresses[0].region.region_code,
            region: customerAddress.addresses[0].region.region,
            customerId: customerAddress.id.toString(),
            street: customerAddress.addresses[0].street,
            company: customerAddress.addresses[0].company,
            telephone: customerAddress.addresses[0].telephone,
            fax: null,
            postcode: customerAddress.addresses[0].postcode,
            city: customerAddress.addresses[0].city,
            firstname: customerAddress.addresses[0].firstname,
            lastname: customerAddress.addresses[0].lastname,
            middlename: null,
            prefix: null,
            suffix: null,
            vatId: null,
            customAttributes: [],
            saveInAddressBook: null,
          },
          shipping_method_code: "freeshipping",
          shipping_carrier_code: "freeshipping",
          extension_attributes: {},
        }
      }, { headers });
  
      setPaymentOptions(response.data.payment_methods || []);
    } catch (error) {
      console.error("Error fetching payment options", error);
    }
  };
  
  const fetchPaymentMethods = async (cartId: string, method: string) => {
    try {
      const payload = {
        cartId: cartId,
        paymentMethod: {
          method: method,
        },
      };

      const response = await api.post("/carts/mine/set-payment-information", payload, { headers });
     
    } catch (error) {
      console.error("Error setting payment method:", error);
    }
  };
  const handleChange = async (methodCode: string) => {
    dispatch(setPaymentMethod(methodCode));
    setSelectedMethod(methodCode);
  
    try {
      const response = await api.get('/carts/mine', { headers });
      const cartId = response.data.id; 
      if (cartId) {
        fetchPaymentMethods(cartId, methodCode); 
      }
    } catch (error) {
      console.error("Error in handleChange", error);
    }
  };
  

  useEffect(() => {
    fetchCustomerAddress();
  }, []);

  useEffect(() => {
    fetchPaymentOption();
  }, [customerAddress]); 

  
  return (
    <div className="mt-4">
      
      {paymentOptions.map((method) => (
        <>
        <div key={method.code} className="flex flex-col mb-2 border-b border-gray-300 pb-4">
          <div className="flex flex-row items-center">
          <input
            type="radio"
            id={method.code}
            checked={selectedMethod === method.code}
            onChange={() => {
              handleChange(method.code);
              setShowBillingAdd(method.code); 
            }}
            // onClick={() => setShowBillingAdd(true)}
            className="form-radio h-3 w-3 text-indigo-600 border-gray-300 rounded-full cursor-pointer"
          />
          <label htmlFor={method.code} className="ml-2 text-gray-700">
            {method.title}
          </label>
          </div>
         
         <div>
         {
            showBillingAdd === method.code && (
              <div className="pt-4 ps-6">
            <div>Billing Address :</div>
            <div className="ps-3">{customerAddress?.addresses[0].firstname}</div>
            <div className="ps-3">{customerAddress?.addresses[0].company}</div>
            <div className="ps-3">{customerAddress?.addresses[0].street}</div>
            <div className="ps-3">{customerAddress?.addresses[0].city}</div>
            <div className="ps-3">{customerAddress?.addresses[0].postcode}</div>
            </div>
            )
            
            }
         </div>
        </div>
       
        </>
        
      ))}
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  
  const tokenApi = useSelector((state:RootState) => state.auth.token);
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
  };
  
  const [cartTotals, setCartTotals] = useState({
    grand_total: 0,
    subtotal: 0,
    discount_amount: 0,
    shipping_amount: 0,
    tax_amount: 0,
    items_qty: 0,
  });

  const fetchCartData = async () => {
     if(tokenApi) {
      try {
        
        const response = await api.get('/carts/mine/totals', { headers });
        if(response.data.id){
          setCartTotals(response.data);
          // fetchCustomerAddress();

        }
        // else{
        //   router.push('/cart')

        // }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
     }
    
  };
  useEffect(() => {
    

    fetchCartData();
  }, []);

 


  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 bg-white mx-auto">
        <CheckoutSteps page="checkout" />
        <div className="flex flex-col md:flex-row justify-between mt-8">
          <div className="w-full md:w-3/5 min-h-96 mx-auto px-4 border border-gray-300 rounded-xl flex flex-col">
            <div className="text-xl font-semibold py-4 border-b border-gray-300">Payment Method</div>
            <PaymentMethod />
          </div>
          <div className="w-full md:w-2/5">
            <div className="w-full mx-auto min-h-96 pl-0 p-4 mt-3 md:ms-3 bg-white rounded-xl border border-gray-300">
              <CartSummaryCheckout
                grandtotal={cartTotals.grand_total}
                subtotal={cartTotals.subtotal}
                discountAmount={cartTotals.discount_amount}
                shippingAmount={cartTotals.shipping_amount}
                taxAmount={cartTotals.tax_amount}
                itemsQty={cartTotals.items_qty}
                isShippingPage={true}
                isBorderHidden={false}
                isCheckoutPage={true}
              />
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default CheckoutPage;
