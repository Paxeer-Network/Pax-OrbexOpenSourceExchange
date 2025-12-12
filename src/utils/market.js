"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTickers = exports.formatLargeNumber = void 0;
const formatLargeNumber = (num, precision = null) => {
    const parsedNum = typeof num === "number" ? num : parseFloat(num);
    if (isNaN(parsedNum))
        return "0";
    if (parsedNum >= 1000000000) {
        return (parsedNum / 1000000000).toFixed(2) + "B";
    }
    else if (parsedNum >= 1000000) {
        return (parsedNum / 1000000).toFixed(2) + "M";
    }
    else if (parsedNum >= 1000) {
        return (parsedNum / 1000).toFixed(2) + "K";
    }
    else if (parsedNum >= 1) {
        return parsedNum.toFixed(2);
    }
    else {
        if (precision !== null) {
            return parsedNum.toFixed(precision);
        }
        return parsedNum.toString();
    }
};
exports.formatLargeNumber = formatLargeNumber;
const transformTickers = (data) => {
    return Object.entries(data).map(([symbol, ticker]) => {
        var _a;
        return ({
            currency: symbol.split("/")[0],
            pair: symbol.split("/")[1],
            name: symbol,
            price: ticker.last,
            change: (_a = ticker.change) === null || _a === void 0 ? void 0 : _a.toFixed(2),
            baseVolume: (0, exports.formatLargeNumber)(ticker.baseVolume),
            quoteVolume: (0, exports.formatLargeNumber)(ticker.quoteVolume),
        });
    });
};
exports.transformTickers = transformTickers;
