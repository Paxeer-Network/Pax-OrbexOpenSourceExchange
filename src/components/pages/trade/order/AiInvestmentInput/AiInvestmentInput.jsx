"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiInvestmentInput = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const compactInput_1 = __importDefault(require("@/components/elements/form/input/compactInput"));
const RangeSlider_1 = __importDefault(require("@/components/elements/addons/range-slider/RangeSlider"));
const dashboard_1 = require("@/stores/dashboard");
const order_1 = require("@/stores/trade/order");
const router_1 = require("next/router");
const market_1 = __importDefault(require("@/stores/trade/market"));
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const AiInvestmentInputBase = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { profile, getSetting } = (0, dashboard_1.useDashboardStore)();
    const { market } = (0, market_1.default)();
    const getPrecision = (type) => { var _a; return Number(((_a = market === null || market === void 0 ? void 0 : market.precision) === null || _a === void 0 ? void 0 : _a[type]) || 8); };
    const { loading, aiPlans, placeAiInvestmentOrder, pairBalance } = (0, order_1.useOrderStore)();
    const [selectedDuration, setSelectedDuration] = (0, react_1.useState)(null);
    const [amount, setAmount] = (0, react_1.useState)(0);
    const [percentage, setPercentage] = (0, react_1.useState)(0);
    const [selectedPlanId, setSelectedPlanId] = (0, react_1.useState)(null);
    const [selectedPlan, setSelectedPlan] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (selectedPlanId) {
            setSelectedPlan(aiPlans.find((plan) => plan.id === selectedPlanId.value));
        }
        setPercentage(0);
        setAmount(0);
        setSelectedDuration(null);
    }, [selectedPlanId]);
    const handleSliderChange = (value) => {
        setPercentage(value);
        const total = (pairBalance * value) / 100;
        setAmount(total);
    };
    const handlePlaceInvestment = async () => {
        var _a, _b, _c;
        if (getSetting("aiInvestmentRestrictions") === "true" &&
            (!((_a = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _a === void 0 ? void 0 : _a.status) ||
                (parseFloat(((_b = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _b === void 0 ? void 0 : _b.level) || "0") < 2 &&
                    ((_c = profile === null || profile === void 0 ? void 0 : profile.kyc) === null || _c === void 0 ? void 0 : _c.status) !== "APPROVED"))) {
            await router.push("/user/profile?tab=kyc");
            sonner_1.toast.error(t("Please complete your KYC to invest in AI Bots"));
            return;
        }
        if (!selectedPlanId || !selectedDuration)
            return;
        await placeAiInvestmentOrder(selectedPlanId.value, selectedDuration.value, market, amount);
        setSelectedPlanId(null);
        setSelectedDuration(null);
        setAmount(0);
        setPercentage(0);
        setSelectedPlan(null);
    };
    return (<div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-1 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-muted-400 dark:text-muted-400 text-xs">
              {t("Avbl")} {pairBalance.toFixed(getPrecision("price"))}{" "}
              {market === null || market === void 0 ? void 0 : market.pair}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <Listbox_1.default selected={selectedPlanId} options={aiPlans.map((plan) => ({
            value: plan.id,
            label: plan.title,
        }))} setSelected={setSelectedPlanId} placeholder={t("Select a Plan")} disabled={loading} loading={loading} shape={"rounded-xs"}/>
          <Listbox_1.default selected={selectedDuration} options={(_a = selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.durations) === null || _a === void 0 ? void 0 : _a.map((duration) => ({
            value: duration.id,
            label: `${duration.duration} ${duration.timeframe}`,
        }))} setSelected={setSelectedDuration} placeholder={t("Select a Duration")} disabled={loading || !(selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.durations)} loading={loading} shape={"rounded-xs"}/>
        </div>

        <div className="flex flex-col gap-1">
          <compactInput_1.default type="number" className="input" placeholder="0.0" label={t("Amount")} postLabel={market === null || market === void 0 ? void 0 : market.pair} shape={"rounded-xs"} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} min={selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.minAmount} max={selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.maxAmount} disabled={loading || !selectedPlan} loading={loading}/>
        </div>
        <div className="text-xs text-muted-400 dark:text-muted-400 flex justify-between gap-5">
          <p>
            {t("Min Amount")}: {selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.minAmount}
          </p>
          <p>
            {t("Max Amount")}: {selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.maxAmount}
          </p>
        </div>
        <div className="mt-2 mb-3">
          <RangeSlider_1.default legend min={0} max={100} steps={[0, 25, 50, 75, 100]} value={percentage} onSliderChange={handleSliderChange} color="warning"/>
        </div>
      </div>
      {selectedPlan && (<div className="p-3 rounded-xs text-xs mt-2 bg-muted-100 dark:bg-muted-800 text-muted-400 dark:text-muted-400">
          {selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.description}
          <div className="mt-2">
            <p className="text-success-500">
              {t("ROI")}: {selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.profitPercentage}%
            </p>
          </div>
        </div>)}
      <div className="flex flex-col gap-1 mt-3">
        <Button_1.default type="button" color={(profile === null || profile === void 0 ? void 0 : profile.id) ? "success" : "muted"} animated={false} className="w-full" shape={"rounded-xs"} onClick={() => {
            if (profile === null || profile === void 0 ? void 0 : profile.id) {
                handlePlaceInvestment();
            }
            else {
                router.push("/auth/login");
            }
        }}>
          {(profile === null || profile === void 0 ? void 0 : profile.id) ? ("Invest") : (<div className="flex gap-2">
              <span className="text-warning-500">{t("Log In")}</span>
              <span>{t("or")}</span>
              <span className="text-warning-500">{t("Register Now")}</span>
            </div>)}
        </Button_1.default>
      </div>
    </div>);
};
exports.AiInvestmentInput = (0, react_1.memo)(AiInvestmentInputBase);
