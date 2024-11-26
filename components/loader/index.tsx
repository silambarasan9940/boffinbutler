import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

const Loader = () => {
  
  return (
     <div className="flex justify-center items-center h-screen">
        <CirclesWithBar
          height="100"
          width="100"
          color="#625df5"
          outerCircleColor="#625df5"
          innerCircleColor="#625df5"
          barColor="#625df5"
          ariaLabel="circles-with-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    
  );
};

export default Loader;
