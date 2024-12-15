"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import ProductData from "@/components/productcard/ProductData";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import ProductFilter from "@/components/product-filter-card/ProductFilter";
import FilterModal from "@/components/product-filter-card/FilterModal";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";

// Define types for products and aggregations
interface AggregationItem {
  key: string;
  doc_count: number;
  name: string;
}

interface Aggregations {
  category_id: AggregationItem[];
  material: AggregationItem[];
  purity: AggregationItem[];
  quantity_val: AggregationItem[];
  product_brand: AggregationItem[];
}

interface ProductSource {
  _id: string;
  product_id: string;
  name: string;
  image: string;
  price: number;
  special_price: number | null;
  sku: string;
  url_key: string;
}

interface FilterValues {
  brands: string[];
  materials: string[];
  purity: string[];
  priceRange: number[];
  category_id: string[];
  quantity_val: string[];
}

interface Product {
  _id: string;
  _source: ProductSource;
}

// Define props type for ProductsPage
interface ProductsPageProps {
  title?: string;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ title = "Products" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Price Low to High");
  const [products, setProducts] = useState<Product[]>([]);
  const [aggregations, setAggregations] = useState<Aggregations | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [filters, setFilters] = useState<FilterValues>({
    brands: [],
    materials: [],
    purity: [],
    priceRange: [0, 1000],
    category_id: [],
    quantity_val: [],
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const brand = searchParams.get("brand") ?? "";

  const sortingOptions = [
    { label: "Price Low to High", sort: "price", sortby: "asc" },
    { label: "Price High to Low", sort: "price", sortby: "desc" },
  ];

  // Fetch Product Data and Aggregations
  const fetchProductDataList = async (append = false) => {
    const currentSortOption = sortingOptions.find(
      (option) => option.label === sortOption
    );
    const searchParams = {
      page: currentPage,
      size: pageSize,
      query: "*",
      product_brand: brand || filters.brands || "",
      category_id: filters.category_id || "",
      materials: filters.materials || "",
      purity: filters.purity || "",
      quantity_val: filters.quantity_val || "",
      sort: currentSortOption?.sort,
      sortby: currentSortOption?.sortby,
    };

    try {
      const response = await api.post("/search/products", { searchParams });
      const newProducts = response.data[0].results;

      if (append) {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setAggregations(response.data[0].aggregations);
      setTotalProducts(response.data[0].total);
    } catch (error) {
      console.log("loading failed fetch product list", error);
    }
  };

  // Modify the button click handler
  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Use `useEffect` to fetch more products when the page number changes
  useEffect(() => {
    setCurrentPage(1)
    fetchProductDataList();
  }, [filters, sortOption]);
  useEffect(() => {

    fetchProductDataList(true);
  }, [ currentPage]);
  

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
    fetchProductDataList();
  };
  return (
    <>
     <Breadcrumbs />
      <div className="w-11/12 mx-auto">
       
        <div className="flex flex-wrap py-6">
          {/* Sidebar (optional) */}
          {brand ? null : (
            <div className="hidden md:block md:w-1/4 pe-2">
              {aggregations && (
                <ProductFilter
                  aggregations={aggregations}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>
          )}
          {/* Product Display Section */}
            <div className={`w-full ${brand ? "md:w-full" : "md:w-3/4"} ps-2`}>
              <div className="flex flex-col md:flex-row md:justify-between mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <div className="flex flex-col md:flex-row items-center">
                  <span className="pe-2">
                    Showing {(currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, totalProducts)} of{" "}
                    {totalProducts} Products
                  </span>

                  <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sortOption}
                      onChange={handleSortChange}
                      className="border rounded p-1"
                    >
                      {sortingOptions.map((option) => (
                        <option key={option.label} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-block md:hidden">
                    <FilterModal
                      aggregations={aggregations}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product._id}>
                      <ProductData
                        {...product}
                        showButton={true}
                        id={product._id}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">No Products available</p>
                )}
              </div>
              <div>
                {products.length < totalProducts &&
                  <button
                  onClick={handleShowMore}
                  className="py-2 px-4 bg-indigo-500 text-white rounded-md"
                >
                  Show more
                </button>
                }
              </div>
            </div>
          
        </div>
      </div>
    </>
  );
};

//export default OrderConfirmationPage;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage />
    </Suspense>
  );
}
