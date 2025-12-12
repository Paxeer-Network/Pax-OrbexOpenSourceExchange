"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const react_2 = require("@iconify/react");
const OrderActionButtons = ({ profile, loading, canPlaceOrder, handlePlaceOrder, t, router, }) => {
    const isLoggedIn = !!(profile === null || profile === void 0 ? void 0 : profile.id);
    return (<div className="flex md:flex-col gap-2 items-center justify-center">
      <div className="w-full">
        <Button_1.default type="button" color={isLoggedIn ? "success" : "muted"} animated={false} shape={"rounded-sm"} className="h-20 w-full" onClick={() => isLoggedIn ? handlePlaceOrder("RISE") : router.push("/login")} loading={loading} disabled={!canPlaceOrder()}>
          {isLoggedIn ? (<span className="text-md flex md:flex-col items-center gap-2 md:gap-0">
              {t("Rise")}
              <react_2.Icon icon="ant-design:rise-outlined" className="h-8 w-8"/>
            </span>) : (<div className="flex gap-2 flex-col">
              <span className="text-warning-500">{t("Log In")}</span>
              <span>{t("or")}</span>
              <span className="text-warning-500">{t("Register Now")}</span>
            </div>)}
        </Button_1.default>
      </div>

      <div className="w-full">
        <Button_1.default type="button" color={isLoggedIn ? "danger" : "muted"} animated={false} shape={"rounded-sm"} className="h-20 w-full" onClick={() => isLoggedIn ? handlePlaceOrder("FALL") : router.push("/login")} loading={loading} disabled={!canPlaceOrder()}>
          {isLoggedIn ? (<span className="text-md flex md:flex-col items-center gap-2">
              {t("Fall")}
              <react_2.Icon icon="ant-design:fall-outlined" className="h-8 w-8"/>
            </span>) : (<div className="flex gap-2 flex-col">
              <span className="text-warning-500">{t("Log In")}</span>
              <span>{t("or")}</span>
              <span className="text-warning-500">{t("Register Now")}</span>
            </div>)}
        </Button_1.default>
      </div>
    </div>);
};
exports.default = OrderActionButtons;
