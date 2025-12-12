import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { useNftStore } from "@/stores/nft";
import { toast } from "sonner";
import { Tooltip } from "@/components/elements/base/tooltips/Tooltip";

const SocialLinksAndButtons = () => {
  const {
    collection,
    followCollection,
    unfollowCollection,
    checkFollowStatus,
  } = useNftStore();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [hovering, setHovering] = useState(false);

  // Fetch the follow status when the component mounts
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (collection && collection.id) {
        const status = await checkFollowStatus(collection.id);
        setIsFollowing(status);
      }
    };

    fetchFollowStatus();
  }, [collection, checkFollowStatus]); // Dependency array updated to include `collection` instead of `collection.id`

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    if (!collection || !collection.id) return;

    if (isFollowing) {
      await unfollowCollection(collection.id);
      setIsFollowing(false);
    } else {
      await followCollection(collection.id);
      setIsFollowing(true);
    }
  };

  const handleShare = () => {
    if (!collection) return;
    const assetUrl = `${window.location.origin}/nft/collection/${collection.id}`;
    navigator.clipboard.writeText(assetUrl).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  // If collection is null, render empty state early on
  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex justify-end items-center px-6 md:px-12 mt-4 gap-5">
      {/* Render Social Links */}
      {collection.links && Object.keys(collection.links).length > 0 && (
        <div className="flex gap-4 md:gap-6 border-e pe-4 border-muted-200 dark:border-muted-800">
          {collection.links?.website && (
            <Tooltip content="Website">
              <a
                href={collection.links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Icon icon="mdi:web" />
              </a>
            </Tooltip>
          )}
          {collection.links?.youtube && (
            <Tooltip content="YouTube">
              <a
                href={collection.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Icon icon="mdi:youtube" />
              </a>
            </Tooltip>
          )}
          {collection.links?.twitter && (
            <Tooltip content="Twitter">
              <a
                href={collection.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Icon icon="mdi:twitter" />
              </a>
            </Tooltip>
          )}
          {collection.links?.instagram && (
            <Tooltip content="Instagram">
              <a
                href={collection.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Icon icon="mdi:instagram" />
              </a>
            </Tooltip>
          )}
          {collection.links?.discord && (
            <Tooltip content="Discord">
              <a
                href={collection.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Icon icon="mdi:discord" />
              </a>
            </Tooltip>
          )}
          {collection.links?.telegram && (
            <Tooltip content="Telegram">
              <a
                href={collection.links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Icon icon="mdi:telegram" />
              </a>
            </Tooltip>
          )}
        </div>
      )}

      {/* Follow and Share Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          color={"contrast"}
          onClick={handleFollowToggle}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="group flex items-center"
        >
          <Icon
            icon={isFollowing ? "mdi:star" : "mdi:star-outline"}
            className={`w-5 h-5 me-1 ${
              isFollowing && hovering
                ? "text-red-500"
                : isFollowing
                ? "text-yellow-500"
                : "group-hover:text-yellow-500"
            }`}
          />
          <span
            className={`text-sm ${
              isFollowing && hovering
                ? "text-red-500"
                : isFollowing
                ? "text-yellow-500"
                : "group-hover:text-yellow-500"
            }`}
          >
            {isFollowing && hovering
              ? "Unfollow"
              : isFollowing
              ? "Following"
              : "Follow"}
          </span>
        </Button>

        <Tooltip content="Share">
          <IconButton color={"contrast"} onClick={handleShare}>
            <Icon icon="mdi:share-variant" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default SocialLinksAndButtons;
