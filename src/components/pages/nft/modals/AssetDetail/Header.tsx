import React from "react";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";

interface ModalHeaderProps {
  onPrev: () => void;
  onNext: () => void;
  index: number;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onPrev, onNext, index }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button onClick={onPrev} type="button" disabled={index === 1}>
          <Icon icon="mdi:arrow-left" /> Previous
        </Button>
        <Button onClick={onNext} type="button">
          Next <Icon icon="mdi:arrow-right" />
        </Button>
      </div>
    </div>
  );
};

export default ModalHeader;
