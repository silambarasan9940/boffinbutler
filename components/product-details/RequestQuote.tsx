import { useEffect, useState } from "react";
import { CustomAttribute, ExtensionAttributes, Product } from "@/services/types";
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

 interface RequestQuoteProps {
    id:any;
    name:any;
    price:any;
    qty_val:any;
    brand: any;
    toggleModal: () => void;
 }

const RequestQuote = ({id,name,price,qty_val,brand,toggleModal}: RequestQuoteProps) => {

    const tokenApi = useSelector((state: RootState) => state.auth.token);
    
  const [requestedQty, setRequestedQty] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState<string>("");
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
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
      const ckArray = [id];
      const response = await api.post('/quote/save', {
        "data": {
          "ck": ckArray,
          "qty":requestedQty
        }
      }, { headers });

      setQuoteMessage(response.data[0].message); 
     
    } catch (error) {
      setQuoteMessage("An error occurred while fetching the quote.");
      
    }
  }

  return (
    <div>
      {/* Modal */}
      { (
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
                      <td className="p-2 border-b">{name}</td>
                      <td className="p-2 border-b">
                      {
                          qty_val
                        }
                      </td>
                      <td className="p-2 border-b">
                      {
                         brand
                        }
                      </td>
                      <td className="p-2 border-b">₹ {price}</td>
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
  )
}

export default RequestQuote
