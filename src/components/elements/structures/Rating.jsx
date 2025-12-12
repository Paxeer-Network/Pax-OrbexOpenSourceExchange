"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const Rating = ({ rating }) => {
    // Calculate the number of full and half stars needed
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    // Generate the stars for the rating
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<react_2.Icon key={`full-${i}`} icon="uim:star" className="h-4 w-4 text-yellow-400"/>);
    }
    if (halfStar) {
        stars.push(<react_2.Icon key="half" icon="uim:star-half-alt" className="h-4 w-4 text-yellow-400"/>);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<react_2.Icon key={`empty-${i}`} icon="uim:star" className="h-4 w-4 text-muted-300 dark:text-muted-700"/>);
    }
    return <div className="flex items-center">{stars}</div>;
};
exports.default = Rating;
