"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectTransferType = void 0;
const react_1 = require("react");
const Listbox_1 = __importDefault(require("@/components/elements/form/listbox/Listbox"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const transfer_1 = require("@/stores/user/wallet/transfer");
const next_i18next_1 = require("next-i18next");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const link_1 = __importDefault(require("next/link"));
const SelectTransferTypeBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { setStep, setTransferType, transferType, setClientId } = (0, transfer_1.useTransferStore)();
    const transferTypes = [
        { value: "client", label: "Transfer to Client Wallet" },
        { value: "wallet", label: "Transfer Between Wallets" },
    ];
    const [selectedTransferType, setSelectedTransferType] = (0, react_1.useState)(transferType);
    const [clientId, setLocalClientId] = (0, react_1.useState)("");
    const handleContinue = () => {
        setTransferType(selectedTransferType);
        if (selectedTransferType.value === "client") {
            setClientId(clientId);
        }
        setStep(2);
    };
    return (<div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select Transfer Type")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Choose the type of transfer you want to make")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded-sm px-8 pb-8">
        <Listbox_1.default selected={selectedTransferType} options={transferTypes} setSelected={setSelectedTransferType}/>
        {selectedTransferType.value === "client" && (<div className="mt-4">
            <Input_1.default type="text" value={clientId} placeholder={t("Enter Client ID")} label={t("Client ID")} required onChange={(e) => setLocalClientId(e.target.value)}/>
          </div>)}
        <div className="mt-6">
          <Button_1.default type="button" color="primary" size="lg" className="w-full" onClick={handleContinue} disabled={selectedTransferType.value === "client" && clientId === ""}>
            {t("Continue")}
            <react_2.Icon icon="mdi:chevron-right" className="h-5 w-5"/>
          </Button_1.default>
        </div>
        <hr className="my-6 border-t border-muted-200 dark:border-muted-800"/>
        <div className="text-center">
          <p className="mt-8 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
            <span>{t("Having any trouble")}</span>
            <link_1.default href="#" className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-hidden">
              {t("Contact us")}
            </link_1.default>
          </p>
        </div>
      </div>
    </div>);
};
exports.SelectTransferType = (0, react_1.memo)(SelectTransferTypeBase);
