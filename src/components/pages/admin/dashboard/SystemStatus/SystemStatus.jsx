"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemStatus = void 0;
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("@/utils/api"));
const Alert_1 = __importDefault(require("@/components/elements/base/alert/Alert"));
require("react-loading-skeleton/dist/skeleton.css");
const statusMap = {
    Up: { icon: "ph:check-circle-duotone", color: "success" },
    Down: { icon: "ph:warning-octagon-duotone", color: "danger" },
};
const categories = [
    {
        category: "Core Services",
        services: [
            { service: "email", label: "Email" },
            { service: "sms", label: "SMS" },
            { service: "scylla", label: "Scylla Client" },
            { service: "googletranslate", label: "Google Translate" },
        ],
    },
    {
        category: "Financial Services",
        services: [
            { service: "openexchangerates", label: "Open Exchange Rates" },
            { service: "stripe", label: "Stripe" },
        ],
    },
    {
        category: "Ecosystem Nodes",
        services: [
            { service: "ethereum", label: "Ethereum Node" },
            { service: "bsc", label: "Binance Smart Chain Node" },
            { service: "polygon", label: "Polygon Node" },
            { service: "ftm", label: "Fantom Node" },
            { service: "optimism", label: "Optimism Node" },
            { service: "arbitrum", label: "Arbitrum Node" },
            { service: "celo", label: "Celo Node" },
        ],
    },
];
const SystemStatusBase = () => {
    const [pendingServices, setPendingServices] = react_1.default.useState(categories.flatMap((cat) => cat.services));
    const [processedServices, setProcessedServices] = react_1.default.useState(new Set());
    const [data, setData] = react_1.default.useState({});
    (0, react_1.useEffect)(() => {
        const fetchData = async () => {
            if (pendingServices.length === 0)
                return;
            const currentService = pendingServices[0];
            if (processedServices.has(currentService.service)) {
                setPendingServices((prevServices) => prevServices.slice(1));
                return;
            }
            setData((prevData) => ({
                ...prevData,
                [currentService.service]: {
                    service: currentService.service,
                    label: currentService.label,
                    status: "Loading",
                    message: "",
                    timestamp: "",
                },
            }));
            const { data, error } = await (0, api_1.default)({
                url: "/api/admin/system/health",
                params: { service: currentService.service },
                silent: true,
            });
            if (!error) {
                setData((prevData) => ({
                    ...prevData,
                    [currentService.service]: {
                        ...prevData[currentService.service],
                        ...data[currentService.service],
                    },
                }));
            }
            setProcessedServices((prevProcessed) => new Set([...prevProcessed, currentService.service]));
        };
        fetchData();
    }, [pendingServices, processedServices]);
    return (<>
      <div className="space-y-8 mt-8">
        {categories.map((category) => (<div key={category.category}>
            <div className="relative mb-8">
              <hr className="border-muted-200 dark:border-muted-700"/>
              <span className="absolute inset-0 -top-2.5 text-center font-semibold text-sm text-muted-500 dark:text-muted-400">
                <span className="bg-muted-50 dark:bg-muted-900 px-2">
                  {category.category}
                </span>
              </span>
            </div>
            {category.services.map((service) => {
                var _a, _b, _c;
                const status = data[service.service];
                return (<Alert_1.default key={service.service} icon={((_a = statusMap[status === null || status === void 0 ? void 0 : status.status]) === null || _a === void 0 ? void 0 : _a.icon) || "mingcute:loading-3-line"} iconClassName={((_b = statusMap[status === null || status === void 0 ? void 0 : status.status]) === null || _b === void 0 ? void 0 : _b.icon) ? "" : "animate-spin"} color={((_c = statusMap[status === null || status === void 0 ? void 0 : status.status]) === null || _c === void 0 ? void 0 : _c.color) || "muted"} label={<div className="w-full flex items-center justify-between gap-2 pe-5">
                      <span>{service.label}</span>
                      <span>{status === null || status === void 0 ? void 0 : status.timestamp}</span>
                    </div>} sublabel={(status === null || status === void 0 ? void 0 : status.message)
                        ? status.message
                        : `Checking ${service.label} status...`} canClose={false} className="my-3"/>);
            })}
          </div>))}
      </div>
    </>);
};
exports.SystemStatus = SystemStatusBase;
