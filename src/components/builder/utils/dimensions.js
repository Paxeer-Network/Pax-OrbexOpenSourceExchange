"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementDimensions = exports.pxToPercent = exports.percentToPx = exports.isPercentage = void 0;
const isPercentage = (val) => typeof val === 'string' && val.indexOf('%') > -1;
exports.isPercentage = isPercentage;
const percentToPx = (value, comparativeValue) => {
    if (value.indexOf('px') > -1 || value === 'auto' || !comparativeValue)
        return value;
    const percent = parseInt(value);
    return (percent / 100) * comparativeValue + 'px';
};
exports.percentToPx = percentToPx;
const pxToPercent = (value, comparativeValue) => {
    const val = (Math.abs(value) / comparativeValue) * 100;
    if (value < 0)
        return -1 * val;
    else
        return Math.round(val);
};
exports.pxToPercent = pxToPercent;
const getElementDimensions = (element) => {
    const computedStyle = getComputedStyle(element);
    let height = element.clientHeight;
    height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    let width = element.clientWidth; // width with padding
    width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    return { width, height };
};
exports.getElementDimensions = getElementDimensions;
