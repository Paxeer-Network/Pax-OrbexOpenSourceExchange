"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementDimensions = exports.pxToPercent = exports.percentToPx = exports.isPercentage = void 0;
const isPercentage = (val) => typeof val === "string" && val.indexOf("%") > -1;
exports.isPercentage = isPercentage;
const percentToPx = (value, comparativeValue) => {
    if (typeof value !== "string")
        return value;
    if (value.indexOf("px") > -1 || value === "auto" || !comparativeValue) {
        return value;
    }
    const percent = parseInt(value);
    return (percent / 100) * comparativeValue + "px";
};
exports.percentToPx = percentToPx;
const pxToPercent = (value, comparativeValue) => {
    if (typeof value !== "number" || !comparativeValue)
        return value;
    const val = (Math.abs(value) / comparativeValue) * 100;
    return value < 0 ? -1 * val : Math.round(val);
};
exports.pxToPercent = pxToPercent;
const getElementDimensions = (element) => {
    const computedStyle = getComputedStyle(element);
    let height = element.clientHeight, width = element.clientWidth; // width with padding
    height -=
        parseFloat(computedStyle.paddingTop) +
            parseFloat(computedStyle.paddingBottom);
    width -=
        parseFloat(computedStyle.paddingLeft) +
            parseFloat(computedStyle.paddingRight);
    return {
        width,
        height,
    };
};
exports.getElementDimensions = getElementDimensions;
