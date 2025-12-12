"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = exports.groupByTicketSize = exports.groupByPrice = exports.roundToNearest = exports.ORDERBOOK_LEVELS = exports.MOBILE_WIDTH = void 0;
exports.MOBILE_WIDTH = 800; // px
exports.ORDERBOOK_LEVELS = 25; // rows count
/**
 * Returns the number rounded to the nearest interval.
 * Example:
 *
 *   roundToNearest(1000.5, 1); // 1000
 *   roundToNearest(1000.5, 0.5);  // 1000.5
 *
 * @param {number} value    The number to round
 * @param {number} interval The numeric interval to round to
 * @return {number}
 */
const roundToNearest = (value, interval) => {
    return Math.floor(value / interval) * interval;
};
exports.roundToNearest = roundToNearest;
/**
 * Groups price levels by their price
 * Example:
 *
 *  groupByPrice([ [1000, 100], [1000, 200], [993, 20] ]) // [ [ 1000, 300 ], [ 993, 20 ] ]
 *
 * @param levels
 */
const groupByPrice = (levels) => {
    return levels
        .map((level, idx) => {
        const nextLevel = levels[idx + 1];
        const prevLevel = levels[idx - 1];
        if (nextLevel && level[0] === nextLevel[0]) {
            return [level[0], level[1] + nextLevel[1]];
        }
        else if (prevLevel && level[0] === prevLevel[0]) {
            return [];
        }
        else {
            return level;
        }
    })
        .filter((level) => level.length > 0);
};
exports.groupByPrice = groupByPrice;
/**
 * Group price levels by given ticket size. Uses groupByPrice() and roundToNearest()
 * Example:
 *
 * groupByTicketSize([ [1000.5, 100], [1000, 200], [993, 20] ], 1) // [[1000, 300], [993, 20]]
 *
 * @param levels
 * @param ticketSize
 */
const groupByTicketSize = (levels, ticketSize) => {
    return (0, exports.groupByPrice)(levels.map((level) => [(0, exports.roundToNearest)(level[0], ticketSize), level[1]]));
};
exports.groupByTicketSize = groupByTicketSize;
const formatNumber = (arg) => {
    return new Intl.NumberFormat("en-US").format(arg);
};
exports.formatNumber = formatNumber;
