"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DarkToolTip = ({ children, content, position = "top", classNames, }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    return (<div className={"z-50 dark-tooltip-wrapper"}>
      <div className={"dark-tooltip-children"} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {children}
      </div>

      {isHovered && (<div className={`dark-tooltip dark-tooltip-${position} ${classNames ? classNames : ""}`}>
          <div className={"dark-tooltip-content text-black dark:text-white"}>
            {content}
          </div>
        </div>)}
    </div>);
};
exports.default = DarkToolTip;
