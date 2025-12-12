import React from "react";

interface Attribute {
  trait_type: string;
  value: string;
}

interface AssetAttributesProps {
  attributes: Attribute[];
}

const AssetAttributes: React.FC<AssetAttributesProps> = ({ attributes }) => {
  if (!attributes || attributes.length === 0)
    return <p>No attributes found.</p>;

  return (
    <div className="space-y-4 p-4 bg-muted-100 dark:bg-muted-800 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-muted-900 dark:text-white">
        Attributes
      </h2>
      <ul className="space-y-2">
        {attributes.map((attr, index) => (
          <li
            key={index}
            className="flex justify-between text-sm text-muted-700 dark:text-muted-300"
          >
            <span>{attr.trait_type}</span>
            <span className="font-semibold">{attr.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetAttributes;
