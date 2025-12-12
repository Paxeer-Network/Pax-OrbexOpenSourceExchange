"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositAddress = void 0;
const react_1 = require("react");
const react_2 = require("react");
const Typewriter_1 = __importDefault(require("@/components/ui/Typewriter"));
const qrcode_react_1 = require("qrcode.react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_3 = require("@iconify/react");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const deposit_1 = require("@/stores/user/wallet/deposit");
const next_i18next_1 = require("next-i18next");
const sonner_1 = require("sonner");
const DepositAddressBase = ({}) => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { setSelectedDepositMethod, depositAddress, selectedDepositMethod, setStep, transactionHash, setTransactionHash, sendTransactionHash, loading, unlockAddress, contractType, } = (0, deposit_1.useDepositStore)();
    const copyToClipboard = () => {
        if (depositAddress === null || depositAddress === void 0 ? void 0 : depositAddress.address) {
            navigator.clipboard.writeText(depositAddress.address);
            sonner_1.toast.success(t("Address copied to clipboard!"));
        }
    };
    (0, react_1.useEffect)(() => {
        const handleBeforeUnload = (event) => {
            if (loading) {
                event.preventDefault();
                event.returnValue = t("Please do not close this page until the verification is complete.");
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [loading, t]);
    if (loading) {
        return (<div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <react_3.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
          <p className="text-xl text-primary-500">
            {t("Processing payment...")}
          </p>
          <p className="text-sm text-primary-500">
            {t("Please do not close this page until the verification is complete.")}
          </p>
        </div>
      </div>);
    }
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Deposit Address")}
        </h2>
        <p className="text-sm text-muted-400 px-5">
          {t("Please send the amount to the following address in")}{" "}
          <span className="text-primary-500 font-bold">
            {selectedDepositMethod}
          </span>{" "}
          {t("network")}{" "}
          {(depositAddress === null || depositAddress === void 0 ? void 0 : depositAddress.trx) &&
            `and enter the transaction hash below to complete the deposit.
          Please note that the transaction hash is required for us to verify
          your deposit.`}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-8 pb-8">
        <div className="flex flex-col items-center justify-center gap-5">
          <Typewriter_1.default className="hidden sm:flex flex-start text-muted-800 dark:text-muted-200">
            {depositAddress === null || depositAddress === void 0 ? void 0 : depositAddress.address}
          </Typewriter_1.default>
          <Button_1.default type="button" onClick={copyToClipboard} color={"info"}>
            <react_3.Icon icon="mdi:content-copy" className="h-5 w-5"/>
            {t("Copy Address")}
          </Button_1.default>
          <Input_1.default className="flex sm:hidden" readOnly value={depositAddress === null || depositAddress === void 0 ? void 0 : depositAddress.address}/>
          <div className="bg-white p-5">
            <qrcode_react_1.QRCodeSVG value={depositAddress === null || depositAddress === void 0 ? void 0 : depositAddress.address} size={128} level={"H"}/>
          </div>
          {((_a = depositAddress === null || depositAddress === void 0 ? void 0 : depositAddress.info) === null || _a === void 0 ? void 0 : _a.tag) && (<div className="text-muted-400 text-sm">
              {t("Tag")} {depositAddress.info.tag}
            </div>)}
        </div>
        {depositAddress.trx && (<>
            <Input_1.default value={transactionHash} placeholder={t("Enter transaction hash")} label={t("Transaction Hash")} className="w-full" required onChange={(e) => {
                setTransactionHash(e.target.value);
            }}/>
          </>)}

        <div className="mt-6">
          <div className="flex w-full gap-4 justify-center">
            <Button_1.default type="button" size="lg" className="w-full" onClick={async () => {
            if (contractType === "NO_PERMIT")
                await unlockAddress(depositAddress.address);
            setSelectedDepositMethod(null, null);
            setStep(3);
        }}>
              <react_3.Icon icon="mdi:chevron-left" className="h-5 w-5"/>
              {t("Go Back")}
            </Button_1.default>
            {depositAddress.trx && (<Button_1.default type="button" size="lg" className="w-full" onClick={async () => {
                sendTransactionHash();
                if (contractType === "NO_PERMIT")
                    await unlockAddress(depositAddress.address);
            }} disabled={transactionHash === ""} color="primary">
                {t("Deposit")}
              </Button_1.default>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.DepositAddress = (0, react_2.memo)(DepositAddressBase);
