"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@iconify/react");
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const Heading_1 = __importDefault(require("@/components/elements/base/heading/Heading"));
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const getStatusColor = (status) => {
    switch (status) {
        case "WIN":
            return "success";
        case "PENDING":
            return "warning";
        case "LOSS":
        case "CANCELLED":
        case "REJECTED":
            return "danger";
        case "DRAW":
            return "info";
        default:
            return "info";
    }
};
const getProfitContent = (item) => {
    const [, pair] = item.symbol.split("/") || [];
    const basePair = pair || "";
    if (item.status === "PENDING") {
        return <span className="text-warning-500">Pending</span>;
    }
    let profitValue = 0;
    let classColor = "text-muted";
    if (item.status === "WIN") {
        profitValue = item.amount * (item.profit / 100);
        classColor = "text-success-500";
    }
    else if (item.status === "LOSS") {
        profitValue = -item.amount;
        classColor = "text-danger-500";
    }
    else if (item.status === "DRAW") {
        profitValue = 0;
        classColor = "text-muted";
    }
    return (<span className={classColor}>
      {profitValue > 0 ? `+${profitValue}` : profitValue} {basePair}
    </span>);
};
const BinaryList = ({ shape = "rounded-sm", positions }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    return (<div className="w-full overflow-y-auto xs:h-64 sm:h-80 slimscroll">
      <div className="space-y-6 pr-2">
        {positions.map((item) => (<div key={item.id} className="flex items-center gap-2">
            <IconBox_1.default variant="pastel" size="md" shape={"rounded-sm"} color={item.side === "RISE" ? "success" : "danger"} icon={`ph:trend-${item.side === "RISE" ? "up" : "down"}-duotone`}/>
            <div>
              <Heading_1.default as="h3" weight="medium" className="text-muted-800 dark:text-muted-100 text-md">
                {item.symbol}
              </Heading_1.default>
              <span className="text-muted-400 text-sm">
                {(0, date_fns_1.format)(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
              </span>
            </div>
            <div className="ms-auto">
              <Tag_1.default color={getStatusColor(item.status)} variant="pastel">
                {getProfitContent(item)}
              </Tag_1.default>
            </div>
          </div>))}
        {positions.length === 0 && (<div className="flex w-full justify-center items-center flex-col text-gray-500 dark:text-gray-500 xs:h-64 sm:h-80">
            <react_2.Icon icon="ph:files-thin" className="h-16 w-16"/>
            {t("No Positions Found")}
          </div>)}
      </div>
    </div>);
};
exports.default = BinaryList;
