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
exports.Order = void 0;
const react_1 = __importStar(require("react"));
const dashboard_1 = require("@/stores/dashboard");
const order_1 = require("@/stores/binary/order");
const market_1 = __importDefault(require("@/stores/trade/market"));
const next_i18next_1 = require("next-i18next");
const router_1 = require("next/router");
const sonner_1 = require("sonner");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const useBinaryCountdown_1 = require("@/hooks/useBinaryCountdown");
const OrderAmountAndExpiration_1 = __importDefault(require("./OrderAmountAndExpiration"));
const BinaryProfitIndicator_1 = __importDefault(require("./BinaryProfitIndicator"));
const OrderActionButtons_1 = __importDefault(require("./OrderActionButtons"));
const ExpiryModal_1 = __importDefault(require("./ExpiryModal"));
const BINARY_PROFIT = parseFloat(process.env.NEXT_PUBLIC_BINARY_PROFIT || "87");
const ORDER_WS_PATH = "/api/exchange/binary/order";
const ORDER_COMPLETED_TYPE = "ORDER_COMPLETED";
const OrderBase = ({}) => {
    var _a, _b, _c, _d;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const { fetchWallet, placeOrder, loading, setPracticeBalance, updatePracticeBalance, removeOrder, wallet, getPracticeBalance, } = (0, order_1.useBinaryOrderStore)();
    const { market } = (0, market_1.default)();
    const { orderConnection, createConnection, removeConnection, addMessageHandler, removeMessageHandler, subscribe, unsubscribe, } = (0, ws_1.default)();
    const { expirations, expiry, setExpiry } = (0, useBinaryCountdown_1.useBinaryCountdown)();
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [orderConnectionReady, setOrderConnectionReady] = (0, react_1.useState)(false);
    const isPractice = router.query.practice === "true";
    const minAmount = Number(((_b = (_a = market === null || market === void 0 ? void 0 : market.limits) === null || _a === void 0 ? void 0 : _a.amount) === null || _b === void 0 ? void 0 : _b.min) || 0);
    const maxAmount = Number(((_d = (_c = market === null || market === void 0 ? void 0 : market.limits) === null || _c === void 0 ? void 0 : _c.amount) === null || _d === void 0 ? void 0 : _d.max) || 0);
    const balance = isPractice && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair)
        ? getPracticeBalance(market.currency, market.pair)
        : (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0;
    // Setup practice balance
    (0, react_1.useEffect)(() => {
        if (isPractice && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair)) {
            setPracticeBalance(market.currency, market.pair, getPracticeBalance(market.currency, market.pair));
        }
    }, [
        isPractice,
        setPracticeBalance,
        getPracticeBalance,
        market === null || market === void 0 ? void 0 : market.currency,
        market === null || market === void 0 ? void 0 : market.pair,
    ]);
    const handleOrderMessage = (0, react_1.useCallback)((message) => {
        var _a;
        if (!message || message.type !== ORDER_COMPLETED_TYPE)
            return;
        const { order } = message;
        if (!order)
            return;
        const orderAmount = order.amount;
        const profitPercentage = order.profit || BINARY_PROFIT;
        const profit = orderAmount * (profitPercentage / 100);
        switch (order.status) {
            case "WIN":
                sonner_1.toast.success(`You won ${profit.toFixed(2)}`);
                break;
            case "LOSS":
                sonner_1.toast.error(`You lost ${orderAmount.toFixed(2)}`);
                break;
            case "DRAW":
                sonner_1.toast.info(`Order ended in a draw`);
                break;
        }
        if (isPractice && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair)) {
            if (order.status === "WIN") {
                updatePracticeBalance(market.currency, market.pair, orderAmount + profit, "add");
            }
            else if (order.status === "LOSS") {
                // Consider revisiting this logic if unintended.
                updatePracticeBalance(market.currency, market.pair, 0);
            }
            else if (order.status === "DRAW") {
                updatePracticeBalance(market.currency, market.pair, orderAmount, "add");
            }
        }
        else {
            const symbolParts = ((_a = order === null || order === void 0 ? void 0 : order.symbol) === null || _a === void 0 ? void 0 : _a.split("/")) || [];
            if (symbolParts[1]) {
                fetchWallet(symbolParts[1]);
            }
        }
        removeOrder(order.id);
    }, [
        isPractice,
        market === null || market === void 0 ? void 0 : market.currency,
        market === null || market === void 0 ? void 0 : market.pair,
        updatePracticeBalance,
        fetchWallet,
        removeOrder,
    ]);
    // Setup WS connection
    (0, react_1.useEffect)(() => {
        if (!router.isReady)
            return;
        createConnection("orderConnection", ORDER_WS_PATH);
        setOrderConnectionReady(true);
        return () => {
            if (!router.query.symbol) {
                removeConnection("orderConnection");
            }
        };
    }, [router.isReady, router.query.symbol, createConnection, removeConnection]);
    // Subscribe/unsubscribe to order events
    (0, react_1.useEffect)(() => {
        if (!orderConnectionReady ||
            !(orderConnection === null || orderConnection === void 0 ? void 0 : orderConnection.isConnected) ||
            !(profile === null || profile === void 0 ? void 0 : profile.id) ||
            !(market === null || market === void 0 ? void 0 : market.symbol))
            return;
        subscribe("orderConnection", "order", {
            symbol: market.symbol,
            userId: profile.id,
        });
        return () => {
            unsubscribe("orderConnection", "order", {
                symbol: market.symbol,
                userId: profile.id,
            });
        };
    }, [
        orderConnectionReady,
        orderConnection === null || orderConnection === void 0 ? void 0 : orderConnection.isConnected,
        profile === null || profile === void 0 ? void 0 : profile.id,
        market === null || market === void 0 ? void 0 : market.symbol,
        subscribe,
        unsubscribe,
    ]);
    // Add message handler
    (0, react_1.useEffect)(() => {
        if (!orderConnectionReady || !(orderConnection === null || orderConnection === void 0 ? void 0 : orderConnection.isConnected))
            return;
        addMessageHandler("orderConnection", handleOrderMessage);
        return () => {
            removeMessageHandler("orderConnection", handleOrderMessage);
        };
    }, [
        orderConnectionReady,
        orderConnection === null || orderConnection === void 0 ? void 0 : orderConnection.isConnected,
        addMessageHandler,
        removeMessageHandler,
        handleOrderMessage,
    ]);
    const canPlaceOrder = (0, react_1.useCallback)(() => {
        var _a, _b;
        if (!(profile === null || profile === void 0 ? void 0 : profile.id))
            return false;
        if (getSetting("binaryRestrictions") === "true") {
            const kycLevel = parseFloat(((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.level) || "0");
            const isKycApproved = ((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.status) === "APPROVED";
            if (!isKycApproved && kycLevel < 2)
                return false;
        }
        if (amount <= 0 ||
            amount < minAmount ||
            amount > maxAmount ||
            balance <= 0) {
            return false;
        }
        return true;
    }, [profile, getSetting, amount, minAmount, maxAmount, balance]);
    const handlePlaceOrder = async (side) => {
        var _a, _b, _c;
        if (!(profile === null || profile === void 0 ? void 0 : profile.id)) {
            router.push("/login");
            return;
        }
        if (getSetting("binaryRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            await router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to trade binary options"));
            return;
        }
        if (!(expiry === null || expiry === void 0 ? void 0 : expiry.expirationTime)) {
            sonner_1.toast.error(t("Invalid expiry time"));
            return;
        }
        if (amount <= 0) {
            sonner_1.toast.error(t("Please enter a valid amount"));
            return;
        }
        if (!(market === null || market === void 0 ? void 0 : market.currency) || !(market === null || market === void 0 ? void 0 : market.pair)) {
            sonner_1.toast.error(t("Market is not available"));
            return;
        }
        const closedAt = expiry.expirationTime.toISOString();
        await placeOrder(market.currency, market.pair, side, amount, closedAt, isPractice);
        // Reset expiry to the first valid expiration
        const newExpiry = expirations.find((exp) => (exp.expirationTime.getTime() - new Date().getTime()) / 1000 > 50) || expirations[0];
        setExpiry(newExpiry);
    };
    return (<>
      <div className="flex gap-3 md:overflow-x-auto flex-col justify-between p-4 md:p-2">
        <OrderAmountAndExpiration_1.default amount={amount} setAmount={setAmount} balance={balance} minAmount={minAmount} maxAmount={maxAmount} expiry={expiry} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>

        <BinaryProfitIndicator_1.default profit={BINARY_PROFIT}/>

        <OrderActionButtons_1.default profile={profile} loading={loading} canPlaceOrder={canPlaceOrder} handlePlaceOrder={handlePlaceOrder} t={t} router={router}/>
      </div>

      {isModalOpen && (<ExpiryModal_1.default expirations={expirations} expiry={expiry} setExpiry={setExpiry} setIsModalOpen={setIsModalOpen} formatTime={useBinaryCountdown_1.formatTime} t={t}/>)}
    </>);
};
exports.Order = (0, react_1.memo)(OrderBase);
