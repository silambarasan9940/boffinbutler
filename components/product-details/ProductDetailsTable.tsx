import React from "react";
import { CustomAttribute } from "@/services/types";

interface ProductDetailsTableProps {
  attributes: CustomAttribute[];
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  attributes
}) => {
  return (
    <div className="overflow-x-auto mt-4">
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <tbody>
            {(() => {
              let visibleRowIndex = 0; 
              return (
                <>
                  {attributes.find(
                    (attribute) => attribute.attribute_code === "productcode"
                  ) && (
                    <tr
                      className={
                        visibleRowIndex++ % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }
                    >
                      <td className="py-2 px-4 border-b border-r border-gray-300 font-semibold text-left w-1/2">
                        Product Code
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 text-left w-1/2">
                        {
                          attributes.find(
                            (attribute) =>
                              attribute.attribute_code === "productcode"
                          )?.value
                        }
                      </td>
                    </tr>
                  )}
                  {attributes.find(
                    (attribute) => attribute.attribute_code === "hsn_code"
                  ) && (
                    <tr
                      className={
                        visibleRowIndex++ % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }
                    >
                      <td className="py-2 px-4 border-b border-r border-gray-300 font-semibold text-left w-1/2">
                        HSN Code
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 text-left w-1/2">
                        {
                          attributes.find(
                            (attribute) =>
                              attribute.attribute_code === "hsn_code"
                          )?.value
                        }
                      </td>
                    </tr>
                  )}
                  {attributes.find(
                    (attribute) => attribute.attribute_code === "brand"
                  ) && (
                    <tr
                      className={
                        visibleRowIndex++ % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }
                    >
                      <td className="py-2 px-4 border-b border-r border-gray-300 font-semibold text-left w-1/2">
                        Brand
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 text-left w-1/2">
                        {
                          attributes.find(
                            (attribute) => attribute.attribute_code === "brand"
                          )?.value
                        }
                      </td>
                    </tr>
                  )}
                  {attributes.find(
                    (attribute) => attribute.attribute_code === "deliverytime"
                  ) && (
                    <tr
                      className={
                        visibleRowIndex++ % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }
                    >
                      <td className="py-2 px-4 border-b border-r border-gray-300 font-semibold text-left w-1/2">
                        Usually Dispatched In
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 text-left w-1/2">
                        {
                          attributes.find(
                            (attribute) =>
                              attribute.attribute_code === "deliverytime"
                          )?.value
                        }
                      </td>
                    </tr>
                  )}
                  {attributes.find(
                    (attribute) => attribute.attribute_code === "packsize"
                  ) && (
                    <tr
                      className={
                        visibleRowIndex++ % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }
                    >
                      <td className="py-2 px-4 border-b border-r border-gray-300 font-semibold text-left w-1/2">
                        Pack Size
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 text-left w-1/2">
                        {
                          attributes.find(
                            (attribute) =>
                              attribute.attribute_code === "packsize"
                          )?.value
                        }
                      </td>
                    </tr>
                  )}
                </>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetailsTable;
