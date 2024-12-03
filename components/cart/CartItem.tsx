import React from 'react';
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { increment, decrement, resetCount } from '@/redux/store/slices/cartItemCountSlice';

interface CartItemProps {
  itemId: string;
  name: string;
  price: number;
  allTax: string;
  offerPrice: string;
  quantity: number;
  imageUrl: string;
  onAddQuantity: (itemId: string) => void;
  onRemoveQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void; 
}


const CartItem: React.FC<CartItemProps> = ({
  itemId,
  name,
  price,
  allTax,
  offerPrice,
  quantity,
  imageUrl,
  onAddQuantity,
  onRemoveQuantity,
  onRemoveItem,
}) => {
  const dispatch: AppDispatch = useDispatch();
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
      };
  return (
    <div className="flex justify-between py-4 border-b">
      <div className="flex items-center">
        <img src={imageUrl} alt={name} className="w-24 h-24 rounded mr-4" />
        <div className='pe-4 w-full'>
          <div className='flex flex-col sm:hidden'>
            <div className='flex items-center justify-between w-full'>
              <h2 className="text-sm font-semibold pb-2">{truncateText(name, 20)}</h2>
              <BsTrash
                className="text-red-500 cursor-pointer hover:text-red-700 mb-2"
                onClick={() => onRemoveItem(itemId)} 
              />
            </div>
            <div className="flex items-center justify-around bg-gray-300 rounded-3xl w-[80px] sm:w-[110px]">
              <button
                onClick={() => {onRemoveQuantity(itemId);
                  dispatch(decrement());
                }}
                className="px-1 sm:px-3 py-1 text-xs sm:text-xl font-semibold"
              >
                -
              </button>
              <span className="mx-4 text-xs sm:text-sm">{quantity}</span>
              <button
                onClick={() =>{ onAddQuantity(itemId);
                  dispatch(increment())
                }}
                className="px-1 sm:px-3 py-1 text-xs sm:text-xl font-semibold"
              >
                +
              </button>
            </div>
          </div>

          <h2 className="hidden sm:block sm:text-sm sm:font-semibold sm:pb-2">{name}</h2>
          <p className="flex flex-row items-center text-sm text-gray-500 py-2">
            Price: ₹{price.toFixed(2)} 
            <div className='text-green-800 bg-green-300 text-xs font-bold rounded-3xl px-2 ms-4'>{offerPrice}</div>
          </p>
          <p className="flex flex-row items-center font-semibold">
            Total: ₹{(price * quantity).toFixed(2)} 
            <div className='text-xs text-gray-400 ps-2'>{allTax}</div> 
          </p>
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-col sm:items-center sm:justify-between">
        <BsTrash
          className="text-red-500 cursor-pointer hover:text-red-700 mb-2"
          onClick={() => onRemoveItem(itemId)} 
        />
        <div className="flex items-center bg-gray-300 rounded-3xl">
          <button
            onClick={() => {onRemoveQuantity(itemId);
              dispatch(decrement());
            }}
            className="px-3 py-1 text-xl font-semibold"
          >
            -
          </button>
          <span className="mx-4 text-sm">{quantity}</span>
          <button
            onClick={() => {
              onAddQuantity(itemId);
              dispatch(increment())
            }}
            className="px-3 py-1 text-xl font-semibold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
