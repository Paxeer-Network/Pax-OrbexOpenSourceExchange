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
exports.Announcements = void 0;
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const dashboard_1 = require("@/stores/dashboard");
const react_2 = require("@iconify/react");
const next_i18next_1 = require("next-i18next");
const AnnouncementItem = ({ item, index }) => {
    const ref = (0, react_1.useRef)(null);
    const isInView = (0, framer_motion_1.useInView)(ref, { once: true });
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.01 },
        }),
    };
    return (<framer_motion_1.motion.li ref={ref} className="relative rounded-md p-3 hover:bg-muted-100 dark:hover:bg-muted-900 transition-colors duration-300 cursor-pointer bg-muted-50 dark:bg-muted-850" custom={index} initial="hidden" animate={isInView ? "visible" : "hidden"} exit={{ opacity: 0, y: 20 }} variants={itemVariants}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3.5">
          <div className="relative flex h-12 w-12 items-center bg-white dark:bg-muted-900 justify-center rounded-full border border-muted-200 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:shadow-muted-800/30">
            <react_2.Icon icon="ph:notification-duotone" className="h-4 w-4 stroke-primary-500 stroke-[1.28px] text-primary-500 transition-[stroke] duration-300"/>
          </div>
          <div>
            <p className="text-sm leading-snug text-muted-500">
              {item.link ? (<a href={item.link} className="cursor-pointer font-medium text-primary-500 hover:underline">
                  {item.title}
                </a>) : (<span className="font-medium text-primary-500">
                  {item.title}
                </span>)}{" "}
              {item.message}
            </p>
            <small className="text-xs text-muted-400">
              {new Date(item.createdAt).toLocaleTimeString()}
            </small>
          </div>
        </div>
      </div>
    </framer_motion_1.motion.li>);
};
const AnnouncementsBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { announcements } = (0, dashboard_1.useDashboardStore)();
    return (<div className="relative w-full flex flex-col overflow-x-hidden slimscroll">
      <div className="grow mt-2">
        {announcements.length === 0 ? (<div className="text-center text-muted-500 text-md">
            {t("No announcements available.")}
          </div>) : (<ul className="relative space-y-2 overflow-y-auto max-h-[calc(100vh_-_80px)] slimscroll pe-1">
            {announcements.map((item, index) => (<AnnouncementItem key={item.id} item={item} index={index}/>))}
          </ul>)}
      </div>
    </div>);
};
exports.Announcements = (0, react_1.memo)(AnnouncementsBase);
