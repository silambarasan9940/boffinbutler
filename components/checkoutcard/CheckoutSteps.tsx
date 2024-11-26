import React from 'react';
import '@/src/assests/css/custom.css';

interface CheckoutStepsProps {
  page: 'shipping' | 'checkout';
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ page }) => {
  const isCartChecked = true; // Assuming Cart is always checked
  const isShippingChecked = page === 'shipping' || page === 'checkout';
  const isCheckoutChecked = page === 'checkout';

  return (
    <div className="flex space-x-4 items-center px-4">
      {/* Cart Checkbox */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCartChecked}
          className="form-checkbox"
          readOnly
        />
        <span className={`peer-checked:text-indigo-500 ${isCartChecked ? 'text-indigo-500' : 'text-gray-300'}`}>
          Cart
        </span>
      </label>

      {/* Shipping Checkbox */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isShippingChecked}
          className="form-checkbox"
          readOnly
        />
        <span className={`peer-checked:text-indigo-500 ${isShippingChecked ? 'text-indigo-500' : 'text-gray-300'}`}>
          Shipping
        </span>
      </label>

      {/* Checkout Checkbox */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCheckoutChecked} 
          className={`form-checkbox`}
          style={{
            borderColor: page === 'shipping' ? 'rgb(209 213 219)' : '#4f46e5',
            backgroundColor: 'rgb(255 255 255)',
            cursor: 'pointer',
          }}
          readOnly
        />
        <span className={`peer-checked:text-indigo-500 ${isCheckoutChecked ? 'text-indigo-500' : 'text-gray-300'}`}>
          Checkout
        </span>
      </label>
    </div>
  );
};

export default CheckoutSteps;
