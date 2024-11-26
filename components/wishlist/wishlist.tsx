import { useState } from 'react';
import { IoWarning } from "react-icons/io5";

const WishList = () => {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">My WishList</h1>
      
      <div className='rounded-sm flex p-3 bg-[#fdf0d5] text-[#6f4400]'>
      <IoWarning  className='text-2xl text-[#c07600]'/>
       You have no items in your wish list.
      </div>
    </div>
  );
};

export default WishList;
