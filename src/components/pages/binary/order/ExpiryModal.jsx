"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const portal_1 = __importDefault(require("@/components/elements/portal"));
const ExpiryModal = ({ expirations, expiry, setExpiry, setIsModalOpen, formatTime, t, }) => {
    return (<portal_1.default onClose={() => setIsModalOpen(false)}>
      <Card_1.default className="max-w-md p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-muted-700 dark:text-muted-300">
            {t("Expiry Time")}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {expirations.map((exp) => {
            const timeLeft = Math.round((exp.expirationTime.getTime() - Date.now()) / 1000);
            const isDisabled = timeLeft < 50;
            return (<button key={exp.minutes} type="button" className={`w-full flex justify-between min-w-64 text-left p-2 mb-2 text-md border rounded transition-colors ${isDisabled
                    ? "text-danger-500 border-danger-500 cursor-not-allowed dark:text-danger-500 dark:border-danger-500"
                    : "hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-200 border-muted-200 dark:border-muted-700"} ${expiry.minutes === exp.minutes
                    ? "bg-muted-200 dark:bg-muted-700"
                    : ""}`} onClick={() => {
                    if (!isDisabled) {
                        setExpiry(exp);
                        setIsModalOpen(false);
                    }
                }} disabled={isDisabled}>
                <span>
                  {exp.minutes} {t("min")}
                </span>
                <span>({formatTime(timeLeft)})</span>
              </button>);
        })}
        </div>
      </Card_1.default>
    </portal_1.default>);
};
exports.default = ExpiryModal;
