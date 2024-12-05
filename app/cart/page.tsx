"use client";
import { useEffect, useState } from 'react';
import Breadcrumbs from "@/components/breadcrumbs/Breadcrumbs";
import Testimonial from '@/components/testimonial/Testimonial';
import api from '@/services/api/index'; 
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setCount } from "@/redux/store/slices/cartItemCountSlice";
import { imageUrl } from '@/services/common';

interface CartItemType {
  id: string;
  itemId: string;
  name: string;
  price: number;
  allTax: string;
  offerPrice: string;
  quantity: number;
  imageUrl: string;
  quoteId: string; 
}

const Cart = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartTotals, setCartTotals] = useState({
    grand_total: 0,
    subtotal: 0,
    discount_amount: 0,
    shipping_amount: 0,
    tax_amount: 0,
    items_qty: 0,
  });
  
  const dispatch = useDispatch();
  
  const headers = {
    Authorization: `Bearer ${tokenApi}`,
  };
  useEffect(() => {
    const fetchCartItems = async () => {
      
      try {
       
        // Make the API call with Axios
        const response = await api.get('/carts/mine/totals', { headers });
        
        // Destructure the required totals from the API response
        const { grand_total, subtotal, discount_amount, shipping_amount, tax_amount, items_qty } = response.data;
        dispatch(setCount(items_qty));
        
        // Map cart items
        const fetchedItems = response.data.items.map((item: any) => ({
          id: item.item_id,
          itemId: item.sku,
          name: item.name,
          price: item.price,
          allTax: '(Incl. of all taxes)',
          offerPrice: item.discount_percent ? `${item.discount_percent}% off` : '',
          quantity: item.qty,
          imageUrl: item.image_url || `${imageUrl}catalog/product/L/i/Liquid-Handling_Research-Plus-100-1000ul_product.jpg`,
          quoteId: item.quote_id ,
          
        }));

        setCartItems(fetchedItems);
        setCartTotals({ grand_total, subtotal, discount_amount, shipping_amount, tax_amount, items_qty });
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [tokenApi]);

  // Function to make an API call to update quantity
  const updateCartItemQuantity = async (item_Id: string, quantity: number, quoteId: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${tokenApi}`,
      };

      // Make PUT request to update the cart item quantity
      const response = await api.put(`/carts/mine/items/${item_Id}`, {
        cartItem: {
          item_id: item_Id,
          qty: quantity,
          quote_id: quoteId, 
        },
      }, { headers });

    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  // Handler to increase the quantity of an item
  const handleAddQuantity = (item_Id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === item_Id) {
          const newQuantity = item.quantity + 1;
          updateCartItemQuantity(item_Id, newQuantity, item.quoteId); 
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Handler to decrease the quantity of an item
  const handleRemoveQuantity = (item_Id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === item_Id && item.quantity > 1) {
          const newQuantity = item.quantity - 1;
          updateCartItemQuantity(item_Id, newQuantity, item.quoteId);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Handler to remove an item from the cart
  const handleRemoveItem = async (itemId: string) => {
    try {
      const headers = {
        Authorization: `Bearer ${tokenApi}`,
      };

      // Make DELETE request to remove the cart item
      await api.delete(`/carts/mine/items/${itemId}`, { headers });

      // Update local state after successful removal
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Breadcrumbs />
      <div className="w-11/12 mx-auto">
        <h1 className="text-4xl font-bold mb-6 pt-4">Your cart</h1>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div
            className={`w-full md:w-3/5 min-h-96 mx-auto px-4 border border-gray-300 rounded-xl ${cartItems.length === 0 ? 'flex flex-col items-center justify-center' : ''}`}
          >
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  itemId={item.id}
                  name={item.name}
                  price={item.price}
                  allTax={item.allTax}
                  offerPrice={item.offerPrice}
                  quantity={item.quantity}
                  imageUrl={item.imageUrl}
                  onAddQuantity={() => handleAddQuantity(item.id)}
                  onRemoveQuantity={() => handleRemoveQuantity(item.id)}
                  onRemoveItem={() => handleRemoveItem(item.id)}
                />
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          <div className="w-full md:w-2/5">
            <CartSummary 
              grandtotal={cartTotals.grand_total}
              subtotal={cartTotals.subtotal}
              discountAmount={cartTotals.discount_amount}
              shippingAmount={cartTotals.shipping_amount}
              taxAmount={cartTotals.tax_amount}
              itemsQty={cartTotals.items_qty}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-center pb-8 w-full bg-gray-100 mt-6">
        <div className="text-center w-11/12">
          <Testimonial />
        </div>
      </div>
    </div>
  );
};

export default Cart;
