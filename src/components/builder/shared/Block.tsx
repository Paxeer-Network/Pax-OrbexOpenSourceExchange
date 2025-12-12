// src/components/Block.tsx
import React from "react";
import { useNode } from "@craftjs/core";
import Child from "./Child"; // Your existing Child component

const Block = ({ root }) => {
  const { connectors } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connectors.connect(ref as HTMLElement);
      }}
    >
      <Child root={root} />
    </div>
  );
};

Block.craft = {
  displayName: "Block",
  props: {},
  isCanvas: true,
  rules: {
    canDrag: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};

export default Block;
