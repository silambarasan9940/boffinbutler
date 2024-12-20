"use client";
import React, { useEffect, useState } from "react";
import { FiSliders, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Range } from "react-range";

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

interface ProductFilterProps {
  aggregations: Aggregations | null;
  onFilterChange: (filters: FilterValues) => void;
  // onFilterClear: (filters: FilterValues) => void;
}

interface FilterValues {
  brands: string[];
  materials: string[];
  purity: string[];
  priceRange: number[];
  category_id: string[];
  quantity_val: string[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  aggregations,
  onFilterChange,
}) => {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPackSizeOpen, setIsPackSizeOpen] = useState(true);
  const [isPurityOpen, setIsPurityOpen] = useState(true);
  const [isMaterialOpen, setIsMaterialOpen] = useState(true);
  const [values, setValues] = useState<number[]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedPurity, setSelectedPurity] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedPackSize, setSelectedPackSize] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string[]>([]);

  const togglePrice = () => setIsPriceOpen(!isPriceOpen);
  const toggleBrand = () => setIsBrandOpen(!isBrandOpen);
  const togglePackSize = () => setIsPackSizeOpen(!isPackSizeOpen);
  const togglePurity = () => setIsPurityOpen(!isPurityOpen);
  const toggleMaterial = () => setIsMaterialOpen(!isMaterialOpen);

  const handlePackSizeClick = (size: string) => {
    setSelectedPackSize((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handlePurityChange = (purity: string) => {
    setSelectedPurity((prev) =>
      prev.includes(purity)
        ? prev.filter((p) => p !== purity)
        : [...prev, purity]
    );
  };

  const handleCategoryIdChange = (category_id: string) => {
    setSelectedCategoryId((prev) =>
      prev.includes(category_id)
        ? prev.filter((c) => c !== category_id)
        : [...prev, category_id]
    );
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        brands: selectedBrands,
        materials: selectedMaterials,
        purity: selectedPurity,
        priceRange,
        category_id: selectedCategoryId,
        quantity_val: selectedPackSize,
      });
    }
  }, [
    selectedBrands,
    selectedMaterials,
    selectedPurity,
    selectedCategoryId,
    selectedPackSize,
  ]);

  const handleClearFilters = () => {
    setSelectedCategoryId([]);
    setSelectedPurity([]);
    setSelectedBrands([]);
    setSelectedMaterials([]);
    setSelectedPackSize([]);

    onFilterChange({
      brands: [],
      materials: [],
      purity: [],
      priceRange,
      category_id: [],
      quantity_val: [],
    });
  };

  return (
    <div className="fixed inset-x-0 top-[150px] bottom-0 rounded-2xl border border-gray-300 bg-white overflow-y-auto mx-3 md:mx-0 md:static md:top-0 md:max-h-full p-4 z-50 md:z-auto">
      {/* Categories Section */}
      <div className="mb-4 border-b border-gray-300 pb-4">
        <div className="w-full flex flex-row items-center justify-between border-b border-gray-300 pb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <div className="text-gray-400 cursor-pointer">
            <button
              onClick={handleClearFilters}
              className="px-3 w-full border-2 border-gray-300 text-gray-500 hover:border-indigo-500 hover:text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
            >
              Clear all
            </button>
          </div>
        </div>

        {aggregations?.category_id?.map((item) => (
          <div
            key={item.key}
            className="w-full flex items-center justify-between py-1"
          >
            <label className="flex justify-end text-sm">
              {`${item.name} (${item ? item.doc_count : ""})`}
            </label>
            <input
              type="checkbox"
              checked={selectedCategoryId.includes(item.key)}
              onChange={() => handleCategoryIdChange(item.key)}
              className="mr-2 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Price Range Section */}
      <div className="mb-4 border-b border-gray-300 pb-4 hidden">
        <div
          className="flex justify-between cursor-pointer"
          onClick={togglePrice}
        >
          <h3 className="font-medium">Price Range</h3>
          <div className="flex items-center">
            <span>{isPriceOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
          </div>
        </div>
        {isPriceOpen && (
          <div className="mt-4">
            <Range
              values={values}
              step={1}
              min={0}
              max={1000}
              onChange={(values) => setValues(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    backgroundColor: "#ddd",
                    borderRadius: "3px",
                    margin: "10px 0",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: `${(values[0] / 1000) * 100}%`,
                      right: `${100 - (values[1] / 1000) * 100}%`,
                      height: "6px",
                      backgroundColor: "black",
                      borderRadius: "3px",
                    }}
                  />
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "14px",
                    width: "14px",
                    backgroundColor: "#000",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
              )}
            />
            <div className="flex justify-between mt-2">
              <span> ${values[0]}</span>
              <span> ${values[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Brand List Section */}
      {aggregations?.product_brand && (
        <div className="mb-4 border-b border-gray-300 pb-4">
          <div
            className="flex justify-between cursor-pointer"
            onClick={toggleBrand}
          >
            <h3 className="font-medium">Brand</h3>
            <span>{isBrandOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
          </div>
          {isBrandOpen && (
            <div
              className="mt-2 overflow-y-auto scrollbar-custom"
              style={{ maxHeight: "150px" }}
            >
              {aggregations.product_brand.map((brand) => (
                <div
                  key={brand.key}
                  className="w-full flex items-center justify-between py-1"
                >
                  <label className="flex justify-end text-sm">
                    {`${brand.name} (${brand ? brand.doc_count : ""})`}
                  </label>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.key)}
                    onChange={() => handleBrandChange(brand.key)}
                    className="mr-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pack Size Section */}
      {aggregations?.quantity_val && (
        <div className="mb-4 border-b border-gray-300 pb-4">
          <div
            className="flex justify-between cursor-pointer"
            onClick={togglePackSize}
          >
            <h3 className="font-medium">Pack Size</h3>
            <span>{isPackSizeOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
          </div>
          {isPackSizeOpen && (
            <div
              className="mt-2 overflow-y-auto scrollbar-custom"
              style={{ maxHeight: "150px" }}
            >
              {aggregations.quantity_val.map((size) => (
                <div
                  key={size.key}
                  className="w-full flex items-center justify-between py-1"
                >
                  <label className="text-sm">{`${size.name} (${
                    size ? size.doc_count : ""
                  })`}</label>
                  <input
                    type="checkbox"
                    checked={selectedPackSize.includes(size.key)}
                    onChange={() => handlePackSizeClick(size.key)}
                    className="mr-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Purity Section */}
      {aggregations?.purity && (
        <div className="mb-4 border-b border-gray-300 pb-4">
          <div
            className="flex justify-between cursor-pointer"
            onClick={togglePurity}
          >
            <h3 className="font-medium">Purity</h3>
            <span>{isPurityOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
          </div>
          {isPurityOpen && (
            <div
              className="mt-2 overflow-y-auto scrollbar-custom"
              style={{ maxHeight: "150px" }}
            >
              {aggregations.purity.map((purity) => (
                <div
                  key={purity.key}
                  className="w-full flex items-center justify-between py-1"
                >
                  <label className="text-sm">{`${purity.name} (${
                    purity ? purity.doc_count : ""
                  })`}</label>
                  <input
                    type="checkbox"
                    checked={selectedPurity.includes(purity.key)}
                    onChange={() => handlePurityChange(purity.key)}
                    className="mr-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Material Section */}
      {aggregations?.material && (
        <div className="mb-4 border-b border-gray-300 pb-4">
          <div
            className="flex justify-between cursor-pointer"
            onClick={toggleMaterial}
          >
            <h3 className="font-medium">Material</h3>
            <span>{isMaterialOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
          </div>
          {isMaterialOpen && (
            <div
              className="mt-2 overflow-y-auto scrollbar-custom"
              style={{ maxHeight: "150px" }}
            >
              {aggregations.material.map((material) => (
                <div
                  key={material.key}
                  className="w-full flex items-center justify-between py-1"
                >
                  <label className="text-sm">{`${material.name} (${
                    material ? material.doc_count : ""
                  })`}</label>
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material.key)}
                    onChange={() => handleMaterialChange(material.key)}
                    className="mr-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* <button
        onClick={() => onFilterChange({
          brands: selectedBrands,
          materials: selectedMaterials,
          purity: selectedPurity,
          priceRange: values,
          category_id: selectedCategoryId,
          quantity_val: selectedPackSize,
        })}
        className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
      >
        Apply Filters
      </button> */}
    </div>
  );
};

export default ProductFilter;
