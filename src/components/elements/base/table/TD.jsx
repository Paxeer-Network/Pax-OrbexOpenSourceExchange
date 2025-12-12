"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TD = ({ className: classes = "", children, ...props }) => (<td className={`border-t border-muted-200 py-4 px-3 font-sans font-normal dark:border-muted-800 ${classes}`} valign="middle" {...props}>
    {children}
  </td>);
exports.default = TD;
