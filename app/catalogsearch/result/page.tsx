"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import ProductData from "@/components/productcard/ProductData";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductFilter from "@/components/product-filter-card/ProductFilter";
import Testimonial from "@/components/testimonial/Testimonial";
import FilterModal from "@/components/product-filter-card/FilterModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";

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

  useEffect(() => {
    setCurrentPage(1);
    fetchProductDataList();
    
  }, [filters, searchQuery, sortOption]);
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

  return (
    <>
      <Breadcrumbs />
      <div className="w-11/12 mx-auto">
        <div className="d-block">
          <div className="text-2xl font-semibold">
            Search for '<span>{searchQuery || query}</span>''
          </div>

          <div className="py-4 flex flex-col">
            <div>
              <div className="flex items-center gap-4 p-4">
                {/* Search Field with Icon */}
                <div className="flex items-center w-1/2 md:w-3/4 border border-gray-300 rounded-lg p-2">
                  <FiSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full outline-none"
                    onChange={(e)=>setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="text-gray-700 font-semibold">
                  Brand <span className="text-indigo-500">MERCK (3790)</span>
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
                  {products.map((product) => (
                    <div>
                      <ProductData
                        {...product}
                        showButton={false}
                        id={product._id}
                      />
                    </div>
                  ))}
                </div>
                <div>
                {products.length >= 12 &&
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
