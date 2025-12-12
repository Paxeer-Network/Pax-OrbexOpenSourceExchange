"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const react_1 = require("react");
const news_1 = __importDefault(require("@/stores/news"));
const date_fns_1 = require("date-fns");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const next_i18next_1 = require("next-i18next");
const panel_1 = require("@/components/elements/base/panel");
const NewsBase = ({}) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const { news, setupInterval, cleanupInterval, setActiveArticle, activeArticle, } = (0, news_1.default)();
    const [isPanelOpen, setIsPanelOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setupInterval();
        return () => cleanupInterval();
    }, [setupInterval, cleanupInterval]);
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength)
            return text;
        return text.substr(0, maxLength) + "...";
    };
    const handleReadMore = (article) => {
        setActiveArticle(article);
        setIsPanelOpen(true);
    };
    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setActiveArticle(null);
    };
    if (!news.length)
        return null;
    return (<div className="mt-8">
      <h2 className="text-2xl mb-5">
        <span className="text-primary-500">{t("Popular")} </span>
        <span className="text-muted-800 dark:text-muted-200">{t("News")}</span>
      </h2>
      <div className="space-y-4">
        {news.map((article, index) => (<Card_1.default key={article.id || index} color="contrast" className="hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
            <div className="w-full sm:w-64 h-48 sm:h-auto overflow-hidden">
              <img src={article.imageurl} alt={article.source} className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"/>
            </div>
            <div className="p-4 sm:py-4 flex-1">
              <h2 className="text-xl font-bold text-muted-700 dark:text-muted-300 mb-2">
                {article.title}
              </h2>
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full mr-2 overflow-hidden">
                  <img src={article.imageurl} alt={article.source} className="w-full h-full object-cover"/>
                </div>
                <span className="text-sm text-gray-500">{article.source}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {(0, date_fns_1.formatDistanceToNow)(new Date(article.published_on * 1000), {
                addSuffix: true,
            })}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {truncateText(article.body, 200)}
              </p>
              <Button_1.default onClick={() => handleReadMore(article)} className="text-blue-500 hover:underline mt-2 inline-block">
                {t("Read more")}
              </Button_1.default>
            </div>
          </Card_1.default>))}
      </div>
      <panel_1.Panel isOpen={isPanelOpen} onClose={handleClosePanel} title={t("News Article")} side="right" size="lg">
        {activeArticle && (<div className="space-y-4">
            <img src={activeArticle.imageurl} alt={activeArticle.source} className="w-full h-64 object-cover rounded-lg"/>
            <h2 className="text-2xl font-bold text-muted-800 dark:text-muted-200">
              {activeArticle.title}
            </h2>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full mr-2 overflow-hidden">
                <img src={activeArticle.imageurl} alt={activeArticle.source} className="w-full h-full object-cover"/>
              </div>
              <span className="text-sm text-gray-500">
                {activeArticle.source}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {(0, date_fns_1.formatDistanceToNow)(new Date(activeArticle.published_on * 1000), {
                addSuffix: true,
            })}
              </span>
            </div>
            <p className="text-muted-600 dark:text-muted-300">
              {activeArticle.body}
            </p>
            <a href={activeArticle.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-block mt-4">
              {t("Read full article")}
            </a>
          </div>)}
      </panel_1.Panel>
    </div>);
};
exports.News = (0, react_1.memo)(NewsBase);
