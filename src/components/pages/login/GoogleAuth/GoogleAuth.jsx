"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuth = void 0;
const react_1 = require("react");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const useGoogleAuth_1 = require("@/hooks/useGoogleAuth");
const login_1 = require("@/stores/auth/login");
const GoogleAuthBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { handleGoogleLogin } = (0, useGoogleAuth_1.useGoogleAuth)();
    const { loading } = (0, login_1.useLoginStore)();
    return (<div>
      <Button_1.default type="button" size="md" className="w-full" onClick={() => handleGoogleLogin()} loading={loading} disabled={loading}>
        <react_2.Icon icon="logos:google-icon" className="me-1 h-4 w-4"/>
        <span>{t("Sign in with Google")}</span>
      </Button_1.default>
    </div>);
};
exports.GoogleAuth = (0, react_1.memo)(GoogleAuthBase);
