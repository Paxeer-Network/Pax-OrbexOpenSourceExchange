"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositConfirmed = void 0;
const react_1 = require("react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const deposit_1 = require("@/stores/user/wallet/deposit");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const DepositConfirmedBase = ({}) => {
    var _a, _b, _c, _d;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { deposit, clearAll } = (0, deposit_1.useDepositStore)();
    const router = (0, router_1.useRouter)();
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Looks like you're all set")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Thank you for using our service. You can now start using your wallet.")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-8 pb-8">
        <Card_1.default color="contrast" className="p-6 text-center font-sans">
          <IconBox_1.default icon="ph:check-circle-duotone" variant="pastel" color={(deposit === null || deposit === void 0 ? void 0 : deposit.balance) ? "success" : "info"} className="mx-auto mb-4" size={"xl"}/>
          <h3 className="mb-1 text-lg font-light text-muted-800 dark:text-muted-100">
            {t("Congratulations")}
          </h3>
          <p className="text-sm text-muted-500 dark:text-muted-400">
            {((_a = deposit.transaction) === null || _a === void 0 ? void 0 : _a.status) === "COMPLETED" ? (<>
                {t("Great, you've sucessfully deposited")}{" "}
                {(_b = deposit === null || deposit === void 0 ? void 0 : deposit.transaction) === null || _b === void 0 ? void 0 : _b.amount} {deposit === null || deposit === void 0 ? void 0 : deposit.currency}{" "}
                {t("to your wallet using")}{" "}
                {deposit === null || deposit === void 0 ? void 0 : deposit.method}. {t("Your new balance is")} {deposit === null || deposit === void 0 ? void 0 : deposit.balance}{" "}
                {deposit === null || deposit === void 0 ? void 0 : deposit.currency}
              </>) : ((_c = deposit.transaction) === null || _c === void 0 ? void 0 : _c.status) === "PENDING" ? (<>
                {t("Your deposit of")}{" "}
                {(_d = deposit === null || deposit === void 0 ? void 0 : deposit.transaction) === null || _d === void 0 ? void 0 : _d.amount} {deposit === null || deposit === void 0 ? void 0 : deposit.currency}{" "}
                {t("is currently pending. You will receive an email once the transaction is completed.")}
              </>) : (<>
                {t("Your deposit has been processed. However, it seems there was an issue with the transaction. Please contact support for further assistance.")}
              </>)}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button_1.default color="primary" className="w-full" onClick={async () => {
            clearAll();
            router.push("/user/wallet");
        }}>
              {t("Go to Wallet")}
            </Button_1.default>
          </div>
        </Card_1.default>
      </div>
    </div>);
};
exports.DepositConfirmed = (0, react_1.memo)(DepositConfirmedBase);
