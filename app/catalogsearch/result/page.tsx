//ProductsCategoriesPage component
"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import ProductData from "@/components/productcard/ProductData";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductFilter from "@/components/product-filter-card/ProductFilter";
import FilterModal from "@/components/product-filter-card/FilterModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import Loader from "@/components/loader";

// Define types for products
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

interface Product {
  _id: string;
  _source: ProductSource;
}

interface Category {
  id: string;
  name: string;
  attributes: CustomAttribute[];
  custom_attributes: CustomAttribute[];
}
interface CustomAttribute {
  attribute_code: string;
  value: string;
}
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
  category_id: string;
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

const ProductsCategoriesPage: React.FC<ProductsPageProps> = ({
  title = "Products",
}) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("Price Low to High");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [aggregations, setAggregations] = useState<Aggregations | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterValues>({
    brands: [],
    materials: [],
    purity: [],
    priceRange: [0, 1000],
    category_id: "",
    quantity_val: [],
  });

  const router = useRouter();
  // const pathname = usePathname();
  // const id = pathname.split("/").pop();
  const productsPerPage = 12;

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    const category_id = searchParams.get("category_ids");
    alert('test page')
    if (category_id) {
      setCategory((prevCategory: any) => ({
        ...prevCategory,
        id: category_id,
      }));
    }
    fetchProductDataList();
  }, [searchParams]);

  const sortingOptions = [
    { label: "Price Low to High", sort: "price", sortby: "asc" },
    { label: "Price High to Low", sort: "price", sortby: "desc" },
  ];

  // Fetch Product Data
  const fetchProductDataList = async (append = false) => {
    const currentSortOption = sortingOptions.find(
      (option) => option.label === sortOption
    );
    const searchParams = {
      page: currentPage,
      size: pageSize,
      query: searchQuery || query || "*",
      product_brand: filters.brands || "",
      category_id: filters.category_id || "",
      materials: filters.materials || "",
      purity: filters.purity || "",
      quantity_val: filters.quantity_val || "",
      sort: currentSortOption?.sort,
      sortby: currentSortOption?.sortby,
    };
    try {
      setLoading(true);
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
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProductDataList();
  }, [filters, sortOption]);

  useEffect(() => {
    fetchProductDataList(true);
  }, [currentPage]);

  // Find the description attribute in custom_attributes
  const descriptionAttribute = category?.custom_attributes?.find(
    (attr) => attr.attribute_code === "description"
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Sort Option Handler
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    
  }, []);

  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const placeholderText = `Search for '${searchQuery || query}'`;

  const handleSearch = () => {
    fetchProductDataList();
  };
  
  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-2xl font-semibold w-full">
            Search for '<span>{searchQuery || query}</span>'
          </div>

          <div className="w-full py-4 flex flex-col">
            <div className="w-full">
              <div className="w-full flex items-center justify-end gap-4 p-4">
                {/* Search Field with Icon */}
                <div className="flex items-center w-full md:w-2/3 border border-gray-300 rounded-lg ps-2">
                  <FiSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder={placeholderText}
                    className="w-full outline-none"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="ml-2 bg-indigo-500 text-white rounded-lg px-3 py-1 hover:bg-indigo-600"
                    onClick={() => handleSearch()}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          {/* Sidebar (optional) */}
          <div className="hidden md:block md:w-1/4 pe-2">
            <ProductFilter
              aggregations={aggregations}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="flex flex-wrap w-full mx-auto py-6">
            {/* Product Display Section */}

            <div className={`w-full ps-2`}>
              <div className="flex flex-col md:flex-row md:justify-between mx-4 mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <div className="flex flex-col gap-3 md:gap-1 md:flex-row items-center">
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
              {loading ? <Loader /> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product._id}>
                      <ProductData
                        {...product}
                        showButton={true}
                        id={product._id}
                        showQuoteBtn={true}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">No Products available</p>
                )}
              </div>}
              <div className="text-center py-4">
                {products.length < totalProducts && (
                  <button
                    onClick={handleShowMore}
                    className="py-2 px-4 mt-5 bg-indigo-500 text-white rounded-md"
                  >
                    Show more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

//export default ProductsCategoriesPage;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsCategoriesPage />
    </Suspense>
  );
}
