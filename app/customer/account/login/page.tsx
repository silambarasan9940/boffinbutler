"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import api from "@/services/api";
import { useDispatch } from "react-redux";
import { signIn } from "@/redux/store/slices/authSlice";

const CustomerLogin = () => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter(); 
  const referer = router.query.referer || '/';

  const toggleCustomerView = () => {
    setIsNewCustomer(!isNewCustomer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/integration/customer/token",
        {
          username: email,
          password: password,
        },
        // {
        //   withCredentials: true, 
        // }

      );
      const token = response.data;
      // dispatch redux authslice
      dispatch(signIn(token));
      
      // Navigate to the home page
      router.push(referer);
      setLoading(false);
    } catch (error) {
      setError("Invalid login credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-md mt-8 mb-8 shadow-lg">
      {isNewCustomer ? (
        <div>
          {/* New Customers Section */}
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-2">
            New Customers
          </h2>
          <p className="mt-4 mb-6">
            Creating an account has many benefits: check out faster, keep more
            than one address, track orders and more.
          </p>
          <Link href="/customer/account/create">
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg w-full hover:bg-indigo-500 transition">
              Sign Up
            </button>
          </Link>
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={toggleCustomerView}
            >
              Sign In
            </span>
          </p>
        </div>
      ) : (
        <div>
          {/* Registered Customers Section */}
          <h2 className="text-xl font-semibold border-b-2 border-gray-300 pb-2">
            Registered Customers
          </h2>
          <p className="mt-4 mb-6">
            If you have an account, sign in with your email address or phone
            number.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Email Address or Mobile Number
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="mb-6 flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-gray-700">
                Remember Me <strong>What's this?</strong>
              </label>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg w-full hover:bg-indigo-500 transition"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-sm text-right text-indigo-600 cursor-pointer">
            <Link href="/customer/account/forgot-password">
            Forgot Password?
            </Link>
           
          </p>

          <p className="mt-4 text-sm text-center">
            New here?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={toggleCustomerView}
            >
              Create an Account
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerLogin;
