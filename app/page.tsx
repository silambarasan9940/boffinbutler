import React from "react";
import { ToastContainer } from 'react-toastify';
import Home from '@/app/home/page';

export default function App() {
  return <main className="w-full min-h-screen flex flex-col">
    <Home />
    <ToastContainer autoClose={5000} />
  </main>;
}
