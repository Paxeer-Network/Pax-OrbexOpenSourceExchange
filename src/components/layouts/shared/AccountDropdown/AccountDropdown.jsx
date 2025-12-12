"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDropdown = void 0;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const MashImage_1 = require("@/components/elements/MashImage");
const Dropdown_1 = __importDefault(require("@/components/elements/base/dropdown/Dropdown"));
const react_2 = require("@iconify/react");
const useLogout_1 = require("@/hooks/useLogout");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const AccountDropdownBase = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const logout = (0, useLogout_1.useLogout)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    if (!profile) {
        return (<>
        <link_1.default href="/login">
          <Button_1.default color="primary" shape="rounded-sm" variant="outlined">
            <react_2.Icon icon="material-symbols-light:login-outline" className="h-5 w-5 me-1"/>
            {t("Login")}
          </Button_1.default>
        </link_1.default>
        <link_1.default href="/register">
          <Button_1.default shape="rounded-sm" variant="outlined" color="muted">
            <react_2.Icon icon="bx:bxs-user-plus" className="h-5 w-5 me-1"/>
            {t("Register")}
          </Button_1.default>
        </link_1.default>
      </>);
    }
    return (<Dropdown_1.default title={t("My Account")} orientation="end" indicator={false} toggleImage={<MashImage_1.MashImage src={(profile === null || profile === void 0 ? void 0 : profile.avatar) || `/img/avatars/placeholder.webp`} height={350} width={350} alt=""/>}>
      <link_1.default href="/user/wallet" className="group mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800">
        <react_2.Icon icon="ph:wallet" className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"/>
        <div className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("Assets")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("View your assets")}
          </span>
        </div>
      </link_1.default>
      <link_1.default href="/user/profile" className="group mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800">
        <react_2.Icon icon="ph:user-circle-duotone" className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"/>
        <div className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("Profile")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("View your profile")}
          </span>
        </div>
      </link_1.default>
      {/* api management */}
      <link_1.default href="/user/api" className="group mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800">
        <react_2.Icon icon="carbon:api" className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"/>
        <div className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("API Management")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("Manage your API keys")}
          </span>
        </div>
      </link_1.default>
      <button onClick={logout} type="button" name="logout" aria-label="Logout" className="group mx-2 flex w-[calc(100%_-_1rem)] cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-start transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800">
        <react_2.Icon icon="ph:lock-duotone" className="h-5 w-5 stroke-muted-400 text-muted-400 transition-colors duration-300 dark:group-hover:stroke-primary-500 dark:group-hover:text-primary-500"/>
        <span className="option-content flex flex-col">
          <span className="block font-sans text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
            {t("Logout")}
          </span>
          <span className="block font-sans text-xs leading-tight text-muted-400">
            {t("Logout from account")}
          </span>
        </span>
      </button>
    </Dropdown_1.default>);
};
exports.AccountDropdown = AccountDropdownBase;
