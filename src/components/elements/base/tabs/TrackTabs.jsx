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
const react_2 = require("@headlessui/react");
const next_i18next_1 = require("next-i18next");
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const TrackTabs = ({ categories, shape = "smooth" }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [computedCategories] = (0, react_1.useState)(categories);
    return (<div className="relative w-full">
      <react_2.Tab.Group>
        <react_2.Tab.List className={`
          flex space-x-1 bg-muted-100 p-1 dark:bg-muted-900
          ${shape === "rounded-sm" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
          ${shape === "full" ? "rounded-full" : ""}
        `}>
          {Object.keys(computedCategories).map((category) => (<react_2.Tab key={category} className={({ selected }) => classNames("w-full py-2.5 text-sm font-medium leading-5", "ring-primary-500 ring-opacity-60 ring-offset-2 ring-offset-muted-100 focus:outline-hidden focus:ring-[1px] dark:ring-offset-muted-900", shape === "rounded-sm" ? "rounded-md" : "", shape === "smooth" ? "rounded-lg" : "", shape === "curved" ? "rounded-xl" : "", shape === "full" ? "rounded-full" : "", selected
                ? "bg-white text-primary-500 shadow-sm dark:bg-muted-800"
                : "text-muted-400 hover:text-muted-500 dark:hover:text-muted-100")}>
              {category}
            </react_2.Tab>))}
        </react_2.Tab.List>
        <react_2.Tab.Panels className="mt-2">
          {Object.values(computedCategories).map((items, idx) => (<react_2.Tab.Panel key={idx} className={classNames("py-3", "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-hidden focus:ring-2")}>
              <ul>
                {items === null || items === void 0 ? void 0 : items.map((item) => (<li key={item.id} className="relative rounded-md p-3 hover:bg-muted-100 dark:hover:bg-muted-800 transition-colors duration-300">
                    <h5 className="text-sm font-medium text-muted-800 dark:text-muted-100 leading-5">
                      {item.title}
                    </h5>

                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-muted-500">
                      <li>{item.date}</li>
                      <li>{t("middot")}</li>
                      <li>
                        {item.commentCount} {t("comments")}
                      </li>
                      <li>{t("middot")}</li>
                      <li>
                        {item.shareCount} {t("shares")}
                      </li>
                    </ul>

                    <a href={item.href} className={classNames("absolute inset-0 rounded-md", "ring-primary-400 focus:z-10 focus:outline-hidden focus:ring-2")}/>
                  </li>))}
              </ul>
            </react_2.Tab.Panel>))}
        </react_2.Tab.Panels>
      </react_2.Tab.Group>
    </div>);
};
exports.default = TrackTabs;
