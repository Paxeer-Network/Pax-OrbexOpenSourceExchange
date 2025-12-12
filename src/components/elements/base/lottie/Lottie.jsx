"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lottie = void 0;
const react_1 = require("react");
const react_player_1 = require("@dotlottie/react-player");
require("@dotlottie/react-player/dist/index.css");
const dashboard_1 = require("@/stores/dashboard");
const LottieBase = ({ category, path, height, width, classNames, max, }) => {
    const { settings } = (0, dashboard_1.useDashboardStore)();
    const styles = {
        height,
        width,
    };
    const randomUrl = `/img/lottie/${category ? `${category}/` : ""}${path}${max ? `-${Math.floor(Math.random() * max) + 1}` : ""}.lottie`;
    if ((settings === null || settings === void 0 ? void 0 : settings.lottieAnimationStatus) !== "true")
        return null;
    return (<div>
      <react_player_1.DotLottiePlayer src={randomUrl} style={styles} className={`${classNames}`} autoplay loop/>
    </div>);
};
exports.Lottie = (0, react_1.memo)(LottieBase);
