import React from "react";
import Link from "next/link";

interface AssetGridCardProps {
  asset: any;
}

const AssetGridCard: React.FC<AssetGridCardProps> = ({ asset }) => (
  <Link
    href={`/nft/asset/${asset.id}`}
    className="block bg-muted-100 dark:bg-black rounded-xl overflow-hidden transition group border border-muted-200 dark:border-muted-900 hover:border-purple-500"
  >
    <div className="relative w-full h-[18rem] overflow-hidden">
      <img
        src={asset.image}
        alt={asset.name}
        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <div className="relative p-4 group-hover:shadow-lg transition bg-muted-200 dark:bg-muted-800">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-muted-900 dark:text-white">
            {asset.name}
          </h3>
          <p className="text-sm text-muted-600 dark:text-muted-400">
            Rank: <span className="font-medium">{asset.rank}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-600 dark:text-muted-400">
            #{asset.index}
          </p>
          <span className="text-lg font-bold text-muted-900 dark:text-white">
            {asset.price ? `${asset.price} ETH` : "N/A"}
          </span>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 w-full h-full p-3 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform">
        <button className="w-full h-full px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md transition hover:bg-purple-600">
          Buy now
        </button>
      </div>
    </div>
  </Link>
);

export default AssetGridCard;
