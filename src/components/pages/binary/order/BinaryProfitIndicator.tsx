import React from "react";

interface BinaryProfitIndicatorProps {
  profit: number;
}

const BinaryProfitIndicator: React.FC<BinaryProfitIndicatorProps> = ({
  profit,
}) => {
  return (
    <div className="text-lg font-bold text-center text-success-500">
      <span className="text-4xl">{profit}</span>%
    </div>
  );
};

export default BinaryProfitIndicator;
