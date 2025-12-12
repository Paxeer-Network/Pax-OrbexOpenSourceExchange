"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProductList = void 0;
const react_1 = require("react");
const ListWidgetItem_1 = __importDefault(require("@/components/widgets/ListWidgetItem"));
const MashImage_1 = require("@/components/elements/MashImage");
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const OrderProductListBase = ({ products }) => {
    return products.map((product, index) => {
        var _a, _b, _c;
        return (<li key={index}>
      <ListWidgetItem_1.default href="#" avatarSize="xxs" avatar={<MashImage_1.MashImage src={product.image || "/img/placeholder.svg"} alt="Nitro Inc." width={32} height={32} className="rounded-lg"/>} title={product.name} text={`${product.price} ${product.currency}`} itemAction={<div className="flex items-center gap-2">
            {product.type === "DOWNLOADABLE" && (<Tooltip_1.Tooltip content={((_a = product.ecommerceOrderItem) === null || _a === void 0 ? void 0 : _a.key)
                        ? "Download key"
                        : ((_b = product.ecommerceOrderItem) === null || _b === void 0 ? void 0 : _b.filePath)
                            ? "Download file"
                            : "Not available yet"}>
                <react_2.Icon icon="line-md:downloading-loop" className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500" onClick={() => {
                        var _a, _b;
                        if ((_a = product.ecommerceOrderItem) === null || _a === void 0 ? void 0 : _a.key) {
                            const element = document.createElement("a");
                            const file = new Blob([
                                `Product Activation Key\n\n` +
                                    `Dear Customer,\n\n` +
                                    `Thank you for your purchase. Please find your product activation key below:\n\n` +
                                    `Key: ${product.ecommerceOrderItem.key}\n\n` +
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
                        else if ((_b = product.ecommerceOrderItem) === null || _b === void 0 ? void 0 : _b.filePath) {
                            const element = document.createElement("a");
                            element.href = product.ecommerceOrderItem.filePath;
                            element.download = `${product.name}`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                        }
                    }}/>
              </Tooltip_1.Tooltip>)}

            <link_1.default href={`/store/${(_c = product.category) === null || _c === void 0 ? void 0 : _c.name}/${product.name}`} className="cursor-pointer text-muted-400 transition-colors duration-300 hover:text-primary-500">
              <react_2.Icon icon="lucide:arrow-right"/>
            </link_1.default>
          </div>}/>
    </li>);
    });
};
exports.OrderProductList = (0, react_1.memo)(OrderProductListBase);
