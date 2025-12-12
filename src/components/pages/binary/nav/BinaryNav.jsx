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
exports.BinaryNav = void 0;
const react_1 = __importStar(require("react"));
const MarketTab_1 = require("./MarketTab");
const router_1 = require("next/router");
const market_1 = __importDefault(require("@/stores/trade/market"));
const lodash_1 = require("lodash");
const ThemeSwitcher_1 = __importDefault(require("@/components/widgets/ThemeSwitcher"));
const AccountDropdown_1 = require("@/components/layouts/shared/AccountDropdown");
const link_1 = __importDefault(require("next/link"));
const LogoText_1 = __importDefault(require("@/components/vector/LogoText"));
const order_1 = require("@/stores/binary/order");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const next_i18next_1 = require("next-i18next");
const ButtonLink_1 = __importDefault(require("@/components/elements/base/button-link/ButtonLink"));
const SearchBar_1 = require("../../trade/markets/SearchBar");
const MarketList_1 = require("../../trade/markets/MarketList");
const Dropdown_1 = __importDefault(require("@/components/elements/base/dropdown/Dropdown"));
const react_2 = require("@iconify/react");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const dashboard_1 = require("@/stores/dashboard");
const ws_1 = __importDefault(require("@/stores/trade/ws"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const api_1 = __importDefault(require("@/utils/api"));
const format_1 = require("@/utils/format");
const BinaryNavBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const { market, fetchData, setPriceChangeData, getPrecisionBySymbol } = (0, market_1.default)();
    const { createConnection, removeConnection, addMessageHandler, removeMessageHandler, subscribe, unsubscribe, } = (0, ws_1.default)();
    const router = (0, router_1.useRouter)();
    const [currency, setCurrency] = (0, react_1.useState)(null);
    const [pair, setPair] = (0, react_1.useState)(null);
    const [tickersFetched, setTickersFetched] = (0, react_1.useState)(false);
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    const { wallet, fetchWallet, getPracticeBalance, setPracticeBalance } = (0, order_1.useBinaryOrderStore)();
    const isPractice = router.query.practice === "true";
    const debouncedFetchWallet = (0, lodash_1.debounce)(fetchWallet, 100);
    (0, react_1.useEffect)(() => {
        if (!isPractice && market && pair) {
            debouncedFetchWallet(pair);
        }
    }, [pair, market]);
    (0, react_1.useEffect)(() => {
        if (router.query.symbol) {
            const [newCurrency, newPair] = typeof router.query.symbol === "string"
                ? router.query.symbol.split("_")
                : [];
            setCurrency(newCurrency);
            setPair(newPair);
        }
    }, [router.query.symbol]);
    const updateItems = (message) => {
        Object.keys(message).forEach((symbol) => {
            const update = message[symbol];
            if (update.last !== undefined && update.change !== undefined) {
                const precision = getPrecisionBySymbol(symbol);
                setPriceChangeData(symbol, update.last.toFixed(precision.price), update.change.toFixed(2));
            }
        });
    };
    const debouncedFetchData = (0, lodash_1.debounce)(fetchData, 100);
    const fetchTickers = async () => {
        const { data, error } = await (0, api_1.default)({
            url: "/api/exchange/ticker",
            silent: true,
        });
        if (!error) {
            updateItems(data);
        }
        setTickersFetched(true);
    };
    const debouncedFetchTickers = (0, lodash_1.debounce)(fetchTickers, 100);
    (0, react_1.useEffect)(() => {
        if (router.isReady && currency && pair) {
            debouncedFetchData({ currency, pair });
            debouncedFetchTickers();
            return () => {
                setTickersFetched(false);
            };
        }
    }, [router.isReady, currency, pair]);
    (0, react_1.useEffect)(() => {
        if (router.isReady && market) {
            const path = `/api/exchange/market`;
            createConnection("tradesConnection", path);
            return () => {
                if (!router.query.symbol) {
                    removeConnection("tradesConnection");
                }
            };
        }
    }, [router.isReady, market === null || market === void 0 ? void 0 : market.symbol]);
    const [tickersConnected, setTickersConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (tickersFetched) {
            createConnection("tickersConnection", "/api/exchange/ticker", {
                onOpen: () => {
                    subscribe("tickersConnection", "tickers");
                },
            });
            setTickersConnected(true);
            return () => {
                unsubscribe("tickersConnection", "tickers");
            };
        }
    }, [tickersFetched]);
    const handleTickerMessage = (message) => {
        const { data } = message;
        if (!data)
            return;
        updateItems(data);
    };
    const messageFilter = (message) => message.stream && message.stream === "tickers";
    (0, react_1.useEffect)(() => {
        if (tickersConnected) {
            addMessageHandler("tickersConnection", handleTickerMessage, messageFilter);
            return () => {
                removeMessageHandler("tickersConnection", handleTickerMessage);
            };
        }
    }, [tickersConnected]);
    const balance = isPractice
        ? getPracticeBalance(market === null || market === void 0 ? void 0 : market.currency, market === null || market === void 0 ? void 0 : market.pair)
        : wallet === null || wallet === void 0 ? void 0 : wallet.balance;
    const handleResetBalance = () => {
        if (isPractice && (market === null || market === void 0 ? void 0 : market.currency) && (market === null || market === void 0 ? void 0 : market.pair)) {
            setPracticeBalance(market.currency, market.pair, 10000);
        }
    };
    return (<div className="h-full max-h-[120px] p-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <link_1.default className="relative hidden sm:flex shrink-0 grow-0 items-center rounded-[.52rem] px-3 py-2 no-underline transition-all duration-300" href="/">
          <LogoText_1.default className={`max-w-[100px] text-muted-900 dark:text-white`}/>
        </link_1.default>
        <link_1.default href={"/user"}>
          <IconButton_1.default shape="rounded-sm" color="muted">
            <react_2.Icon icon="line-md:chevron-left" className="h-5 w-5"/>
          </IconButton_1.default>
        </link_1.default>
        <Dropdown_1.default title={t("Markets")} indicator={false} toggleButton={<>
              {currency}/{pair}
            </>} toggleClassNames="border-muted-200 dark:border-transparent shadow-lg shadow-muted-300/30 dark:shadow-muted-800/30 dark:hover:bg-muted-900 border dark:hover:border-muted-800 rounded-full" width={300} shape="straight" toggleShape="rounded-sm">
          <div className="w-full h-full min-h-[40vh] min-w-[300px]">
            <div className="flex w-full h-[40vh] gap-2">
              <div className="bg-muted-200 dark:bg-muted-800 h-full mt-1 max-h-[40vh] overflow-y-auto slimscroll">
                <MarketTab_1.MarketTab />
              </div>
              <div className="w-full h-full flex flex-col pe-2">
                <SearchBar_1.SearchBar />
                <div className="max-h-[40vh] overflow-y-auto slimscroll">
                  <MarketList_1.MarketList type="binary"/>
                </div>
              </div>
            </div>
          </div>
        </Dropdown_1.default>
        {/* <Ticker /> */}
      </div>
      <div className="flex items-center gap-2">
        <Card_1.default className={`p-[7px] ms-2 px-3 me-0 sm:me-2 text-sm sm:text-md flex gap-2 ${isPractice ? "text-warning-500" : "text-success-500"}`} shape={"rounded-sm"}>
          {(0, format_1.formatBalance)(balance, getPrecision("price")) || 0}
          <span className="hidden sm:block">{pair}</span>
        </Card_1.default>
        {!isPractice && (<ButtonLink_1.default href={(profile === null || profile === void 0 ? void 0 : profile.id)
                ? "/user/wallet/deposit"
                : "/login?return=/user/wallet/deposit"} color="success" size="md" shape={"rounded-sm"}>
            {t("Deposit")}
          </ButtonLink_1.default>)}
        {isPractice && balance === 0 && (<Button_1.default onClick={handleResetBalance} color="primary" size="md" shape={"rounded-sm"}>
            {t("Reload")}
          </Button_1.default>)}
        <div>
          <ThemeSwitcher_1.default />
        </div>

        <div className="hidden sm:flex">
          <AccountDropdown_1.AccountDropdown />
        </div>
      </div>
    </div>);
};
exports.BinaryNav = (0, react_1.memo)(BinaryNavBase);
