import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from "@/services/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

interface CoinData {
  earned: number;
  redeemed: number;
  total: number;
  items: {
    orderId: string;
    type: 'Credit' | 'Debit';
    coins: number;
    status: string;
  }[];
}

const BBCoinsOrder = () => {
  const tokenApi = useSelector((state: RootState) => state.auth.token);
  const [coins, setCoins] = useState<CoinData | null>(null);

  const fetchCoinsData = async () => {
    const headers = {
      Authorization: `Bearer ${tokenApi}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await api.get('/bbcoins', {headers});
      setCoins(response.data);
      console.log(response.data, 'coins data');

    } catch (error) {
      console.log('Failed to response data coins', error);
    }
  }

  useEffect(() => {
    fetchCoinsData();
  },[]);

  return (
    <div className="p-4">
      
      <h1 className="text-2xl font-bold mb-4 text-center pb-4">BB Coins</h1>
    
      <div className="bg-indigo-500 shadow-md rounded-lg p-4 flex justify-between mb-6">
        <div className="text-center">
            <img src='https://boffinbutler.com/static/version1730242813/frontend/Hiddentechies/bizkick_child/en_US/images/payment_icon_w.png' 
            className="mx-auto" 
            style={{ width: '50px', height: '50px' }} />
          <p className="text-md text-white pt-3">Total Earned: <span>{coins?.earned ?? 0}</span></p>
        </div>
        <div className="text-center">
        <img src='https://boffinbutler.com/static/version1730242813/frontend/Hiddentechies/bizkick_child/en_US/images/present_icon_w.png' 
            className="mx-auto" 
            style={{ width: '50px', height: '50px' }} />
          <p className="text-md text-white pt-3">Redeemed : <span>{coins?.redeemed ?? 0}</span></p>
        </div>
        <div className="text-center">
        <img src='https://boffinbutler.com/static/version1730242813/frontend/Hiddentechies/bizkick_child/en_US/images/currency_icon_w.png' 
            className="mx-auto" 
            style={{ width: '50px', height: '50px' }} />
          <p className="text-md text-white pt-3">Total Balance : <span>{coins?.total ?? 0}</span></p>
          
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-b border-gray-300">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Credit/Debit</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Coins</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {coins && coins.items?.length > 0 ? (
              coins.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 text-sm text-gray-700">{item.orderId}</td>
                  <td className="p-3 text-sm text-gray-700">{item.type}</td>
                  <td className="p-3 text-sm text-gray-700">{item.coins}</td>
                  <td className="p-3 text-sm text-gray-700">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-sm text-gray-700" colSpan={4}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <button className="mt-6 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600">
        Redeem Now
      </button>

<div className='py-3'>No Orders Found. <Link href='/freebies' className='text-indigo-500'>Click here</Link> to order freebies.</div>
    </div>
  );
};

export default BBCoinsOrder;
