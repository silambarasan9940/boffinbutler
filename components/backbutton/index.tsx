import React from "react";
import { HiArrowSmLeft } from "react-icons/hi";

const BackButton = () => {
  const handleClick = () => {
    // Navigate to the previous page using window.history
    window.history.back();
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-gray-200 text-block rounded-lg hover:bg-indigo-600 hover:text-white transition flex items-center"
    >
     <HiArrowSmLeft /> <span className="ps-2">Back</span>
    </button>
  );
};

export default BackButton;
