"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferConfirmed = void 0;
const react_1 = require("react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const transfer_1 = require("@/stores/user/wallet/transfer");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const router_1 = require("next/router");
const next_i18next_1 = require("next-i18next");
const TransferConfirmedBase = () => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { transfer, clearAll } = (0, transfer_1.useTransferStore)();
    const router = (0, router_1.useRouter)();
    const transferMessage = () => {
        var _a, _b, _c;
        if (!transfer || !transfer.fromTransfer)
            return "";
        if (transfer.fromTransfer.status === "COMPLETED") {
            return transfer.transferType === "client" ? (<>
          {t("Great, you've successfully transferred")}{" "}
          {(_a = transfer === null || transfer === void 0 ? void 0 : transfer.fromTransfer) === null || _a === void 0 ? void 0 : _a.amount} {transfer === null || transfer === void 0 ? void 0 : transfer.fromCurrency}{" "}
          {t("from your")} {transfer === null || transfer === void 0 ? void 0 : transfer.fromType} {t("wallet to the client's")}{" "}
          {transfer === null || transfer === void 0 ? void 0 : transfer.toType} {t("wallet")}.
        </>) : (<>
          {t("Great, you've successfully transferred")}{" "}
          {(_b = transfer === null || transfer === void 0 ? void 0 : transfer.fromTransfer) === null || _b === void 0 ? void 0 : _b.amount} {transfer === null || transfer === void 0 ? void 0 : transfer.fromCurrency}{" "}
          {t("from your")} {transfer === null || transfer === void 0 ? void 0 : transfer.fromType} {t("wallet to your")}{" "}
          {transfer === null || transfer === void 0 ? void 0 : transfer.toType} {t("wallet")}. {t("Your new balance is")}{" "}
          {transfer === null || transfer === void 0 ? void 0 : transfer.fromBalance} {transfer === null || transfer === void 0 ? void 0 : transfer.fromCurrency}.
        </>);
        }
        if (transfer.fromTransfer.status === "PENDING") {
            return (<>
          {t("Your transfer of")} {(_c = transfer === null || transfer === void 0 ? void 0 : transfer.fromTransfer) === null || _c === void 0 ? void 0 : _c.amount}{" "}
          {transfer === null || transfer === void 0 ? void 0 : transfer.fromCurrency} {t("from your")} {transfer === null || transfer === void 0 ? void 0 : transfer.fromType}{" "}
          {t("wallet to your")} {transfer === null || transfer === void 0 ? void 0 : transfer.toType}{" "}
          {t("wallet is currently pending. You will receive an email once the transaction is completed.")}
          .
        </>);
        }
        return (<>
        {t("Your transfer has been processed. However, it seems there was an issue with the transaction. Please contact support for further assistance.")}
        .
      </>);
    };
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
          <IconBox_1.default icon="ph:check-circle-duotone" variant="pastel" color={((_a = transfer.fromTransfer) === null || _a === void 0 ? void 0 : _a.status) === "COMPLETED" ? "success" : "info"} className="mx-auto mb-4" size={"xl"}/>
          <h3 className="mb-1 text-lg font-light text-muted-800 dark:text-muted-100">
            {t("Congratulations")}
          </h3>
          <p className="text-sm text-muted-500 dark:text-muted-400">
            {transferMessage()}
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
exports.TransferConfirmed = (0, react_1.memo)(TransferConfirmedBase);
