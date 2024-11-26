'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { imageUrl } from '@/services/common';

type BrandCardProps = {
  brand_id: string;
  image: string;
  name: string;
  url_key: string;
};

// BrandCard component definition
const BrandCard: React.FC<BrandCardProps> = ({
  brand_id,
  image,
  name,
  url_key
}) => {
  const router = useRouter();
  const handleBrand = (brand_id:string) => {
    router.push(`/products?brand=${brand_id}`)
  };
  return (
    <div className="group relative max-w-xs bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col justify-center items-center pb-4 cursor-pointer border border-gray-300">
      <div className="w-full flex flex-col justify-center items-center p-4"
      onClick={() => handleBrand(brand_id)}
      >
        <Image src={`${imageUrl}${image}`} alt={name} width={200} height={200} className="w-full h-auto object-cover pb-4" />
        {/* Tooltip */}
        <div className="absolute top-30 hidden group-hover:flex justify-center">
          <div className="bg-black text-white text-sm p-2 rounded-lg shadow-lg flex items-center space-x-2">
            <span>{name}</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 text-center py-3 rounded-lg hover:bg-indigo-500 hover:text-white transition-shadow duration-300 ease-in-out">
          <h3 className="text-lg font-semibold px-3">{name}</h3>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
