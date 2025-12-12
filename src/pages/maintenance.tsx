import React from "react";

const Maintenance = () => {
  return (
    <div className="bg-gray-100">
      <div className="min-h-screen flex flex-col justify-center items-center">
        <img
          src="/img/home/cogs-settings.svg"
          alt="Logo"
          className="mb-8 h-40"
        />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-700 mb-4">
          Site is under maintenance
        </h1>
        <p className="text-center text-gray-500 text-lg md:text-xl lg:text-2xl mb-8">
          We&apos;re working hard to improve the user experience. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
