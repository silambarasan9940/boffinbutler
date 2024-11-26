"use client";
import React, { useEffect, useState } from 'react';
import ProductCard from '../productcard/ProductCard';
import api from '@/services/api';
import '@/src/assests/css/custom.css';

interface ProductLink {
  id: string;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count: number;
  url_key: string;
  children_data: ProductLink[];
  
}

// Tab component
const Tab: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    className={`py-2 px-4 mb-3 font-semibold whitespace-nowrap focus:outline-none ${
      isActive ? 'bg-white text-block border-b-4 border-customBlue' : 'bg-white text-gray-700'
    }`}
    onClick={onClick}
    aria-selected={isActive}
    role="tab"
  >
    {label}
  </button>
);

// Tab content component
const TabContent: React.FC<{ content: React.ReactNode; isActive: boolean; }> = ({ content, isActive }) => (
  <div className={`p-4 transition-opacity duration-100 ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>
    {content}
  </div>
);

// Main Tabs component
const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productLinks, setProductLinks] = useState<ProductLink[]>([]);

  // Fetch product links from API
  useEffect(() => {
    const fetchProductLinks = async () => {
      
      try {
        const response = await api.get("/fetch/categories");
        const products = response.data[0][0].children;
        setProductLinks(products);
      } catch (error) {
        console.error("Error fetching product links:", error);
      }
    };

    fetchProductLinks();
  }, []);

  const tabContents = productLinks.map((label, index) => (
    <div key={index}>
      <ProductCard title={label.name} showAddToCartButton={false} category_id={label.id} />
    </div>
  ));

  const handleDropdownChange = (index: number) => {
    setActiveTab(index);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Dropdown for small screens */}
      <div className="block sm:hidden relative w-full">
        <button
          className="flex items-center justify-between py-2 px-4 border border-gray-500 font-semibold rounded-xl bg-white text-gray-700 w-full"
          onClick={() => setIsDropdownOpen(prev => !prev)}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          {productLinks[activeTab]?.name}
          <svg
            className={`ml-2 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path fillRule="evenodd" d="M4.293 5.293a1 1 0 011.414 0L8 7.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute bg-white border rounded-lg shadow-lg mt-2 w-full z-10">
            {productLinks.map((label, index) => (
              <div key={index}>
                <button
                  className="py-2 px-4 text-left w-full hover:bg-gray-100"
                  onClick={() => handleDropdownChange(index)}
                >
                  {label.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable tab buttons for larger screens */}
      <div className="hidden sm:flex overflow-x-auto md:custom-scrollbar scrollbar-hide md:flex-row w-full mx-auto bg-white mb-4" role="tablist">
        {productLinks.map((label, index) => (
          <Tab key={index} label={label.name} isActive={activeTab === index} onClick={() => setActiveTab(index)} />
        ))}
      </div>

      {/* Tab contents */}
      <div>
        {tabContents.map((content, index) => (
          <TabContent key={index} content={content} isActive={activeTab === index} />
        ))}
      </div>
    </div>
  );
};

export default Tabs;
