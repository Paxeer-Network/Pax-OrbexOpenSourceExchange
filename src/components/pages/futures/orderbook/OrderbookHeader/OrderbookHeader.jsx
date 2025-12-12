"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookHeader = void 0;
const react_1 = require("react");
const VisibilityControls_1 = require("../VisibilityControls");
const PercentageBar_1 = require("../PercentageBar");
const OrderbookHeaderBase = ({ visible, setVisible, askPercentage, bidPercentage, }) => {
    return (<div className="flex justify-between items-center p-2 gap-4">
      <VisibilityControls_1.VisibilityControls visible={visible} setVisible={setVisible}/>
      <PercentageBar_1.PercentageBar askPercentage={askPercentage} bidPercentage={bidPercentage}/>
    </div>);
};
exports.OrderbookHeader = (0, react_1.memo)(OrderbookHeaderBase);
