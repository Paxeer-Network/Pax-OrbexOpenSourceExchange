"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const ClientTime_1 = require("./ClientTime");
const OrderAmountAndExpiration = ({ amount, setAmount, balance, minAmount, maxAmount, expiry, isModalOpen, setIsModalOpen, t = (key) => key, }) => {
    return (<div className="flex md:flex-col gap-3 items-end">
      <div className="w-full">
        <Input_1.default type="number" label={t("Amount")} value={amount} shape={"rounded-sm"} onChange={(e) => setAmount(Number(e.target.value))} min={minAmount} max={maxAmount} step={minAmount} disabled={balance <= 0}/>
      </div>

      <div className="relative w-full">
        <label className="font-sans text-[.68rem] text-muted-400">
          {t("Expiration")}
        </label>
        <button type="button" className="w-full text-left p-2 border text-sm rounded-md bg-white dark:bg-muted-800 border-muted-200 dark:border-muted-700 text-muted-700 dark:text-muted-200" onClick={() => setIsModalOpen(!isModalOpen)}>
          <ClientTime_1.ClientTime expiry={expiry}/>
        </button>
      </div>
    </div>);
};
exports.default = OrderAmountAndExpiration;
