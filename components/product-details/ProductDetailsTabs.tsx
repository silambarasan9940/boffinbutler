import { useEffect, useState } from "react";

import ProductDetailsTable from "./ProductDetailsTable";

import {
  CustomAttribute,
  ExtensionAttributes,
  Product,
} from "@/services/types";

import api from "@/services/api";

import { useSelector } from "react-redux";

import { RootState } from "@/redux/store/store";

import RequestQuote from "./RequestQuote";

interface ProductDetailsTableProps {
  product: Product;

  attributes: CustomAttribute[];
}

const ProductDetailsTabs = ({
  attributes,

  product,
}: ProductDetailsTableProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "Links">(
    "details"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabClick = (tab: "details" | "reviews" | "Links") => {
    setActiveTab(tab);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

    // setIsSubmitted(false);

    // setRequestedQty("");

    // setQuoteMessage("");
  };

  return (
    <div className="w-11/12 mx-auto">
      {/* Tab Navigation */}

      <div className="relative flex items-center justify-between border-b border-gray-300 mb-4">
        <div className="flex">
          <button
            className={`relative py-2 px-10 text-gray-600 transition ${
              activeTab === "details" ? "text-indigo-500" : ""
            }`}
            onClick={() => handleTabClick("details")}
          >
            Product Details
            {activeTab === "details" && (
              <span className="absolute left-0 -bottom-[5px] md:-bottom-[7px] w-full h-1 bg-indigo-500 transition-all" />
            )}
          </button>

          <button
            className={`relative py-2 px-10 text-gray-600 transition ${
              activeTab === "reviews" ? "text-indigo-500" : ""
            }`}
            onClick={() => handleTabClick("reviews")}
          >
            Rating & Reviews
            {activeTab === "reviews" && (
              <span className="absolute left-0 -bottom-[5px] md:-bottom-[7px] w-full h-1 bg-indigo-500 transition-all" />
            )}
          </button>

          <button
            className={`relative py-2 px-10 text-gray-600 transition ${
              activeTab === "Links" ? "text-indigo-500" : ""
            }`}
            onClick={() => handleTabClick("Links")}
          >
            Links
            {activeTab === "Links" && (
              <span className="absolute left-0 -bottom-[5px] md:-bottom-[7px] w-full h-1 bg-indigo-500 transition-all" />
            )}
          </button>
        </div>

        {/* Request a Quote Button */}

        <div className="hidden sm:mb-3 sm:block">
          <button
            onClick={toggleModal}
            className="bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-600 transition"
          >
            Request a Quote
          </button>
        </div>
      </div>

      {/* Tab Content */}

      <div className="sm:p-6 bg-white flex flex-col">
        {activeTab === "details" ? (
          <div className="w-full md:w-9/12 mx-auto">
            <div className="flex items-center justify-between sm:hidden">
              <h2 className="text-xl font-semibold mb-4">Product Details</h2>

              <div className="flex justify-end">
                <button
                  onClick={toggleModal}
                  className="bg-indigo-500 texy-sm text-white py-2 px-4 rounded-full hover:bg-indigo-600 transition"
                >
                  Request a Quote
                </button>
              </div>
            </div>

            <h2 className="hidden sm:block sm:text-xl sm:font-semibold sm:mb-6">
              Product Details
            </h2>

            <p className="pt-4 md:pt-0">
              Here you can display product specifications, descriptions,
              features, and any other details related to the product.
            </p>

            <ProductDetailsTable attributes={attributes} />
          </div>
        ) : activeTab === "reviews" ? (
          <div className="w-full md:w-9/12 mx-auto">
            <div className="flex items-center justify-between sm:hidden">
              <h2 className="text-xl font-semibold mb-4">Rating & Reviews</h2>

              <div className="flex justify-end">
                <button
                  onClick={toggleModal}
                  className="bg-indigo-500 texy-sm text-white py-2 px-4 rounded-full hover:bg-indigo-600 transition"
                >
                  Request a Quote
                </button>
              </div>
            </div>

            <h2 className="hidden sm:block sm:text-xl sm:font-semibold sm:mb-6">
              Rating & Reviews
            </h2>

            <p className="pt-4 md:pt-0">
              This section can include user ratings, reviews, and feedback about
              the product.
            </p>
          </div>
        ) : activeTab === "Links" ? (
          <div className="w-full md:w-9/12 mx-auto">
            <div className="flex items-center justify-between sm:hidden">
              <h2 className="text-xl font-semibold mb-4">Links</h2>

              <div className="flex justify-end">
                <button
                  onClick={toggleModal}
                  className="bg-indigo-500 texy-sm text-white py-2 px-4 rounded-full hover:bg-indigo-600 transition"
                >
                  Request a Quote
                </button>
              </div>
            </div>

            <h2 className="hidden sm:block sm:text-xl sm:font-semibold sm:mb-6">
              Links
            </h2>

            <p className="pt-4 md:pt-0">
              This section can include useful links or additional resources
              related to the product.
            </p>
          </div>
        ) : null}
      </div>

      {isModalOpen && (
        <RequestQuote
          id={product.id}
          name={product.name}
          qty_val={
            attributes.find(
              (attribute) => attribute.attribute_code === "quantity_val"
            )?.value
          }
          brand={
            attributes.find((attribute) => attribute.attribute_code === "brand")
              ?.value
          }
          price={product.price}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
};

export default ProductDetailsTabs;
