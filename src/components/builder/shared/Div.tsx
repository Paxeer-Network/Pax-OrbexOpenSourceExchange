// src/components/Div.tsx
import React from "react";
import { useNode } from "@craftjs/core";
import Resizer from "./Resizer";

const Div = ({ children, className }) => {
  const { connectors } = useNode();

  return (
    <Resizer
      ref={(ref) => {
        if (ref) connectors.connect(ref as HTMLElement);
      }}
      propKey={{ width: "width", height: "height" }}
    >
      <div className={className}>{children}</div>
    </Resizer>
  );
};

Div.craft = {
  displayName: "Div",
  props: {},
  isCanvas: true,
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
};

export default Div;
