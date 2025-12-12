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
exports.CommentSection = void 0;
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("@/utils/api"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Pagination_1 = __importDefault(require("@/components/elements/base/pagination/Pagination"));
const date_fns_1 = require("date-fns");
const next_i18next_1 = require("next-i18next");
const CommentSectionBase = ({ comments: initialComments, postId, fetchData, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [newComment, setNewComment] = (0, react_1.useState)("");
    const [comments, setComments] = (0, react_1.useState)(initialComments);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [pageSize] = (0, react_1.useState)(5); // Number of comments per page
    const [totalCount, setTotalCount] = (0, react_1.useState)(initialComments.length);
    (0, react_1.useEffect)(() => {
        setComments(initialComments === null || initialComments === void 0 ? void 0 : initialComments.slice(0, pageSize));
        setTotalCount(initialComments.length);
    }, [initialComments, pageSize]);
    const handleCommentSubmit = async () => {
        if (!newComment.trim())
            return;
        const { data, error } = await (0, api_1.default)({
            url: `/api/content/comment/${postId}`,
            method: "POST",
            body: { content: newComment },
            silent: true,
        });
        if (!error && data) {
            fetchData();
            setNewComment("");
        }
        else {
            console.error("Failed to post the comment:", error);
        }
    };
    const handlePageChange = (page) => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setComments(initialComments === null || initialComments === void 0 ? void 0 : initialComments.slice(start, end));
        setCurrentPage(page);
    };
    return (<div className="comment-section mt-20">
      <div className="relative mt-10 mb-5">
        <hr className="border-muted-200 dark:border-muted-700"/>
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {t("Comments")}
          </span>
        </span>
      </div>

      {/* List of comments */}
      {comments.map((comment) => {
            var _a, _b, _c, _d;
            return (<Card_1.default key={comment.id} className="mt-4 p-5">
          <div className="flex gap-4 items-start">
            <Avatar_1.default src={((_a = comment.user) === null || _a === void 0 ? void 0 : _a.avatar) || "/img/avatars/placeholder.webp"} alt={((_b = comment.user) === null || _b === void 0 ? void 0 : _b.name) || "User Avatar"} size="sm"/>
            <div className="flex flex-col pt-1">
              <p className="font-semibold text-sm text-muted-800 dark:text-muted-200">
                {(_c = comment.user) === null || _c === void 0 ? void 0 : _c.firstName} {(_d = comment.user) === null || _d === void 0 ? void 0 : _d.lastName}
              </p>
              <p className="text-xs text-muted-600 dark:text-muted-400">
                {comment.content} |{" "}
                {(0, date_fns_1.format)(new Date(comment.createdAt || new Date()), "MMM dd, yyyy h:mm a")}
              </p>
            </div>
          </div>
        </Card_1.default>);
        })}

      {/* Pagination */}
      <div className="mt-8">
        <Pagination_1.default currentPage={currentPage} totalCount={totalCount} pageSize={pageSize} onPageChange={handlePageChange}/>
      </div>

      {/* Comment input */}
      <Card_1.default className="p-5 flex flex-col gap-3 mt-8">
        <Textarea_1.default placeholder={t("Write your comment here...")} value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
        <Button_1.default variant={"solid"} color={"primary"} animated={false} onClick={handleCommentSubmit}>
          {t("Submit")}
        </Button_1.default>
      </Card_1.default>
    </div>);
};
exports.CommentSection = (0, react_1.memo)(CommentSectionBase);
