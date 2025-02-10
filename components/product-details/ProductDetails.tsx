import React, { useState, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import ProductDetailsTabs from "./ProductDetailsTabs";
import { Product } from "@/services/types";
import api from "@/services/api/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import SimilarProducts from "../similarproducts/similarproducts";
import { imageUrl } from "@/services/common";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const defaultImageUrl = `${imageUrl}catalog/product`;
  const imageAttribute = product.custom_attributes.filter(
    (attr) => attr.attribute_code === "image"
  );

  const productImageUrl = imageAttribute.map(
    (imageAttr: any) => `${defaultImageUrl}${imageAttr.value}`
  );

  const [selectedImage, setSelectedImage] = useState(productImageUrl[0] || "");
  const [backgroundSize, setBackgroundSize] = useState("100%");
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [cartId, setCartId] = useState(localStorage.getItem("quote_id"));
  const [isQtyAvailable, setIsQtyAvailable] = useState(true);
  const [expiryCart, setExpiryCart] = useState(true);
  const router = useRouter();
  
  var expy = 1;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
    setBackgroundSize("200%");
  };

  const handleMouseLeave = () => {
    setBackgroundSize("100%");
    setBackgroundPosition("center");
  };

  const headers = {
    Authorization: `Bearer ${tokenApi}`,
    "Content-Type": "application/json",
  };

  const fetchCartID = async () => {
    try {
      const response = await api.post("/carts/mine/", {}, { headers });
      setCartId(response.data);
      const cartId = response.data;
      localStorage.setItem("quote_id", JSON.stringify(response.data));
    } catch (error) {
      console.log("Failed to fetch cart ID", error);
    }
  };

  useEffect(() => {
    if (tokenApi) {
      
      if (localStorage.getItem("quote_id")) {
        // do nothing
      } else {
        fetchCartID();
      }
    }
  }, []);

  const handleAddToCart = async () => {
    if (tokenApi) {
      if (localStorage.getItem("quote_id")) {
        console.log(
          "handleAddToCart Quote ID " + localStorage.getItem("quote_id")
        );

        // do nothing
      } else {
        fetchCartID();
      }

      const productDetails = {
        sku: product.sku,
        qty: quantity,
        quote_id: cartId,
      };

      // if(localStorage.getItem("quote_id")){
      // // do nothing
      // }else{
      // fetchCartID();

      // }

      try {
        const response = await api.post(
          "/carts/mine/items",
          { cartItem: productDetails },
          { headers }
        );
        // Assuming the API returns success confirmation
        if (response?.status === 200) {
          toast.success("Item added to cart successfully!");
          setInCart(true);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);
        const words = ["customer", "not", "active", "cart"];
        const containsAll = stringContainsAllWords(errorMessage, words);
        if (expy === 1 && containsAll) {
          expy = 0;
          // setExpiryCart(false)
          localStorage.removeItem("quote_id");
          fetchCartID();
          handleAddToCart();
        } else {
          // Fallback in case `error.response` is undefined
          // const errorMessage =
          //   error.response?.data?.message || "An unexpected error occurred";
          // toast.error(errorMessage);
        }

      }
    } else {
      // Redirect to login if user is not authenticated
      router.push("/customer/account/login");
    }
  };

  // Increase the product quantity and update the cart

  const handleIncrease = () => {
    if (quantity === product.extension_attributes.custom_stock_item.qty) {
      setIsQtyAvailable(false);
    } else {
      const newQuantity = quantity + 1;

      setQuantity(newQuantity);
    }

    // dispatch(increment());
  };

  // Decrease the product quantity and update the cart

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setIsQtyAvailable(true);
      // dispatch(decrement());
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  function stringContainsAllWords(str: string, words: any) {
    return words.every((word:any) => str.includes(word));
  }

  return (
    <div className="w-11/12 mx-auto flex flex-col gap-8 p-4">
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex flex-col md:flex-row w-full md:w-1/2 me-3">
          <div className="flex md:flex-col order-2 md:order-1 gap-4 mb-4 md:mb-0 me-3">
            {productImageUrl.map((productImageUrl, index) => (
              <div key={index} className="cursor-pointer border-2 rounded-lg">
                <Image
                  src={productImageUrl}
                  alt={`Thumbnail ${index}`}
                  width={100}
                  height={100}
                  className={`w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg ${
                    selectedImage === productImageUrl
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(productImageUrl)}
                />
              </div>
            ))}
          </div>

          <div
            className="flex-1 flex order-1 md:order-2 justify-center items-center relative overflow-hidden w-full max-w-lg border rounded-lg mb-4 md:mb-0 md:w-2/3"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="absolute inset-0 bg-center bg-cover transition-transform duration-300"
              style={{
                backgroundImage: `url(${selectedImage})`,

                backgroundSize: backgroundSize,

                backgroundPosition: backgroundPosition,
              }}
            />

            <Image
              src={selectedImage}
              alt="Selected product"
              width={600}
              height={600}
              className="w-full h-auto object-contain rounded-lg pointer-events-none opacity-0"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start items-start space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="flex items-center space-x-4">
            {Number(product.extension_attributes.discount_percent) > 0 && (
              <>
                <span className="text-sm text-gray-400 font-semibold">
                  <s>₹{product.price}</s>
                </span>

                <span className="bg-green-100 text-green-500 rounded-full px-3 py-1 font-sm">
                  {product.extension_attributes.discount_percent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
          {product && Number(product.price) > 0 ?
              (<>
              <p className="text-3xl text-gray-700 font-semibold">
              ₹{product.extension_attributes.custom_final_price}
             
            </p>

            <div className="flex">
              <div className="text-sm text-gray-400 font-semibold">
                + ₹{product.extension_attributes.gst_final_price}
              </div>

              <span className="text-gray-400 text-sm ps-1">GST</span>
            </div> 
            </>): null}
          </div>

          <p className="text-xl text-gray-800 font-semibold">
            ₹
            {parseFloat(
              String(
                product.custom_attributes.find(
                  (attr) => attr.attribute_code === "special_price"
                )?.value || "0"
              )
            ).toFixed(2)}{" "}
            <span>(Incl. of all taxes)</span>
          </p>

          {product.extension_attributes.custom_stock_item.is_in_stock ? (
            <div className="w-full flex items-center border-t border-b border-gray-300 py-4">
              <div className="w-[100px] md:w-[150px] flex items-center justify-between space-x-4 bg-gray-300 rounded-full px-3 py-2 me-4">
                <button
                  onClick={handleDecrease}
                  className="text-gray-600 hover:text-gray-800"
                >
                  -
                </button>

                <span className="text-sm font-semibold">{quantity}</span>

                <button
                  onClick={handleIncrease}
                  className={`${
                    !isQtyAvailable
                      ? "cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  disabled={!isQtyAvailable}
                >
                  +
                </button>
              </div>

              <button
                onClick={inCart ? handleGoToCart : handleAddToCart}
                className={`w-full ${
                  inCart
                    ? "bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600"
                    : "bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600"
                }`}
              >
                {inCart ? "Go to Cart" : "Add to Cart"}
              </button>
            </div>
          ) : (
            <div className="text-center mx-auto">
              <p className="bg-red-600 text-white py-2 px-4 rounded-md">
                Out of Stock
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <ProductDetailsTabs
          attributes={product.custom_attributes}
          product={product}
        />
      </div>

      <div>
        <SimilarProducts
          sku={product.sku}
          productcode={
            product.custom_attributes.find(
              (attr) => attr.attribute_code === "productcode"
            )?.value
          }
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
