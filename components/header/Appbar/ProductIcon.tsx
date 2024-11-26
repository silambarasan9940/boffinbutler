import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setCount } from "@/redux/store/slices/cartItemCountSlice";


interface ProductIconProps {
  icon: React.ReactNode; 
  notificationCount: number; 
  bgColor?: string; 
  notificationBgColor?: string; 
}

const ProductIcon: React.FC<ProductIconProps> = ({
  icon,
  notificationCount,
  bgColor = 'bg-customBlue', 
  notificationBgColor = 'bg-yellow-500',
  
}) => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const count = useSelector((state: RootState) => state.cartItemCount.count);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${tokenApi}`,
        };

        // Make the API call with Axios
        const response = await api.get('/carts/mine/totals', { headers });
        
        // Destructure the required totals from the API response
        const { items_qty } = response.data;
        
        dispatch(setCount(items_qty));
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } 
    };

    fetchCartItems();
  }, [tokenApi]);
  
const handlecart = () => {
  router.push('/cart');
}
  return (
    <div className="relative inline-block drop-shadow-md cursor-pointer" onClick={handlecart}>
      <div className={`rounded-full p-2 ${bgColor} text-white`}>
        {icon}
      </div>

      {count > 0 && (
        <div
          className={`absolute -top-2 -right-2 h-5 w-5 ${notificationBgColor} rounded-full flex items-center justify-center text-block text-xs`}
        >
          {count}
        </div>
      )}
    </div>
  );
};

export default ProductIcon;
