"use client";
import React, { useEffect, useState } from "react";
import { BsSearch, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import Link from "next/link";
import { imageUrl } from "@/services/common";

interface ProductLink {
  id: string;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count: number;
  children_data: ProductLink[];
  url_key: string;
}

// Categories Dropdown Component
const CategoriesDropdown: React.FC<{
  toggleDropdown: () => void;
  isOpen: boolean;
  setCategoriesValue: (id: string) => void;
}> = ({ toggleDropdown, isOpen, setCategoriesValue }) => {
  const [categories, setCategories] = useState<ProductLink[]>([]);

  const fetchProductLinks = async () => {
    try {
      const response = await api.get("/fetch/categories");
      const products = response.data[0][0].children;
      setCategories(products);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProductLinks();
  }, []);

  return (
    <div className="relative w-full">
      <button
        onClick={toggleDropdown}
        className="bg-gray-100 px-4 py-2 rounded focus:outline-none flex items-center justify-between w-full"
      >
        <span className="pe-2">Categories</span>
        {isOpen ? <BsChevronUp /> : <BsChevronDown />}
      </button>
      {isOpen && (
        <ul className="absolute mt-1 bg-white border border-gray-100 rounded shadow-lg z-10 w-full max-h-60 overflow-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/categories/${category.url_key}`}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={() => setCategoriesValue(category.id)}
            >
              {category.name}
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

const ProductSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoriesValue, setCategoriesValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const openMobileSearch = () => setIsMobileSearchOpen(true);
  const closeMobileSearch = () => setIsMobileSearchOpen(false);

  // Fetch search suggestions
  const fetchSearch = async (query: string) => {
    try {
      const response = await api.post("/search/products", {
        searchParams: {
          page: 1,
          size: 20,
          query,
          category_id: categoriesValue,
        },
      });
      const products = response.data[0].results;
      setSuggestions(products);
      setSuggestionsVisible(products.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle Enter Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchProducts();
    }
  };

  const searchProducts = () => {
    router.push(
      `/catalogsearch/result?category_ids=${
        categoriesValue || "46"
      }&q=${query}`
    );
    setSuggestionsVisible(false);
    closeMobileSearch();
  };

  useEffect(() => {
    if (query) {
      fetchSearch(query);
    } else {
      setSuggestionsVisible(false);
    }
  }, [query]);

  return (
    <div className="relative flex items-center justify-between md:justify-center">
      {/* Desktop View */}
      <div className="hidden md:flex items-center w-full">
        {/* Categories Dropdown */}
        <div className="w-1/3">
          <CategoriesDropdown
            toggleDropdown={toggleDropdown}
            isOpen={isOpen}
            setCategoriesValue={setCategoriesValue}
          />
        </div>

        {/* Search Input */}
        <div className="relative w-2/3 mx-4">
          <input
            type="text"
            placeholder="Search by Product Name, Catalog No., or CAS# ...."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-gray-100 px-4 py-2 rounded focus:outline-none w-full"
          />
          {suggestionsVisible && (
            <div className="absolute mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 w-full max-h-60 overflow-y-auto">
              <ul>
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/products/${suggestion._source.url_key}?id=${suggestion._id}`
                      )
                    }
                  >
                  <div className="flex items-center">
                  <img
                    src={`${imageUrl}catalog/product${suggestion._source.image}`}
                    alt={suggestion._source.name || "Product Image"}
                    className="w-10 h-10 object-cover mr-2"
                    onError={(e) => (e.currentTarget.src = "/images/placeholder.png")} // Fallback image
                  />
                  <span>{suggestion._source?.name}</span>
                </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={searchProducts}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          <BsSearch />
        </button>
      </div>

      {/* Mobile View */}
      <button
        onClick={openMobileSearch}
        className="md:hidden bg-gray-200 p-2 rounded-full"
      >
        <BsSearch size={20} />
      </button>

      {/* Mobile Search Popup */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <button onClick={closeMobileSearch} className="text-2xl">
              &times;
            </button>
          </div>

          {/* Categories Dropdown */}
          <CategoriesDropdown
            toggleDropdown={toggleDropdown}
            isOpen={isOpen}
            setCategoriesValue={setCategoriesValue}
          />

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mt-4 bg-gray-100 px-4 py-2 rounded focus:outline-none"
          />

          {/* Search Button */}
          <button
            onClick={searchProducts}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded"
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;