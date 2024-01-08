import React from 'react';

// A custom component for the concentric circles
const Circles = ({ size }) => {
  // The width and height of the outer circle
  const outerSize = size;
  // The width and height of the inner circle
  const innerSize = size / 2;
  // The margin of the inner circle
  const margin = (outerSize - innerSize) / 2;

  return (
    <div
      style={{ width: `${outerSize}px`, height: `${outerSize}px` }}
      className="rounded-full border-4 border-white"
    >
      <div
        style={{
          width: `${innerSize}px`,
          height: `${innerSize}px`,
          margin: `${margin}px`,
        }}
        className="animate-bounce rounded-full border-4 border-white"
      ></div>
    </div>
  );
};

// The main component for the loading page
const LoadingPage = () => {
  // The message to be displayed below the circles
  const message = 'Waiting for the server to respond';

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-900">
      {/* The circles component with a size of 100px */}
      <Circles size={100} />
      {/* The message component with a margin-top of 10px */}
      <p className="mt-10 text-2xl font-bold text-white">{message}</p>
    </div>
  );
};

export default LoadingPage;
