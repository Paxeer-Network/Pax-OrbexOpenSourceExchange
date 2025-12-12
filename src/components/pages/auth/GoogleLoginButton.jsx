"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const google_1 = require("@react-oauth/google");
const react_2 = require("@iconify/react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const GoogleLoginButton = ({ onSuccess, onError, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const handleGoogleLogin = (0, google_1.useGoogleLogin)({
        onSuccess,
        onError,
    });
    return (<>
      <div>
        <Button_1.default type="button" size="md" className="w-full" onClick={() => handleGoogleLogin()}>
          <react_2.Icon icon="logos:google-icon" className="me-1 h-4 w-4"/>
          <span>{t("Sign up with Google")}</span>
        </Button_1.default>
      </div>
      <div className="relative">
        <hr className="my-8 w-full border-muted-300 dark:border-muted-800"/>
        <div className="absolute inset-x-0 -top-3 mx-auto text-center">
          <span className="bg-white px-4 py-1 font-sans text-sm text-muted-400 dark:bg-muted-900">
            {t("or signup with email")}
          </span>
        </div>
      </div>
    </>);
};
exports.default = GoogleLoginButton;
