"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutNotPushedClasses = exports.layoutPushedClasses = exports.panelWrapperClasses = exports.layoutWrapperClasses = void 0;
exports.layoutWrapperClasses = {
    "sidebar-panel": "lg:ms-20 lg:w-[calc(100%_-_64px)] pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
    "sidebar-panel-float": "lg:ms-20 lg:w-[calc(100%_-_80px)] pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
    // "sidebar-collapse": "pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
    // sideblock: "pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
    "top-navigation": "pt-16 lg:pt-4 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
};
exports.panelWrapperClasses = {
    "sidebar-panel": "lg:ms-20 lg:w-[calc(100%_-_64px)]",
    "sidebar-panel-float": "lg:ps-20 lg:w-[calc(100%_-_80px)]",
    // "sidebar-collapse": "",
    // sideblock: "",
    "top-navigation": "",
};
exports.layoutPushedClasses = {
    "sidebar-panel": "translate-x-[250px]",
    "sidebar-panel-float": "translate-x-[250px]",
    // "sidebar-collapse": "lg:ms-[224px] lg:w-[calc(100%_-_224px)]",
    // sideblock: "lg:ms-[224px] lg:w-[calc(100%_-_224px)]",
    "top-navigation": "",
};
exports.layoutNotPushedClasses = {
    "sidebar-panel": "",
    "sidebar-panel-float": "",
    // "sidebar-collapse": "lg:ms-[64px] lg:w-[calc(100%_-_64px)]",
    // sideblock: "",
    "top-navigation": "",
};
