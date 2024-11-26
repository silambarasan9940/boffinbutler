"use client";
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import BestSellerCard from '../productcard/BestSellerCard';
interface Product {
  _id:string;
  sku: string;
  price: string;
  headline: string;
  image: string;
  originalprice: string;
  offerprice: string;
  url_key: string;
  
}

const BestSeller = () => {

  return (
    <div className='pb-6'>
      
      <BestSellerCard  showAddToCartButton={true}/>
    </div>
  )
}

export default BestSeller;
