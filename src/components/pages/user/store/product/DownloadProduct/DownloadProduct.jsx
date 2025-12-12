"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadProduct = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const DownloadProductBase = ({ product }) => {
    var _a, _b;
    return (<div className="pb-5 px-5">
      <Button_1.default type="button" shape="rounded-sm" color="success" className="w-full mt-4" onClick={() => {
            var _a, _b;
            if ((_a = product.orders[0].ecommerceOrderItem) === null || _a === void 0 ? void 0 : _a.key) {
                const element = document.createElement("a");
                const file = new Blob([
                    `Product Activation Key\n\n` +
                        `Dear Customer,\n\n` +
                        `Thank you for your purchase. Please find your product activation key below:\n\n` +
                        `Key: ${product.orders[0].ecommerceOrderItem.key}\n\n` +
                        `To activate your product, enter the key in the designated field during the installation or setup process. If you encounter any issues or have questions, please do not hesitate to contact our support team.\n\n` +
                        `Best regards,\n` +
                        `${process.env.NEXT_PUBLIC_SITE_NAME} Support Team\n` +
                        `${process.env.NEXT_PUBLIC_APP_EMAIL}`,
                ], { type: "text/plain" });
                element.href = URL.createObjectURL(file);
                element.download = `${product.name}-key.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
            else if ((_b = product.orders[0].ecommerceOrderItem) === null || _b === void 0 ? void 0 : _b.filePath) {
                const element = document.createElement("a");
                element.href = product.orders[0].ecommerceOrderItem.filePath;
                element.download = `${product.name}`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
        }}>
        <react_2.Icon icon="line-md:downloading-loop"/>
        <span>
          {((_a = product.orders[0].ecommerceOrderItem) === null || _a === void 0 ? void 0 : _a.key)
            ? "Download key"
            : ((_b = product.orders[0].ecommerceOrderItem) === null || _b === void 0 ? void 0 : _b.filePath)
                ? "Download file"
                : "Not available yet"}
        </span>
      </Button_1.default>
    </div>);
};
exports.DownloadProduct = (0, react_1.memo)(DownloadProductBase);
