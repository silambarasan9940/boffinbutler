"use client";
import React, { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import { BsChevronDown, BsChevronUp, BsSearch } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { imageUrl } from "@/services/common";
import "./Search.scss";

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
  dropdownRef: React.RefObject<HTMLDivElement>;
}> = ({ toggleDropdown, isOpen, setCategoriesValue, dropdownRef }) => {
  const [categories, setCategories] = useState<ProductLink[]>([]);

  const fetchProductLinks = async () => {
    try {
      const response = await api.get("/fetch/categories");
      const products = response.data[0][0].children;
      setCategories(products);
    } catch (error) {
      console.error("Error fetching product links:", error);
    }
  };

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      fetchProductLinks();
    }
  }, []);

  return (
    <div ref={dropdownRef} className="relative hidden lg:block">
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

const ProductSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [categoriesValue, setCategoriesValue] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const router = useRouter();

  // Refs for handling outside click
  const dropdownRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSuggestionsVisible(!isSearchVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }

    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setSuggestionsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    searchBoxRef.current?.classList.remove("-open");
    router.push(`/products/${url_key}?id=${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSuggestionsVisible(false);
      searchBoxRef.current?.classList.remove("-open");
      router.push(
        `/catalogsearch/result?category_ids=${
          categoriesValue !== "" ? categoriesValue : "46"
        }&q=${query}`
      );
    }
  };

  const handleOpenSearch = (event: React.MouseEvent) => {
    event.preventDefault();
    if (searchBoxRef.current) {
      searchBoxRef.current.classList.add("-open");
      setTimeout(() => {
        inputSearchRef.current?.focus();
      }, 800);
    }
  };

  const handleCloseSearch = (event: React.MouseEvent) => {
    event.preventDefault();
    if (searchBoxRef.current) {
      searchBoxRef.current.classList.remove("-open");
    }
  };

  // const handleKeyUp = (event: KeyboardEvent) => {
  //   // if (event.key === "Escape" && searchBoxRef.current) {
  //   //   searchBoxRef.current.classList.remove("-open");
  //   // }
  //   if (event.key === "Enter" && searchBoxRef.current) {
  //     // setSuggestionsVisible(false);
  //     searchBoxRef.current.classList.remove("-open");
  //     // router.push(
  //     //   `/catalogsearch/result?category_ids=${
  //     //     categoriesValue !== "" ? categoriesValue : "46"
  //     //   }&q=${query}`
  //     // );
  //   }
  // };
  
  // useEffect(() => {
  //   document.addEventListener("keyup", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keyup", handleKeyDown);
  //   };

  // }, []);

  return (
    <>
      <div className="hidden md:flex md:flex-row items-center justify-center text-xs drop-shadow-md relative">
        <CategoriesDropdown
          toggleDropdown={toggleDropdown}
          isOpen={isOpen}
          setCategoriesValue={setCategoriesValue}
          dropdownRef={dropdownRef}
        />
        {/* <div className="hidden lg:block w-px bg-gray-300 h-6" /> */}

        <div className="relative flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Product Name, Catalog No., or CAS# ...."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={toggleSearch}
              onKeyDown={handleKeyDown}
              className="transition-all duration-300 ease-in-out bg-gray-100 px-6 py-3 focus:outline-none w-full rounded-r-full"
            />
            <button
              onClick={() =>
                query.trim() && router.push(`/catalogsearch/result?q=${query}`)
              }
              className="absolute right-0 bg-gray-100 p-3 rounded-full focus:outline-none"
            >
              <BsSearch />
            </button>
          </div>

          {suggestionsVisible && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-[9999] w-full lg:w-96 max-h-60 overflow-y-auto"
            >
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
                        redirectSuggestion(
                          suggestion._source.url_key,
                          suggestion._id
                        )
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
      </div>
      <div className="d-block md:hidden relative">
        <Link href="#search" onClick={handleOpenSearch}>
          <FiSearch className="w-6 h-6 text-indigo-500 mr-3"/> 
        </Link>
        <div id="search-box" className="relative" ref={searchBoxRef}>
          <div className="container">
            <Link
              className="close text-gray-300"
              href="#close"
              onClick={handleCloseSearch}
            ></Link>
            <div className="search-main">
              <div className="search-inner">
                <input
                  type="text"
                  id="inputSearch"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClick={toggleSearch}
                  onKeyDown={handleKeyDown}
                  ref={inputSearchRef}
                  placeholder=""
                  autoComplete="false"
                />
                
              </div>
            </div>
          </div>

          {suggestionsVisible && (
            <div
              ref={suggestionsRef}
              className="absolute top-[200px] mx-auto bg-white border border-gray-200 rounded shadow-lg z-[9999] max-h-60 overflow-y-auto"
            style={{width: "90%", margin: "20px"}}
            >
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
                        redirectSuggestion(
                          suggestion._source.url_key,
                          suggestion._id
                        )
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
                  // <li className="px-4 py-2 text-gray-500">No Suggestions</li>
                  <></>
                )}
              </ul>
            </div>
          )}
        </div>
        
      </div>
    </>
  );
};

export default ProductSearchBar;
