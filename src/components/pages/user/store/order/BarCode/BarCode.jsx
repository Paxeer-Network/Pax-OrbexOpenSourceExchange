"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarCode = void 0;
const react_1 = require("react");
const MashImage_1 = require("@/components/elements/MashImage");
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const BarCodeBase = ({ id, date }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [barcodeSrc, setBarcodeSrc] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (id) {
            const fetchBarcode = async () => {
                const apiUrl = `https://barcode.tec-it.com/barcode.ashx?data=${id}&code=Code128&translate-esc=true`;
                setBarcodeSrc(apiUrl);
            };
            fetchBarcode();
        }
    }, [id]);
    return (<>
      <div className="mt-5 flex flex-row justify-between">
        <div className="relative">
          <MashImage_1.MashImage className="dark:opacity-50 dark:invert" src={barcodeSrc} alt="barcode" width={400} height={150}/>
        </div>
      </div>
      <span className="mt-4 block text-sm text-muted-400">
        {t("Issued on")} {(0, date_fns_1.formatDate)(new Date(date || new Date()), "dd MMM yyyy")}
      </span>
    </>);
};
exports.BarCode = (0, react_1.memo)(BarCodeBase);
