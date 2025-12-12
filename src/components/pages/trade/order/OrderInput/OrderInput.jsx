"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInput = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const compactInput_1 = __importDefault(require("@/components/elements/form/input/compactInput"));
const lodash_1 = require("lodash");
const RangeSlider_1 = __importDefault(require("@/components/elements/addons/range-slider/RangeSlider"));
const dashboard_1 = require("@/stores/dashboard");
const order_1 = require("@/stores/trade/order");
const router_1 = require("next/router");
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const market_1 = __importDefault(require("@/stores/trade/market"));
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const format_1 = require("@/utils/format");
const OrderInputBase = ({ type, side }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    const minAmount = Number(((_b = (_a = market === null || market === void 0 ? void 0 : market.limits) === null || _a === void 0 ? void 0 : _a.amount) === null || _b === void 0 ? void 0 : _b.min) || 0);
    const maxAmount = Number(((_d = (_c = market === null || market === void 0 ? void 0 : market.limits) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.max) || 0);
    const minPrice = Number(((_f = (_e = market === null || market === void 0 ? void 0 : market.limits) === null || _e === void 0 ? void 0 : _e.price) === null || _f === void 0 ? void 0 : _f.min) || 0);
    const maxPrice = Number(((_h = (_g = market === null || market === void 0 ? void 0 : market.limits) === null || _g === void 0 ? void 0 : _g.price) === null || _h === void 0 ? void 0 : _h.max) || 0);
    const { placeOrder, currencyBalance, pairBalance, ask, bid } = (0, order_1.useOrderStore)();
    const [amount, setAmount] = (0, react_1.useState)(0);
    const options = type === "MARKET"
        ? [
            { value: "AMOUNT", label: "Amount" },
            { value: "TOTAL", label: "Total" },
        ]
        : [];
    const [inputType, setInputType] = (0, react_1.useState)("AMOUNT");
    const [price, setPrice] = (0, react_1.useState)(0);
    const [percentage, setPercentage] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        setPercentage(0);
        if (type === "MARKET") {
            setPrice(0);
        }
        else {
            setPrice(side === "BUY" ? ask : bid);
        }
        setInputType("AMOUNT");
    }, [type]);
    const handleSliderChange = (value) => {
        setPercentage(value);
        let total = 0;
        const calculateTotal = (balance, divisor, precisionType) => {
            const divisorValue = divisor ? Number(divisor) : 1; // Ensure divisor is a number
            const calculatedValue = parseFloat(((balance * value) / 100 / divisorValue).toFixed(getPrecision(precisionType)));
            return calculatedValue;
        };
        if (type === "MARKET") {
            if (side === "BUY") {
                total =
                    inputType === "AMOUNT"
                        ? calculateTotal(pairBalance, ask, "amount")
                        : calculateTotal(pairBalance, 1, "price");
            }
            else {
                total = calculateTotal(currencyBalance, 1, "amount");
            }
        }
        else {
            if (side === "BUY") {
                total = calculateTotal(pairBalance, price, "amount");
            }
            else {
                total = calculateTotal(currencyBalance, 1, "amount");
            }
        }
        setAmount(total);
    };
    const handlePlaceOrder = async () => {
        var _a, _b, _c;
        if (getSetting("tradeRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            await router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to start trading"));
            return;
        }
        let calculatedAmount = amount;
        if (type === "MARKET" && inputType === "TOTAL")
            calculatedAmount = amount / (side === "BUY" ? ask : bid);
        const result = await placeOrder(market.isEco, market === null || market === void 0 ? void 0 : market.currency, market === null || market === void 0 ? void 0 : market.pair, type, side, calculatedAmount, price);
        if (result) {
            if (type !== "MARKET") {
                setPrice(0);
            }
            setAmount(0);
            setPercentage(0);
        }
    };
    return (<div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="text-muted-400 dark:text-muted-400 text-xs whitespace-nowrap">
              {t("Avbl")}{" "}
              {side === "BUY"
            ? (0, format_1.formatBalance)(pairBalance, getPrecision("price"))
            : (0, format_1.formatBalance)(currencyBalance, getPrecision("amount"))}{" "}
              {side === "BUY" ? market === null || market === void 0 ? void 0 : market.pair : market === null || market === void 0 ? void 0 : market.currency}
            </span>
            <Tooltip_1.Tooltip content={`Deposit ${side === "BUY" ? market === null || market === void 0 ? void 0 : market.pair : market === null || market === void 0 ? void 0 : market.currency}`}>
              <link_1.default href={(profile === null || profile === void 0 ? void 0 : profile.id)
            ? "/user/wallet/deposit"
            : "/login?return=/user/wallet/deposit"}>
                <react_2.Icon icon="mdi:plus" className="h-3 w-3 text-primary-500 cursor-pointer border border-primary-500 rounded-full hover:bg-primary-500 hover:text-white flex-shrink-0"/>
              </link_1.default>
            </Tooltip_1.Tooltip>
          </div>
          {type !== "MARKET" && (<div className="flex justify-end">
              <span className="text-xs text-primary-500 dark:text-primary-400 cursor-pointer whitespace-nowrap" onClick={() => setPrice(side === "BUY" ? ask : bid)}>
                {t("Best")} {side === "BUY" ? "Ask" : "Bid"}
              </span>
            </div>)}
        </div>
        <div className="flex flex-col">
          <compactInput_1.default type="number" className="input" placeholder={type === "MARKET" ? "Market" : price.toString()} label={t("Price")} postLabel={market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} disabled={type === "MARKET"} value={type === "MARKET" ? "" : price} onChange={(e) => setPrice(e.target.value)} min={minPrice} max={maxPrice} step={minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))}/>
        </div>
        <div className="flex flex-col gap-1">
          <compactInput_1.default type="number" className="input" placeholder="0.0" label={type === "MARKET" ? "" : "Amount"} postLabel={inputType === "AMOUNT" ? market === null || market === void 0 ? void 0 : market.currency : market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} options={options} selected={inputType} setSelected={(value) => {
            setAmount(0);
            setPercentage(0);
            setInputType(value);
        }} value={amount} // Bind the amount state to the value prop
     onChange={(e) => setAmount(parseFloat(e.target.value))} min={minAmount} max={maxAmount} step={minAmount > 0 ? minAmount : Math.pow(10, -getPrecision("amount"))}/>
        </div>
        <div className="mt-2 mb-3">
          <RangeSlider_1.default legend min={0} max={100} steps={[0, 25, 50, 75, 100]} value={percentage} onSliderChange={handleSliderChange} color="warning" disabled={!(profile === null || profile === void 0 ? void 0 : profile.id) || (type !== "MARKET" && price === 0)}/>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button_1.default type="button" color={(profile === null || profile === void 0 ? void 0 : profile.id) ? (side === "BUY" ? "success" : "danger") : "muted"} animated={false} className={`w-full text-sm font-semibold transition-all duration-200 ${(profile === null || profile === void 0 ? void 0 : profile.id)
            ? side === "BUY"
                ? "btn-long glow-long hover:scale-[1.02] active:scale-[0.98]"
                : "btn-short glow-short hover:scale-[1.02] active:scale-[0.98]"
            : "btn-market hover:scale-[1.02] active:scale-[0.98]"}`} shape={"rounded"} disabled={!(profile === null || profile === void 0 ? void 0 : profile.id) ||
            (type !== "MARKET" && price === 0) ||
            amount === 0 ||
            !amount} onClick={() => {
            if (profile === null || profile === void 0 ? void 0 : profile.id) {
                handlePlaceOrder();
            }
            else {
                router.push("/auth/login");
            }
        }}>
          {(profile === null || profile === void 0 ? void 0 : profile.id) ? (<span className="whitespace-nowrap flex items-center gap-2">
              <span className="text-lg">
                {side === "BUY" ? "📈" : "📉"}
              </span>
              {(0, lodash_1.capitalize)(side)} {market === null || market === void 0 ? void 0 : market.currency}
            </span>) : (<div className="flex items-center gap-2 text-sm">
              <span className="text-xl">🚀</span>
              <div className="flex gap-1">
                <span className="text-white font-medium">{t("Log In")}</span>
                <span className="text-white/70">{t("or")}</span>
                <span className="text-white font-medium">{t("Register Now")}</span>
              </div>
            </div>)}
        </Button_1.default>
      </div>
    </div>);
};
exports.OrderInput = (0, react_1.memo)(OrderInputBase);
