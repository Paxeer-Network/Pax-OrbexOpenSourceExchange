"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TH = ({ className: classes = "", children, ...props }) => (<th className={`bg-transparent py-4 px-3 text-start font-sans text-xs font-medium uppercase text-muted-400 tracking-wide ${classes}`} {...props}>
    {children}
  </th>);
exports.default = TH;
