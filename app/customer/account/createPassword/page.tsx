"use client";
import React, { Suspense, useState } from 'react';
import api from '@/services/api';
import { useSearchParams, useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const SetNewPassword = () => {
    const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const r_token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const passwordReset = async () => {
   try {
    const response = await api.post('/customers/reset/password',
        {
            "customerId": id,
            "resetToken": r_token,
            "newPassword": newPassword
        }
     );
   } catch (error) {
    console.log('failed to create reset password');
   }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
        passwordReset().then(
            async () => {
                toast.success('Password reset successfully');
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push('/customer/account/login');
            },
            async () => {
                toast.error('Password reset Failed');
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push('/customer/account/login');
            }
        );
    } else {
        console.error('Passwords do not match.');
    }
    
    
  };

  return (
    
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Set a New Password</h1>
      <form onSubmit={handleSubmit}>
        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            New Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* Confirm New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* Show Password */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={toggleShowPassword}
            className="mr-2"
          />
          <label htmlFor="showPassword" className="text-sm">
            Show Password
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Set a New Password
        </button>
      </form>
      <ToastContainer />
    </div>
    
  );
};


//export default SetNewPassword;

export default function Page() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SetNewPassword />
      </Suspense>
    );
  }