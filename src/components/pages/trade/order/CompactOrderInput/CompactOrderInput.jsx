"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompactOrderInput = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const compactInput_1 = __importDefault(require("@/components/elements/form/input/compactInput"));
const lodash_1 = require("lodash");
const RangeSlider_1 = __importDefault(require("@/components/elements/addons/range-slider/RangeSlider"));
const dashboard_1 = require("@/stores/dashboard");
const order_1 = require("@/stores/trade/order");
const market_1 = __importDefault(require("@/stores/trade/market"));
const react_2 = require("@iconify/react");
const link_1 = __importDefault(require("next/link"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const CompactOrderInputBase = ({ type }) => {
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
    const options = type === "MARKET"
        ? [
            { value: "AMOUNT", label: "Amount" },
            { value: "TOTAL", label: "Total" },
        ]
        : [];
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [inputType, setInputType] = (0, react_1.useState)("AMOUNT");
    const [side, setSide] = (0, react_1.useState)("BUY");
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
    }, [type, side, ask, bid]);
    const handleSliderChange = (value) => {
        setPercentage(value);
        let total = 0;
        const calculateTotal = (balance, divisor, precisionType) => {
            const divisorValue = divisor ? Number(divisor) : 1; // Ensure divisor is a number
            return parseFloat(((balance * value) / 100 / divisorValue).toFixed(getPrecision(precisionType)));
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
        const result = await placeOrder(market.isEco, market.currency, market.pair, type, side, calculatedAmount, price);
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
        <div className="text-xs -mx-4">
          <button className={`w-1/2 transition-all duration-300 translate-x-4 rounded-l-sm ${side === "BUY"
            ? "bg-success-500 text-white"
            : "bg-muted-100 dark:bg-muted-800 text-muted-500"} py-2`} style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
        }} onClick={() => setSide("BUY")}>
            <span className="text-md font-heading">{t("Buy")}</span>
          </button>

          <button className={`w-1/2 transition-all duration-300 -translate-x-4 rounded-r-sm ${side === "SELL"
            ? "bg-danger-500 text-white"
            : "bg-muted-100 dark:bg-muted-800 text-muted-500"} py-2`} style={{
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
        }} onClick={() => setSide("SELL")}>
            <span className="text-md font-heading">{t("Sell")}</span>
          </button>
        </div>

        <div className="flex gap-1 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-muted-400 dark:text-muted-400 text-xs">
              {t("Avbl")}{" "}
              {side === "BUY"
            ? pairBalance.toFixed(getPrecision("price"))
            : currencyBalance.toFixed(getPrecision("amount"))}{" "}
              {side === "BUY" ? market === null || market === void 0 ? void 0 : market.pair : market === null || market === void 0 ? void 0 : market.currency}
            </span>
            <Tooltip_1.Tooltip content={`Deposit ${side === "BUY" ? market === null || market === void 0 ? void 0 : market.pair : market === null || market === void 0 ? void 0 : market.currency}`}>
              <link_1.default href={(profile === null || profile === void 0 ? void 0 : profile.id)
            ? "/user/wallet/deposit"
            : "/login?return=/user/wallet/deposit"}>
                <react_2.Icon icon="mdi:plus" className="h-3 w-3 text-primary-500 cursor-pointer border border-primary-500 rounded-full hover:bg-primary-500 hover:text-white"/>
              </link_1.default>
            </Tooltip_1.Tooltip>
          </div>
          {type !== "MARKET" && (<span className="text-xs text-primary-500 dark:text-primary-400 cursor-pointer" onClick={() => setPrice(side === "BUY" ? ask : bid)}>
              {t("Best")} {side === "BUY" ? "Ask" : "Bid"}
            </span>)}
        </div>

        <div className="flex flex-col">
          <compactInput_1.default type="number" className="input" placeholder={type === "MARKET" ? "Market" : price.toString()} label={t("Price")} postLabel={market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} disabled={type === "MARKET"} value={type === "MARKET" ? "" : price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} min={minPrice} max={maxPrice} step={minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))}/>
        </div>

        <div className="flex flex-col gap-1">
          <compactInput_1.default type="number" className="input" placeholder="0.0" label={type === "MARKET" ? "" : "Amount"} postLabel={inputType === "AMOUNT" ? market === null || market === void 0 ? void 0 : market.currency : market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} options={options} selected={inputType} setSelected={(value) => {
            setAmount(0);
            setPercentage(0);
            setInputType(value);
        }} value={amount} // Ensure amount is bound to the input
     onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} min={minAmount} max={maxAmount} step={minAmount > 0 ? minAmount : Math.pow(10, -getPrecision("amount"))}/>
        </div>

        <div className="mt-2 mb-3">
          <RangeSlider_1.default legend min={0} max={100} steps={[0, 25, 50, 75, 100]} value={percentage} onSliderChange={handleSliderChange} color="warning" disabled={!(profile === null || profile === void 0 ? void 0 : profile.id) || (type !== "MARKET" && price === 0)}/>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Button_1.default type="button" color={(profile === null || profile === void 0 ? void 0 : profile.id) ? (side === "BUY" ? "success" : "danger") : "muted"} disabled={!(profile === null || profile === void 0 ? void 0 : profile.id) ||
            (type !== "MARKET" && price === 0) ||
            amount === 0 ||
            !amount} animated={false} className="w-full" shape={"rounded-xs"} onClick={() => {
            if (profile === null || profile === void 0 ? void 0 : profile.id) {
                handlePlaceOrder();
            }
            else {
                router.push("/auth/login");
            }
        }}>
          {(profile === null || profile === void 0 ? void 0 : profile.id) ? ((0, lodash_1.capitalize)(side) + " " + (market === null || market === void 0 ? void 0 : market.currency)) : (<div className="flex gap-2">
              <span className="text-warning-500">{t("Log In")}</span>
              <span>{t("or")}</span>
              <span className="text-warning-500">{t("Register Now")}</span>
            </div>)}
        </Button_1.default>
      </div>
    </div>);
};
exports.CompactOrderInput = (0, react_1.memo)(CompactOrderInputBase);
