"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDarkBackground = exports.waitForElement = exports.getElementProperty = exports.cleanHTMLElement = exports.transferLabelInnerText = exports.cleanHTMLAttrs = void 0;
const cleanHTMLClasses = (classNames) => {
    if (typeof classNames === "string" || classNames instanceof String)
        return classNames;
    else if (Array.isArray(classNames) || classNames instanceof Array)
        return classNames.join(" ");
    else
        return "";
};
const cleanHTMLAttrs = (attrs) => {
    if (!attrs)
        return {};
    const mapped = Object.keys(attrs).reduce((acc, key) => {
        switch (key) {
            case "class":
                break; // skip class attribute
            case "checked":
                acc["checkeddefault"] = attrs[key];
                break;
            case "for":
                acc["htmlFor"] = attrs[key];
                break;
            case "autocomplete":
                acc["autoComplete"] = attrs[key];
                break;
            case "tabindex":
                acc["tabIndex"] = attrs[key];
                break;
            default:
                acc[key] = attrs[key];
        }
        return acc;
    }, {});
    return mapped;
};
exports.cleanHTMLAttrs = cleanHTMLAttrs;
const deepCloneNode = (node) => {
    return {
        ...node,
        attrs: { ...node.attrs },
        childNodes: node.childNodes.map(deepCloneNode),
    };
};
const updateNodeWithLabel = (root, labelFor, labelText) => {
    if (root.attrs && root.attrs["id"] === labelFor && !root.attrs["label"]) {
        root.attrs = { ...root.attrs, label: labelText };
    }
    root.childNodes.forEach((child) => updateNodeWithLabel(child, labelFor, labelText));
};
const transferLabelInnerText = (root) => {
    if (root.tagName === "LABEL" && root.attrs && root.attrs["htmlFor"]) {
        const labelFor = root.attrs["htmlFor"];
        updateNodeWithLabel(root, labelFor, root.innerText);
    }
    root.childNodes.forEach((child) => (0, exports.transferLabelInnerText)(child));
};
exports.transferLabelInnerText = transferLabelInnerText;
// Wrapper function to call transferLabelInnerText for each node
const traverseAndTransfer = (root) => {
    (0, exports.transferLabelInnerText)(root);
};
const cleanHTMLElement = (root) => {
    traverseAndTransfer(root);
    const classNames = cleanHTMLClasses(root === null || root === void 0 ? void 0 : root.classNames);
    return {
        childNodes: root.childNodes.map(exports.cleanHTMLElement),
        attrs: (0, exports.cleanHTMLAttrs)(root.attrs),
        tagName: root.tagName,
        classNames: classNames,
        nodeType: root.nodeType,
        innerText: root.innerText,
        constructor: root.constructor.name,
    };
};
exports.cleanHTMLElement = cleanHTMLElement;
const getElementProperty = (element, property, defaultValue) => {
    const value = window.getComputedStyle(element)[property];
    if (value !== defaultValue)
        return value;
    else if (!element || element.childNodes.length === 0)
        return defaultValue;
    else
        return (0, exports.getElementProperty)(element === null || element === void 0 ? void 0 : element.childNodes[0], property, defaultValue);
};
exports.getElementProperty = getElementProperty;
const waitForElement = (target, selector) => {
    return new Promise((r) => {
        const e = target.querySelector(selector);
        if (e)
            return r(e);
        const observer = new MutationObserver(async (m) => {
            const e = target.querySelector(selector);
            await new Promise((r) => setTimeout(r, 100)); // hack to wait for computed styles
            if (e) {
                r(e);
                observer.disconnect();
            }
        });
        observer.observe(target, { childList: true, subtree: true });
    });
};
exports.waitForElement = waitForElement;
const isDarkBackground = (bgColor) => {
    const [r, g, b] = bgColor
        .match(/\(([^()]+)\)/)[1]
        .split(",")
        .map((v) => parseInt(v));
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp < 127.5;
};
exports.isDarkBackground = isDarkBackground;
