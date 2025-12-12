"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterCharts = void 0;
const react_1 = __importDefault(require("react"));
const lodash_1 = require("lodash");
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
require("react-loading-skeleton/dist/skeleton.css");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const link_1 = __importDefault(require("next/link"));
const Tooltip_1 = require("@/components/elements/base/tooltips/Tooltip");
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const react_2 = require("@iconify/react");
const chart_colors_1 = require("@/components/charts/chart-colors");
const FilterChartsBase = ({ availableFilters, filterResults, timeframe, cardName, modelName, timeframes, }) => {
    return (<div className="flex flex-col">
      {Object.keys(availableFilters).map((filterCategory) => {
            const isLastCategory = Object.keys(availableFilters).indexOf(filterCategory) ===
                Object.keys(availableFilters).length;
            return (<div key={filterCategory}>
            {!isLastCategory && (<div className="relative mb-4">
                <hr className="border-muted-200 dark:border-muted-700"/>
                <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
                  <span className="bg-muted-50 dark:bg-muted-900 px-2">
                    {(0, lodash_1.capitalize)(filterCategory)}
                  </span>
                </span>
              </div>)}

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4`}>
              {availableFilters[filterCategory].map((filterOption) => {
                    var _a, _b, _c, _d;
                    const filterValue = filterOption.value;
                    const value = ((_a = filterResults[filterCategory]) === null || _a === void 0 ? void 0 : _a[filterValue]) || {};
                    const filterChange = value.percentage !== undefined ? (value.percentage > 0 ? (`+${value.percentage.toFixed(1)}%`) : (`${value.percentage.toFixed(1)}%`)) : (<react_loading_skeleton_1.default width={32} height={12} borderRadius={24}/>);
                    const label = (_b = availableFilters[filterCategory].find((item) => item.value === filterValue)) === null || _b === void 0 ? void 0 : _b.label;
                    return (<Card_1.default shape="smooth" color="contrast" className="flex justify-between p-4" key={`${filterCategory}_${filterValue}`}>
                    <div className="relative flex flex-col justify-between items-start">
                      <h4 className="font-sans text-xs font-medium uppercase text-muted-500 dark:text-muted-400">
                        <span className={`text-${filterOption.color}-500 dark:text-${filterOption.color}-400`}>
                          {(0, lodash_1.capitalize)(label)}{" "}
                        </span>
                        <span className="text-muted-700 dark:text-muted-200 font-semibold">
                          {cardName}
                        </span>
                      </h4>
                      <span className="font-sans text-2xl font-bold text-muted-800 dark:text-muted-300">
                        {value.count !== undefined ? (value.count) : (<react_loading_skeleton_1.default width={40} height={12} borderRadius={24}/>)}
                      </span>
                      <link_1.default href={filterOption.path || "#"}>
                        <Tooltip_1.Tooltip content={`View ${(0, lodash_1.capitalize)(label)} ${modelName}`}>
                          <div className="flex items-center gap-2 pt-2">
                            <IconButton_1.default variant="pastel" aria-label="Records" color={filterOption.color || "primary"} shape="full">
                              <react_2.Icon icon={filterOption.icon} color={filterOption.color} className="h-7 w-7"/>
                            </IconButton_1.default>
                            <div>
                              <p className="font-sans text-xs text-muted-500 dark:text-muted-400 flex gap-1">
                                <span className={`font-semibold text-${filterOption.color}-500 dark:text-${filterOption.color}-400`}>
                                  {filterChange}
                                </span>
                                {(_c = timeframes.find((item) => item.value === timeframe.value)) === null || _c === void 0 ? void 0 : _c.text}
                              </p>
                            </div>
                          </div>
                        </Tooltip_1.Tooltip>
                      </link_1.default>
                    </div>

                    <Tooltip_1.Tooltip content={`${((_d = value.percentage) === null || _d === void 0 ? void 0 : _d.toFixed(2)) || 0}% of ${modelName} by ${(0, lodash_1.capitalize)(filterCategory)}`}>
                      <div className="relative min-h-[100px] w-2 rounded-full bg-muted-100 dark:bg-muted-800">
                        <div className="animated-bar absolute bottom-0 right-0 z-1 w-full rounded-full transition-all duration-500 ease-in-out" style={{
                            height: `${value.percentage || 0}%`,
                            backgroundColor: chart_colors_1.themeColors[filterOption.color],
                        }}></div>
                      </div>
                    </Tooltip_1.Tooltip>
                  </Card_1.default>);
                })}
            </div>
          </div>);
        })}
    </div>);
};
exports.FilterCharts = FilterChartsBase;
