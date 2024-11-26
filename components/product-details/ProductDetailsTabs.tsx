import { useEffect, useState } from "react";
import ProductDetailsTable from "./ProductDetailsTable";
import { CustomAttribute, ExtensionAttributes, Product } from "@/services/types";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface ProductDetailsTableProps {
  product: Product;
  attributes: CustomAttribute[];
}

const ProductDetailsTabs = ({ attributes, product }: ProductDetailsTableProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestedQty, setRequestedQty] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState<string>("");
  
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const handleTabClick = (tab: "details" | "reviews") => {
    setActiveTab(tab);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsSubmitted(false); 
    setRequestedQty(""); 
    setQuoteMessage(""); 
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestedQty(e.target.value);
  };

  const handleSubmit = () => {
    setIsSubmitted(true); 
    fetchQuote();
  };

  const fetchQuote = async () => {
    try {
      const ckArray = [product.id];
      const response = await api.post('/quote/save', {
        "data": {
          "ck": ckArray,
          "qty":requestedQty
        }
      }, { headers });

      setQuoteMessage(response.data[0].message); 
      console.log("Quote Message: ", response.data[0].message);
    } catch (error) {
      setQuoteMessage("An error occurred while fetching the quote.");
      console.log('Failed to load fetchQuote response', error);
    }
  }


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
        ) : (
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
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-11/12 max-w-3xl mx-auto p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">Request a Quote</h2>

            {!isSubmitted ? (
              <>
                {/* Table of Products */}
                <table className="w-full mb-4 border border-gray-200 rounded-md">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2 border-b">Name</th>
                      <th className="p-2 border-b">Quantity</th>
                      <th className="p-2 border-b">Brand</th>
                      <th className="p-2 border-b">Price</th>
                      <th className="p-2 border-b">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b">{product.name}</td>
                      <td className="p-2 border-b">
                      {
                          attributes.find(
                            (attribute) =>
                              attribute.attribute_code === "quantity_val"
                          )?.value
                        }
                      </td>
                      <td className="p-2 border-b">
                      {
                          attributes.find(
                            (attribute) =>
                              attribute.attribute_code === "brand"
                          )?.value
                        }
                      </td>
                      <td className="p-2 border-b">₹ {product.price}</td>
                      <td className="p-2 border-b text-center">
                        <input type="checkbox" />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Requested Quantity and Submit Button */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-row items-center">
                  <label className="text-gray-700 font-semibold pe-2">
                    Requested Qty:
                  </label>
                  <input
                    type="number"
                    value={requestedQty}
                    onChange={handleQuantityChange}
                    className="border rounded-lg p-2 w-20 h-[34px] text-center"
                  />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
                <div className="mt-4 p-4">
                   <div dangerouslySetInnerHTML={{ __html: quoteMessage || ''}} />
                </div>
            )}

            {/* Close Modal Button */}
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsTabs;
