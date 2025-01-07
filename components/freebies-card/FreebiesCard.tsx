'use client';
import api from '@/services/api';
import Image from 'next/image';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '@/redux/store/store';
import { useSelector, UseSelector } from 'react-redux';
// Define the FreebiesCard props type
type FreebiesCardProps = {
  catalog_id: string;
  image_url: string;
  name: string;
  coins: number;
  description: string;
  isShortDescription?: boolean;
};

// Modal component definition
const Modal: React.FC<{
  onClose: () => void;
  catalog_id: string;
  name: string;
  coins: number;
  description: string;
  image_url: string;
  loading: boolean;
}> = ({
  onClose,
  catalog_id,
  name,
  coins,
  description = "No description available",
  image_url,
  loading,
  
}) => {
  const token = useSelector((state:RootState) => state.auth.token);
  // Modal Handle redeem button click
  const handleRedeem = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await api.post('/redeem', {
        product_id: 4, 
      }, {headers}
    ); 

      console.log(`${coins} coins redeemed successfully`, response.data);

      // Show success message using toast
      toast.success('Product redeemed successfully!');
    } catch (error) {
      console.error('Error redeeming product:', error);

    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 top-[90px]">
      <div className="bg-white rounded-lg max-w-3xl mx-4 p-6 relative overflow-y-auto h-[400px] md:max-h-[500px] w-11/12">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800 transition-colors"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-500">{name}</h2>

        {/* Display Image */}
        <div className="flex justify-center mb-4">
          <Image
            src={image_url}
            alt={name}
            width={400}
            height={300}
            className="w-auto h-auto object-cover rounded-lg"
          />
        </div>

        {/* Description */}
        <div className="h-48 overflow-y-auto mb-6">
          <p className="text-gray-700 text-justify">{description}</p>
        </div>

        {/* Redeem Button */}
        <div className='mx-auto text-center'>
          <button
            className="mt-4 px-8 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-300 disabled:opacity-50"
            onClick={handleRedeem}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Redeem'}
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

// FreebiesCard component definition
const FreebiesCard: React.FC<FreebiesCardProps> = ({
  catalog_id,
  image_url,
  name,
  coins,
  description,
  // token,
}) => {
  const token = useSelector((state:RootState) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Handle redeem button click
  const handleRedeemCoins = async () => {
    setLoading(true);

    try {
     // If no token exists, redirect the user to the login page
      if (!token) {
        setLoading(false);
        toast.error('You need to log in to redeem items.');
        setTimeout(() => {
          router.push('/customer/account/login');
        }, 2000);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Make the API call to check user's available coins
      const response = await api.get('/checkpoints', { headers });
      const userCoins = response.data.coins;

      console.log(`${coins} coins redeem`);

      // If user has enough coins, show success and open the modal
      if (userCoins >= coins) {
        setLoading(false);
        setIsModalOpen(true);
        toast.success('You have enough coins to redeem this item!');
      } else {
        // If user does not have enough coins, show error message
        setLoading(false);
        // toast.error('You don’t have enough coins to redeem this item!');
      }
    } catch (error) {
      console.error('Error checking coins:', error);
      setLoading(false);
      // toast.error('Failed to check your coins. Please try again later.');
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle card click to open modal
  const handleModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="max-w-xs bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col justify-center items-center pb-4 cursor-pointer"
      >
        <div className="flex flex-col justify-center items-center p-4 w-full">
          <Image
            src={image_url}
            alt={name}
            width={200}
            height={250}
            className="w-full h-auto object-cover pb-4"
            onClick={handleModal}
          />
          <h3 className="text-lg font-semibold hover:text-indigo-500"
           onClick={handleModal}
          >{name}</h3>
          <p className="text-sm text-gray-500">{coins} Coins</p>
        </div>
        <button
          className="mt-4 px-8 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-300 disabled:opacity-50"
          onClick={handleRedeemCoins}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Redeem'}
        </button>
      </div>
      
      {/* Modal rendered conditionally */}
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          catalog_id={catalog_id}
          name={name}
          coins={coins}
          description={description}
          image_url={image_url}
          loading={loading}
          // token={token} 
        />
      )}
    </>
  );
};

export default FreebiesCard;
