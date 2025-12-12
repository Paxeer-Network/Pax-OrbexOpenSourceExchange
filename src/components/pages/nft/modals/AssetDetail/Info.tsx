import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import { useNftStore } from "@/stores/nft";
import { Icon } from "@iconify/react";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { toast } from "sonner";

interface AssetInfoProps {
  asset: any;
  collection: any;
}

const AssetInfo: React.FC<AssetInfoProps> = ({ asset, collection }) => {
  const { likeAsset, unlikeAsset, checkLikeStatus, openPurchaseModal } =
    useNftStore();
  const [isLiked, setIsLiked] = useState(asset?.isLiked ?? null);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const liked = await checkLikeStatus(asset.id);
      setIsLiked(liked);
    };

    if (asset?.id) {
      setIsLiked(asset.isLiked ?? null);
      if (asset.isLiked === undefined) {
        fetchLikeStatus();
      }
    }
  }, [asset.id, asset.isLiked, checkLikeStatus]);

  const handleLikeToggle = async () => {
    if (isLiked) {
      await unlikeAsset(asset.id);
      setIsLiked(false);
    } else {
      await likeAsset(asset.id);
      setIsLiked(true);
    }
  };

  const handleShare = () => {
    const assetUrl = `${window.location.origin}/nft/collection/${collection.id}`;
    navigator.clipboard.writeText(assetUrl).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col justify-center gap-10 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-muted-900 dark:text-white">
          {asset.name} #{asset.index}
        </h1>
        <div className="flex items-center gap-2">
          <IconButton onClick={handleLikeToggle} color="contrast">
            <Icon
              icon={isLiked ? "mdi:heart" : "mdi:heart-outline"}
              className={isLiked ? "text-red-500" : ""}
            />
          </IconButton>
          <IconButton onClick={handleShare} color="contrast">
            <Icon icon="mdi:share-variant" />
          </IconButton>
        </div>
      </div>

      <div className="rounded-lg bg-muted-100 dark:bg-muted-800 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-muted-800 dark:text-muted-300">
            Price
          </h2>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {asset.price} {asset.currency}
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => openPurchaseModal(asset)}
            className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600"
          >
            Buy now
          </button>
          <button className="flex-1 px-4 py-3 bg-muted-200 dark:bg-muted-700 dark:text-white text-black rounded-lg shadow-md hover:bg-muted-300 dark:hover:bg-muted-600">
            Make offer
          </button>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <UserInfo label="Owned By" user={asset.owner} />
        <UserInfo label="Created By" user={collection.creator} />
      </div>
    </div>
  );
};

export default AssetInfo;
