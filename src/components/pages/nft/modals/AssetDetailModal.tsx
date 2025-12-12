import React, { useEffect } from "react";
import { useNftStore } from "@/stores/nft";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import ModalHeader from "./AssetDetail/Header";
import Info from "./AssetDetail/Info";
import Attributes from "./AssetDetail/Attributes";
import DetailsTabs from "./AssetDetail/Tabs";
import PurchaseModal from "./PurchaseModal";

interface AssetDetailModalProps {
  asset: any;
  isVisible: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  isVisible,
  onClose,
  onPrev,
  onNext,
}) => {
  const { collection, isPurchaseModalVisible, closePurchaseModal } =
    useNftStore();

  // Disable body scroll when the modal is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Reset scrolling
    }

    // Cleanup to reset the scroll style when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  if (!isVisible || !collection) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs">
      {/* Modal Container */}
      <div className="bg-white dark:bg-muted-900 w-full max-w-5xl rounded-lg overflow-hidden shadow-lg relative">
        {/* Close Button */}
        <div className="absolute top-6 right-6">
          <IconButton onClick={onClose} color="muted">
            <Icon icon="mdi:close" />
          </IconButton>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto custom-scroll max-h-[80vh] h-[80vh]">
          <div className="flex flex-col md:flex-row overflow-hidden">
            {/* Asset Image Section */}
            <div className="md:w-1/2 flex justify-center items-center p-6">
              <img
                src={asset.image}
                alt={asset.name}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>

            {/* Right Section - Scrollable Content */}
            <div className="md:w-1/2 space-y-6 flex flex-col justify-between p-6">
              <ModalHeader
                onPrev={onPrev}
                onNext={onNext}
                index={asset.index}
              />
              <Info asset={asset} collection={collection} />
            </div>
          </div>

          {/* Scrollable Additional Sections */}
          <div className="flex gap-6 px-6 pb-6">
            {/* Attributes Section */}
            <div className="hidden md:block md:w-1/3">
              <Attributes attributes={asset.attributes?.attributes} />
            </div>

            {/* Details Tabs */}
            <div className="w-full">
              <DetailsTabs collection={collection} asset={asset} />
            </div>
          </div>
        </div>
      </div>

      <PurchaseModal
        isVisible={isPurchaseModalVisible}
        onClose={closePurchaseModal}
        asset={asset}
        chain={collection.chain}
      />
    </div>
  );
};

export default AssetDetailModal;
