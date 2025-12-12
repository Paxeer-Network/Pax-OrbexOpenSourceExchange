"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = void 0;
const react_1 = require("react");
const react_2 = require("react");
const ToggleBox_1 = __importDefault(require("@/components/elements/base/toggle-box/ToggleBox"));
const knowledgeBase_1 = require("@/stores/knowledgeBase");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const next_i18next_1 = require("next-i18next");
const lodash_1 = require("lodash");
const react_player_1 = __importDefault(require("react-player"));
const FaqBase = ({ category }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { faqs, setCategory } = (0, knowledgeBase_1.useKnowledgeBaseStore)();
    const debouncedSetCategory = (0, lodash_1.debounce)(setCategory, 100);
    (0, react_1.useEffect)(() => {
        debouncedSetCategory(category);
    }, [category, setCategory]);
    return faqs.length > 0 ? (<Card_1.default className="mt-10 grid grid-cols-2 gap-4 p-5" color={"muted"}>
      <div className="col-span-2">
        <h1 className="text-xl text-primary-500 dark:text-primary-400">
          {t("Frequently Asked Questions")}
        </h1>
      </div>
      {faqs.map((faq) => (<div key={faq.id} className="col-span-2 md:col-span-1">
          <ToggleBox_1.default title={faq.question} color="contrast">
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400">
              {faq.answer}
            </p>
            {faq.videoUrl && (<div className="mt-4">
                <react_player_1.default url={faq.videoUrl} width="100%" height="100%" controls/>
              </div>)}
          </ToggleBox_1.default>
        </div>))}
    </Card_1.default>) : null;
};
exports.Faq = (0, react_2.memo)(FaqBase);
