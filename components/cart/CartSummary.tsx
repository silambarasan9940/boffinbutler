"use client";
import React, { useState } from 'react';
import { GoTag } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import { MdLockOutline } from "react-icons/md";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai"; 
import { useRouter } from 'next/navigation';

interface CartSummaryProps {
  grandtotal: number;
  subtotal:number;
  discountAmount:number;
  shippingAmount:number;
  taxAmount:number;
  itemsQty:number;
  isCheckoutPage?: boolean; 
  isShippingPage?: boolean; 
  isShippingPageHeight?: boolean;
 
}

const CartSummary: React.FC<CartSummaryProps> = (
  { 
    isCheckoutPage = false, 
    isShippingPage = false, 
    isShippingPageHeight = false,
    grandtotal,
  subtotal,
  discountAmount,
  shippingAmount,
  taxAmount,
  itemsQty,

  }
) => {
  const router = useRouter();
  const dummyAddresses = [
    '123 Main St, Cityville, CA 90210',
    '456 Elm St, Townsville, TX 75001',
    '789 Oak St, Villageburg, NY 10001',
  ];

  const [promoCode, setPromoCode] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null); 

  const handleApplyPromoCode = () => {
    console.log(`Applying promo code: ${promoCode}`);
    setPromoCode('');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectAddress = (address: string) => {
    setSelectedAddress(address); 
    setIsDropdownOpen(false); 
  };

  const handleGoTOShipping = () => {
    router.push('/cart/shipping')
  }
  return (
    <div className={`w-full ${isShippingPageHeight ? 'md:mt-0' : ''} min-h-96 p-4 mt-3 md:ms-3 bg-white rounded-xl ${ isCheckoutPage ? "border-none p-0 mt-3 md:ms-0" : 'border border-gray-300'}`}>
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      {CartSummary.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div>
          <div className="flex justify-between font-bold mt-4">
            <span>Subtotal:</span>
            <span>₹ {subtotal}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between mt-2">
              <span>Discount</span>
              <span className='text-green-500 font-bold'>₹ {discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between mt-2">
            <span>Delivery Fee</span>
            <span className='font-bold'>₹ {shippingAmount}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span>Tax</span>
            <span className='font-bold'>₹ {taxAmount}</span>
          </div>
          <div className="flex justify-between font-bold mt-4 pt-3 border-t border-gray-300">
            <span>Total:</span>
            <span>₹ {grandtotal}</span>
          </div>

          {/* Address Dropdown for Checkout Page Only */}
          {isCheckoutPage && (
            <div className="relative mt-4">
              <button onClick={toggleDropdown} className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg p-2">
                <span>{selectedAddress || 'Select Address'}</span> {/* Show selected address */}
                {isDropdownOpen ? <AiOutlineUp className="text-gray-500" /> : <AiOutlineDown className="text-gray-500" />}
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-[99]">
                  {dummyAddresses.length === 0 ? (
                    <div className="p-2 text-center">No addresses available.</div>
                  ) : (
                    dummyAddresses.map((address, index) => (
                      <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectAddress(address)}>
                        {address}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            <button 
              className="w-full flex flex-row items-center justify-center 
              bg-customBlue text-white px-4 py-2 hover:bg-indigo-600 transition-transform 
              transform hover:scale-105 rounded-full"
              onClick={handleGoTOShipping}
            >
              Go to Shipping <GoArrowRight className='ms-2' />
            </button>
          </div>

          {/* Secure Checkout and Additional Info for Checkout and Shipping Pages */}
          {(isCheckoutPage || isShippingPage) && (
            <div className="mt-4 flex items-center text-black text-sm font-semibold">
              <MdLockOutline className='mr-2' />
              <span className="">Secure Checkout - SSL Encrypted</span>
            </div>
          )}
          {(isCheckoutPage || isShippingPage) && (
            <p className="mt-2 text-gray-600 text-sm pb-4">
              By placing your order, you agree to our Terms & Conditions and Privacy Policy.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CartSummary;
