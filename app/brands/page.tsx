"use client";
import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { FiSearch } from "react-icons/fi";
import api from "@/services/api/index";
//import { CirclesWithBar } from "react-loader-spinner";
import Image from "next/image";
import loader from '@/src/assests/images/loader.gif';
import BrandList from "@/components/brandcard/BrandList";
interface Brand {
  id: number;
  name: string;
  brand_id: string;
  image: string;
  url_key: string;
}

const BrandPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const ITEMS_PER_PAGE = 12;

  // Fetch all brands when the component mounts
  const fetchBrandsData = async () => {
    try {
      const response = await api.get("/brands");
      const brandData: Brand[] = response.data;
      setAllBrands(brandData);
      setBrands(brandData.slice(0, ITEMS_PER_PAGE));
      setFilteredBrands(brandData);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("Failed to load brands.");
    } finally {
      setLoading(false);
    }
  };

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const indexOfLastItem = pageNumber * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    setBrands(filteredBrands.slice(indexOfFirstItem, indexOfLastItem));
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    // Filter brands based on the search term
    const filtered = allBrands.filter((brand) =>
      brand.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBrands(filtered);
    setBrands(filtered.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedLetter(null);
    setFilteredBrands(allBrands);
    setBrands(allBrands.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  // Handle letter selection
  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    const filtered = allBrands.filter((brand) =>
      brand.name.toLowerCase().startsWith(letter.toLowerCase())
    );
    setFilteredBrands(filtered);
    setBrands(filtered.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchBrandsData();
  }, []);

  // Total pages based on filtered brands
  const totalPages = Math.ceil(filteredBrands.length / ITEMS_PER_PAGE);

  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 mx-auto pt-6 mb-8">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Section */}
          <div className="w-full lg:w-1/4 my-3 md:me-3">
            <div className="h-auto bg-gray-200 p-4 rounded-lg md:my-3">
              <div className="text-xl font-semibold text-gray-600 border-b border-gray-300 pb-2">
                Search Brands
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex items-center mb-2 pt-4 sm:w-3/4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search brands"
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
                />
                <button className="px-3 py-3 bg-gray-300 border-l border-gray-300 rounded-r-lg">
                  <FiSearch className="text-gray-600" />
                </button>
              </div>

              {/* Clear Button on New Row */}
              <div className="mb-4 sm:ms-3 sm:w-1/4 sm:pt-4 sm:mb-2">
                <button
                  onClick={handleClearSearch}
                  className="w-full px-3 py-2 bg-gray-300 border border-gray-300 rounded-lg text-gray-600 hover:bg-indigo-500 hover:text-white"
                >
                  Clear
                </button>
              </div>
              </div>

              {/* A to Z Letters */}
              <div className="flex flex-wrap justify-center">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterSelect(letter)}
                    className={`m-1 px-3 py-2 rounded-md font-semibold transition ${
                      selectedLetter === letter
                        ? "bg-indigo-500 text-white"
                        : "bg-white border border-gray-300 text-gray-800 hover:bg-indigo-500 hover:text-white"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-auto bg-gray-200 p-4 rounded-lg hidden md:my-3">
              <div className="text-xl font-semibold text-gray-600 border-b border-gray-300 pb-2">
                My Wish List
              </div>
              <p className="py-6">You have no items in your wish list.</p>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="w-full lg:w-3/4 md:ms-3">
            <h2 className="px-5 text-3xl font-bold text-indigo-500 pb-4 border-b border-gray-300">
              ALL BRANDS
            </h2>

            {/* Display loading, error, or brands */}
            {loading ? (
                <div className="flex justify-center items-center pt-40">
                  <Image
                    src={loader}
                    alt="About Us"
                    width={46}
                    height={46}
                    className="w-full h-[46px] object-cover"
                  />
                  {/* <CirclesWithBar
                    height="100"
                    width="100"
                    color="#4fa94d"
                    outerCircleColor="#4fa94d"
                    innerCircleColor="#4fa94d"
                    barColor="#4fa94d"
                    ariaLabel="circles-with-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  /> */}
                </div>
            ) : error ? (
              <div className="text-red-500 text-center py-10">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 p-4 pt-3">
                  {brands.length > 0 ? (
                    <BrandList brands={brands} />
                  ) : (
                    <div className="text-center">No brands available.</div>
                  )}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-6 space-x-2 mx-auto">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === i + 1
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandPage;
