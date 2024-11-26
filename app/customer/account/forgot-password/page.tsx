"use client";
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import api from '@/services/api';
const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');


const emailTemplate = "email_reset";
  // Simple regex for basic email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
const passwordResetLink = async () => {
  try {
    const response = await api.put('/customers/password',{
        "email": email,
        "template": emailTemplate,
        "websiteId": 1
    });
    
  } catch (error) {
    console.log('failed to update email')
  }
}
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    passwordResetLink().then(
      () =>{toast.success('Password reset link has been sent to your email!')},
     () => {toast.error('error sending reset link')}
    );
    
  };

  
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Forgot Your Password?</h1>
      <p className="text-gray-600 mb-6">
        Please enter your email address below to receive a password reset link.
      </p>
      <form onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset My Password
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
