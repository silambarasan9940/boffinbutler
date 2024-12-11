"use client";
import api from "@/services/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsChevronDown, BsChevronUp, BsSearch } from "react-icons/bs";
import { useRouter } from "next/navigation";
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

const CategoriesDropdown: React.FC<{
  toggleDropdown: () => void;
  isOpen: boolean;
  setCategoriesValue: (id: string) => void;
}> = ({ toggleDropdown, isOpen, setCategoriesValue }) => {
  const [categories, setCategories] = useState<ProductLink[]>([]);

  useEffect(() => {
    const fetchProductLinks = async () => {
      try {
        const response = await api.get("/fetch/categories");
        const products = response.data[0][0].children;
        setCategories(products);
      } catch (error) {
        console.error("Error fetching product links:", error);
      }
    };
    fetchProductLinks();
  }, []);

  return (
    <div className="relative hidden lg:block">
      <button
        onClick={toggleDropdown}
        className="bg-gray-100 px-6 py-3 rounded-l-full focus:outline-none flex items-center"
      >
        <span className="pe-2">Categories</span>
        {isOpen ? <BsChevronUp /> : <BsChevronDown />}
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-1 bg-white border border-gray-100 rounded shadow-lg z-10 w-48">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/categories/${category.url_key}`}
              className="block px-4 py-2 text-gray-800 hover:bg-indigo-100"
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

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  isSearchVisible: boolean;
  toggleSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  isSearchVisible,
  toggleSearch,
  onKeyDown,
}) => {
  const router = useRouter();

  const handleSearchClick = () => {
    if (query.trim() !== "") {
      toggleSearch(); 
      router.push(`/catalogsearch/result?q=${query}`);
    }
  };

  return (
    <div className="flex items-center w-full relative">
      <input
        type="text"
        placeholder="Search by Product Name, Catalog No., or CAS# ...."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClick={toggleSearch}
        onKeyDown={onKeyDown}
        className={`transition-all duration-300 ease-in-out bg-gray-100 px-6 py-3 focus:outline-none w-full 
        ${isSearchVisible ? "rounded-full pl-6 md:border-l-2 md:border-gray-500" : "hidden md:block rounded-r-full md:border-l-2 md:border-gray-500"}`}
      />
      <button
        onClick={handleSearchClick}
        className={`absolute right-0 transition-all duration-300 ease-in-out bg-gray-100 p-3 rounded-full focus:outline-none 
        ${isSearchVisible ? "absolute right-0" : "md:block me-2"}`}
      >
        <BsSearch />
      </button>
    </div>
  );
};

const ProductSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [categoriesValue, setCategoriesValue] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSuggestionsVisible(!isSearchVisible);
  };

  useEffect(() => {
    if (query) {
      fetchSearch(query);
    } else {
      setSuggestionsVisible(false);
    }
  }, [query]);

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
      console.error("Error fetching product links:", error);
    }
  };

  const redirectSuggestion = (url_key: string, id: string) => {
    setSuggestionsVisible(false);
    router.push(`/products/${url_key}?id=${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSuggestionsVisible(false);
      router.push(`/catalogsearch/result?category_ids=${categoriesValue !== '' ? categoriesValue : "46"}&q=${query}`);
    }
  };

  return (
    <div className="flex md:flex-row items-center justify-center text-xs drop-shadow-md relative">
      <CategoriesDropdown
        toggleDropdown={toggleDropdown}
        isOpen={isOpen}
        setCategoriesValue={setCategoriesValue}
      />
      <div className="hidden lg:block w-px bg-gray-300 h-6" />

      <SearchInput
        query={query}
        setQuery={setQuery}
        isSearchVisible={isSearchVisible}
        toggleSearch={toggleSearch}
        onKeyDown={handleKeyDown}
      />

      {isSearchVisible && suggestionsVisible && (
        <div className="absolute top-full left-0 lg:left-auto mt-2 bg-white border border-gray-200 rounded shadow-lg z-[9999] w-full lg:w-96 max-h-60 overflow-y-auto">
          <div className="border-b border-gray-300 p-2 font-semibold">
            Popular Suggestions
          </div>
          <ul className="p-2">
            {suggestions.length > 0 ? (
              suggestions.slice(0, 5).map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    redirectSuggestion(suggestion._source.url_key, suggestion._id)
                  }
                >
                  <div className="flex items-center">
                    <img
                      src={`${imageUrl}catalog/product${suggestion._source.image}`}
                      alt={suggestion._source.name}
                      className="w-10 h-10 object-cover mr-2"
                    />
                    <span>{suggestion._source?.name}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No Suggestions</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
