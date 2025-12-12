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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const useOnClickOutside_1 = __importDefault(require("@/hooks/useOnClickOutside"));
const react_2 = require("@iconify/react");
const class_variance_authority_1 = require("class-variance-authority");
const date_fns_1 = require("date-fns");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
];
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const numberRegex = /^-?\d*\.?\d+$/;
const pickerStyles = (0, class_variance_authority_1.cva)("mx-auto flex w-full py-2 items-center justify-center text-xs ", {
    variants: {
        isToday: { true: "", false: "" },
        isSelected: { true: "", false: "" },
        isSameMonth: {
            true: "",
            false: "",
        },
    },
    compoundVariants: [
        {
            isSelected: true,
            className: "font-medium",
        },
        {
            isToday: true,
            className: "font-medium bg-primary-500 text-white",
        },
        {
            isSelected: true,
            isToday: true,
            className: "bg-primary-500 text-white",
        },
        {
            isSelected: false,
            isToday: false,
            isSameMonth: true,
            className: "text-center hover:bg-muted-100 hover:text-primary-500 dark:hover:bg-muted-800 dark:disabled:hover:bg-transparent disabled:text-muted-300 dark:disabled:text-muted-700 disabled:cursor-not-allowed",
        },
        {
            isSelected: false,
            isToday: false,
            isSameMonth: false,
            className: "text-muted-300 dark:hover:bg-muted-800 dark:disabled:hover:bg-transparent disabled:cursor-not-allowed",
        },
        {
            isSelected: true,
            isToday: false,
            className: "bg-primary-500 text-white",
        },
    ],
});
const DatePicker = ({ value, valueFormat = "yyyy-MM-dd", icon, shape = "smooth", size = "md", color = "default", label, placeholder, minDate, disabled, loading = false, ...props }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [pickerOpen, setPickerOpen] = (0, react_1.useState)(false);
    const [showOverlay, setShowOverlay] = (0, react_1.useState)(false);
    const [overlayInput, setOverlayInput] = (0, react_1.useState)("");
    const pickerRef = (0, react_1.useRef)(null);
    (0, useOnClickOutside_1.default)(pickerRef, () => setPickerOpen(false));
    const pickerModalRef = (0, react_1.useRef)(null);
    (0, useOnClickOutside_1.default)(pickerModalRef, () => setShowOverlay(false));
    const today = (0, date_fns_1.startOfToday)();
    const [selectedDay, setSelectedDay] = (0, react_1.useState)(new Date(value || today));
    const [currentMonth, setCurrentMonth] = (0, react_1.useState)((0, date_fns_1.format)(today, "MMM-yyyy"));
    const firstDayCurrentMonth = (0, date_fns_1.parse)(currentMonth, "MMM-yyyy", new Date());
    const { onChange } = props;
    (0, react_1.useEffect)(() => {
        if (value && (0, date_fns_1.isValid)(value) && !(0, date_fns_1.isEqual)(value, selectedDay)) {
            setSelectedDay(value);
        }
    }, [value]);
    (0, react_1.useEffect)(() => {
        if (onChange) {
            onChange({
                target: {
                    value: selectedDay,
                },
            });
        }
    }, [selectedDay]);
    const displayValue = (0, react_1.useMemo)(() => ((0, date_fns_1.isValid)(selectedDay) ? (0, date_fns_1.format)(selectedDay, valueFormat) : ""), [selectedDay, valueFormat]);
    const days = (0, date_fns_1.eachDayOfInterval)({
        start: (0, date_fns_1.startOfWeek)(firstDayCurrentMonth),
        end: (0, date_fns_1.endOfWeek)((0, date_fns_1.endOfMonth)(firstDayCurrentMonth)),
    });
    const previousMonth = () => {
        const firstDayNextMonth = (0, date_fns_1.add)(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth((0, date_fns_1.format)(firstDayNextMonth, "MMM-yyyy"));
    };
    const nextMonth = () => {
        const firstDayNextMonth = (0, date_fns_1.add)(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth((0, date_fns_1.format)(firstDayNextMonth, "MMM-yyyy"));
    };
    const handleFocused = () => {
        setPickerOpen(true);
        setTimeout(() => {
            var _a;
            (_a = pickerModalRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }, 100);
    };
    const handleOverlayYear = (e) => {
        const value = e.target.value;
        if ((value != "" && !numberRegex.test(value)) || value.length > 4) {
            return;
        }
        setOverlayInput(value);
    };
    const handleConfirm = () => {
        const newDate = new Date().setFullYear(+overlayInput);
        setCurrentMonth((0, date_fns_1.format)(newDate, "MMM-yyyy"));
        setShowOverlay(false);
    };
    const handleGotoMonth = (month) => {
        const year = numberRegex.test(overlayInput) && overlayInput.length == 4
            ? +overlayInput
            : today.getFullYear();
        const newDate = new Date().setFullYear(year, month);
        setCurrentMonth((0, date_fns_1.format)(newDate, "MMM-yyyy"));
        setShowOverlay(false);
    };
    const isdisabled = (date) => {
        if (minDate) {
            return (0, date_fns_1.isBefore)(date, minDate);
        }
        return false;
    };
    return (<div ref={pickerRef} className="relative w-full font-sans">
      <Input_1.default type="text" label={label} shape={shape} size={size} color={color} icon={icon} placeholder={placeholder} onFocus={handleFocused} value={displayValue} disabled={disabled} loading={loading} {...props}/>
      <div ref={pickerModalRef} className={`absolute left-0 top-full isolate z-10 mt-2 w-full border border-muted-200 bg-white p-5 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/20 
          ${pickerOpen ? "block" : "hidden"}
          ${shape === "rounded-sm" ? "rounded-md" : ""}     
          ${shape === "smooth" ? "rounded-lg" : ""}    
          ${shape === "curved" ? "rounded-xl" : ""}    
          ${shape === "full" ? "rounded-xl" : ""}   
        `}>
        <div className="w-full text-xs text-muted-800 dark:text-muted-100">
          <div className="flex items-center justify-between">
            <button type="button" onClick={previousMonth} className="flex flex-none items-center justify-center p-1.5 text-muted-500 hover:text-muted-400">
              <span className="sr-only">{t("Previous month")}</span>
              <react_2.Icon icon="lucide:chevron-left" className="h-5 w-5" aria-hidden="true"/>
            </button>
            <button type="button" onClick={() => setShowOverlay(true)} className="text-sm font-medium text-muted-800 hover:underline dark:text-muted-100">
              {(0, date_fns_1.format)(firstDayCurrentMonth, "MMMM yyyy")}
            </button>
            <button onClick={nextMonth} type="button" className="text-muted-500 flex flex-none items-center justify-center p-1.5 hover:text-muted-400">
              <span className="sr-only">{t("Next month")}</span>
              <react_2.Icon icon="lucide:chevron-right" className="h-5 w-5" aria-hidden="true"/>
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7">
            {dayLabels.map((dayLabel, index) => (<div key={index} className="py-2 text-center text-[0.52rem] font-normal uppercase text-muted-400">
                {dayLabel}
              </div>))}
          </div>
          <div className="grid grid-cols-7 text-sm">
            {days.map((day, dayIdx) => (<div key={day.toString()} className={`${dayIdx === 0 ? colStartClasses[(0, date_fns_1.getDay)(day)] : ""}`}>
                <button type="button" onClick={() => {
                setSelectedDay(day);
                setPickerOpen(false);
            }} disabled={isdisabled(day)} className={`${pickerStyles({
                isSelected: (0, date_fns_1.isEqual)(day, selectedDay),
                isToday: (0, date_fns_1.isToday)(day),
                isSameMonth: (0, date_fns_1.isSameMonth)(day, firstDayCurrentMonth),
            })}
                  ${shape === "rounded-sm" ? "rounded-md" : ""}     
                  ${shape === "smooth" ? "rounded-lg" : ""}    
                  ${shape === "curved" ? "rounded-xl" : ""}    
                  ${shape === "full" ? "rounded-full" : ""} 
                  `}>
                  <time dateTime={(0, date_fns_1.format)(day, "yyyy-MM-dd")}>
                    {(0, date_fns_1.format)(day, "d")}
                  </time>
                </button>
              </div>))}
          </div>
        </div>

        <div className={`absolute inset-0 flex flex-col justify-between rounded-lg bg-white p-5 text-white transition-all duration-300 dark:bg-muted-950 
            ${showOverlay ? "z-2 opacity-100" : "-z-1 opacity-0"} 
          `}>
          <div>
            <input type="text" pattern="(^\d{4}$)|(^\d{4}-\d{2}-\d{2}$)" placeholder={t("4-digit year")} value={overlayInput} onChange={handleOverlayYear} className="mx-auto block w-4/5 border-b border-muted-200 bg-transparent py-1 text-center text-base text-muted-800 focus:outline-hidden dark:border-muted-800 dark:text-muted-100"/>

            <button type="button" onClick={() => setShowOverlay(false)} className="absolute right-2 top-0 p-2 text-2xl opacity-70">
              {t("times")}
            </button>
          </div>

          <div className="grid grid-cols-3">
            {months.map((month, index) => (<button key={index} type="button" data-month={index + 1} onClick={() => handleGotoMonth(index)} className={`
                  py-2 text-sm text-muted-800/70 hover:bg-muted-100 hover:text-muted-800 dark:text-muted-400 dark:hover:bg-muted-800 dark:hover:text-white
                  ${shape === "rounded-sm" ? "rounded-md" : ""}     
                  ${shape === "smooth" ? "rounded-lg" : ""}    
                  ${shape === "curved" ? "rounded-xl" : ""}    
                  ${shape === "full" ? "rounded-full" : ""} 
                `}>
                {month}
              </button>))}
          </div>

          <Button_1.default type="button" color="primary" shape={shape} onClick={handleConfirm} disabled={overlayInput.length != 4} className="mx-auto h-auto! px-3! py-[.28rem]!">
            {t("Confirm")}
          </Button_1.default>
        </div>
      </div>
    </div>);
};
exports.default = DatePicker;
