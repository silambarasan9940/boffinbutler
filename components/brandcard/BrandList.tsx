'use client';
import React, { useState } from 'react';
import BrandCard from './BrandCard'; 

export type Brand = {
    id: number;
    name: string;
    brand_id: string;
    image: string;
    url_key: string;
};

type BrandListProps = {
  brands: Brand[];
};

const ITEMS_PER_PAGE = 12; 

const BrandList: React.FC<BrandListProps> = ({ brands }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages based on the number of brands
  const totalPages = Math.ceil(brands.length / ITEMS_PER_PAGE);

  // Get brands to display based on the current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
        {currentBrands.map((brand) => (
          <BrandCard
            key={brand.brand_id}
            brand_id={brand.brand_id}
            image={brand.image}
            name={brand.name}
            url_key={brand.url_key}
          />
        ))}
      
      
    </>
  );
};

export default BrandList;
