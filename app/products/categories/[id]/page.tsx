"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import ProductData from "@/components/productcard/ProductData";
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import api from "@/services/api";
import Loader from "@/components/loader";
import ProductFilter from "@/components/product-filter-card/ProductFilter";

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

interface ProductsPageProps {
  title?: string;
}

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

interface FilterValues {
  brands: string[];
  materials: string[];
  purity: string[];
  priceRange: number[];
  category_id: string[];
  quantity_val: string[];
}

const ProductsCategoriesPage: React.FC<ProductsPageProps> = ({ title = "Products" }) => {
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
    category_id: [],
    quantity_val: [],
  });

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
 

  const sortingOptions = [
    { label: "Price Low to High", sort: "price", sortby: "asc" },
    { label: "Price High to Low", sort: "price", sortby: "desc" },
  ];

  // Fetch Product Data
  const fetchProductDataList = async (append = false) => {
    const currentSortOption = sortingOptions.find((option) => option.label === sortOption);
    const searchParams = {
      page: currentPage,
      size: pageSize,
      query: "*",
      category_id: filters.category_id || "",
      materials: filters.materials.join(","),
      purity: filters.purity.join(","),
      quantity_val: filters.quantity_val.join(","),
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
      console.error("Failed to fetch product list:", error);
    }finally{
      setLoading(false);
    }
  };

  const fetchCategoryId = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/category/${id}`);
      setCategory(response.data);
      filters.category_id = [response.data.id]
      setFilters(filters)
      fetchProductDataList();
    } catch (error) {
      console.error("Failed to fetch category:", error);
    }
  };

  useEffect(() => {
    fetchCategoryId();
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
    fetchProductDataList();
  }, [filters, sortOption]);

  useEffect(() => {
    fetchProductDataList(true);
  }, [currentPage]);

  const descriptionAttribute = category?.custom_attributes?.find(
    (attr) => attr.attribute_code === "description"
  );

// Modify the button click handler
const handleShowMore = () => {
  setCurrentPage((prevPage) => prevPage + 1);
};

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    console.log('new filters', newFilters);
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
        <div className="d-block">
          <div className="text-md text-block py-2">
            {descriptionAttribute ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: descriptionAttribute.value.replace(/\"/g, "'"),
                }}
              />
            ) : (
              <p>Description not available.</p> 
            )}
          </div>

          {/* <div className="py-4 flex flex-col">
            <div>
              <div className="flex items-center gap-4 p-4">
                <div className="flex items-center w-full md:w-3/4 border border-gray-300 rounded-lg ps-2">
                  <FiSearch className="text-gray-500 mr-2" />
                  <input type="text" 
                  placeholder="Search..." 
                  className="w-full outline-none" 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="ml-2 bg-indigo-500 text-white rounded-lg px-6 py-2 hover:bg-indigo-600"
                    
                  >
                    Search
                  </button>
                </div>
                
              </div>
            </div>
          </div> */}
        </div>
        <div className="flex flex-row">
          <div className="hidden md:block md:w-1/4 pe-2">
          <ProductFilter
              aggregations={aggregations}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="flex flex-wrap w-full mx-auto py-6">
              <div className="w-full md:w-full ps-2">
                <div className="flex flex-col md:flex-row md:justify-between mb-4">
                  <h2 className="text-xl font-bold">{title}</h2>
                  <div className="flex flex-col md:flex-row items-center">
                  <span className="pe-2 mt-3 md:mt-0">
                    Showing {(currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, totalProducts)} of{" "}
                    {totalProducts} Products
                  </span>
                    <div className="flex items-center mt-3 md:mt-0">
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
                  </div>
                </div>
                {loading ? <Loader /> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product._id}>
                      <ProductData
                        {...product}
                        showButton={false}
                        id={product._id}
                        showQuoteBtn={false}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4">No Products available</p>
                )}
              </div>}
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
