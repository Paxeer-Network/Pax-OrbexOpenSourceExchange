"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const date_fns_1 = require("date-fns");
const Countdown = ({ startDate, endDate, onExpire, }) => {
    const [time, setTime] = (0, react_1.useState)({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isStarted: false,
    });
    (0, react_1.useEffect)(() => {
        const updateCountdown = () => {
            const now = new Date();
            const start = (0, date_fns_1.parseISO)(startDate);
            const end = (0, date_fns_1.parseISO)(endDate);
            const isStarted = now >= start;
            const targetDate = isStarted ? end : start;
            const timeRemaining = (0, date_fns_1.differenceInSeconds)(targetDate, now);
            if (timeRemaining < 0) {
                if (onExpire)
                    onExpire();
                return;
            }
            const days = Math.floor(timeRemaining / (60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
            const seconds = timeRemaining % 60;
            setTime({ days, hours, minutes, seconds, isStarted });
        };
        const intervalId = setInterval(updateCountdown, 1000);
        updateCountdown();
        return () => clearInterval(intervalId);
    }, [startDate, endDate, onExpire]);
    return (<div className="countdown">
      {time.isStarted ? (<span>
          Ends in {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
        </span>) : (<span>
          Starts in {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
        </span>)}
    </div>);
};
exports.default = Countdown;
