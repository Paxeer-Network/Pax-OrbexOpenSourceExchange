"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReview = void 0;
const react_1 = require("react");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const react_2 = require("@iconify/react");
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const ecommerce_1 = require("@/stores/user/ecommerce");
const dashboard_1 = require("@/stores/dashboard");
const next_i18next_1 = require("next-i18next");
const ProductReviewBase = ({}) => {
    var _a;
    const { t } = (0, next_i18next_1.useTranslation)();
    const { profile } = (0, dashboard_1.useDashboardStore)();
    const { product, reviewProduct } = (0, ecommerce_1.useEcommerceStore)();
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [reviewRating, setReviewRating] = (0, react_1.useState)(0);
    const [hoverRating, setHoverRating] = (0, react_1.useState)(0);
    const [comment, setComment] = (0, react_1.useState)("");
    const submitReview = async () => {
        setIsSubmitting(true);
        if (product) {
            const status = await reviewProduct(product.id, reviewRating, comment);
            if (status) {
                setReviewRating(0);
                setHoverRating(0);
                setComment("");
            }
        }
        setIsSubmitting(false);
    };
    const userReviewed = (_a = product === null || product === void 0 ? void 0 : product.ecommerceReviews) === null || _a === void 0 ? void 0 : _a.find((review) => { var _a; return ((_a = review.user) === null || _a === void 0 ? void 0 : _a.id) === (profile === null || profile === void 0 ? void 0 : profile.id); });
    return (<div className="flex flex-col gap-5">
      {(product === null || product === void 0 ? void 0 : product.ecommerceReviews) && (product === null || product === void 0 ? void 0 : product.ecommerceReviews.length) > 0 ? (product === null || product === void 0 ? void 0 : product.ecommerceReviews.map((review) => {
            var _a, _b, _c, _d;
            return (<Card_1.default key={review.id} className="flex flex-col p-4 gap-2" color="contrast">
            <div className="flex justify-between items-center">
              <h4 className="text-md flex items-center gap-2 text-muted-800 dark:text-muted-200">
                <Avatar_1.default src={((_a = review.user) === null || _a === void 0 ? void 0 : _a.avatar) || "/img/avatars/placeholder.webp"} alt={(_b = review.user) === null || _b === void 0 ? void 0 : _b.firstName} size="sm"/>
                <div>
                  <span>
                    {(_c = review.user) === null || _c === void 0 ? void 0 : _c.firstName} {(_d = review.user) === null || _d === void 0 ? void 0 : _d.lastName}
                  </span>
                  <p className="text-muted-500 dark:text-muted-400 text-sm">
                    {new Date(review.createdAt).toDateString()}
                  </p>
                </div>
              </h4>
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (<react_2.Icon key={i} icon={i < review.rating
                        ? "uim:star"
                        : i === review.rating && review.rating % 1 >= 0.5
                            ? "uim:star-half-alt"
                            : "uim:star"} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}/>))}
              </div>
            </div>
            <p className="text-muted-500 dark:text-muted-400">
              {review.comment}
            </p>
          </Card_1.default>);
        })) : (<p className="text-muted-500 dark:text-muted-400">
          {t("No reviews yet.")}
        </p>)}
      <Card_1.default className="p-5 space-y-2" color="contrast">
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (<react_2.Icon key={i} icon="uim:star" className={`w-5 h-5 ${i < (hoverRating || reviewRating)
                ? "text-yellow-400"
                : "text-gray-300"}`} onMouseOver={() => setHoverRating(i + 1)} onMouseLeave={() => setHoverRating(0)} onClick={() => setReviewRating(i + 1)}/>))}
        </div>
        <div className="space-y-5">
          <Textarea_1.default label={t("Message")} placeholder={t("Write your message...")} name="comment" value={comment} onChange={(e) => setComment(e.target.value)} loading={isSubmitting} disabled={isSubmitting}/>
          <Button_1.default type="button" color="primary" className="w-full" onClick={() => submitReview()} disabled={isSubmitting || !comment || !reviewRating} loading={isSubmitting}>
            {userReviewed ? "Update Review" : "Submit Review"}
          </Button_1.default>
        </div>
      </Card_1.default>
    </div>);
};
exports.ProductReview = (0, react_1.memo)(ProductReviewBase);
