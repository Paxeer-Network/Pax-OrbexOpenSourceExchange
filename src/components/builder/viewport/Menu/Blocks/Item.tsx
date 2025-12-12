// src/components/Item.tsx
import React from "react";
import { Element } from "@craftjs/core";
import { uniqueId } from "lodash";
import Block from "@/components/builder/shared/Block";
import { cleanHTMLElement } from "@/components/builder/utils/html";
import { parse } from "node-html-parser";

const Item = ({ connectors, c, move, children }) => {
  const root = cleanHTMLElement(parse(c.source) as unknown as RootProps);
  const id = uniqueId();

  return (
    <div
      ref={(ref) =>
        connectors.create(
          ref as HTMLElement,
          <Element is={Block} key={id} canvas root={root} />
        )
      }
    >
      <a
        style={{ cursor: move ? "move" : "pointer" }}
        className="relative w-full cursor-pointer text-muted-800 dark:text-muted-200 hover:text-muted-800 transition-all gap-2 text-sm"
      >
        {children}
      </a>
    </div>
  );
};

export default Item;
