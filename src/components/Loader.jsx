import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-8 border-t-8 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
