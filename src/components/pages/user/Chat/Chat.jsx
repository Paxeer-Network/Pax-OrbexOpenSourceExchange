"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const react_1 = require("react");
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const react_2 = require("@iconify/react");
const framer_motion_1 = require("framer-motion");
const Message_1 = require("../support/Message");
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const lodash_1 = require("lodash");
const next_i18next_1 = require("next-i18next");
const ChatBase = ({ messages, handleFileUpload, messageSide, user1, user2, reply, isReplying, canReply, floating = false, }) => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)("");
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    const [containerWidth, setContainerWidth] = (0, react_1.useState)(0);
    const [showScrollToBottomButton, setShowScrollToBottomButton] = (0, react_1.useState)(false);
    const messageContainerRef = (0, react_1.useRef)(null);
    function handleTextareaBlur(e) {
        const currentTarget = e.currentTarget; // Capture the current target at the time of the event.
        setTimeout(() => {
            // Ensure the current target still exists and check if it should still collapse
            if (currentTarget && !currentTarget.contains(document.activeElement)) {
                setExpanded(false);
            }
        }, 150); // A small delay to allow other event handlers to process
    }
    const onClickSend = () => {
        if (message) {
            reply(message);
            setMessage("");
            setExpanded(false); // Close the textarea explicitly here if you still want it to close after sending
        }
    };
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };
    const startFromBottom = () => {
        setTimeout(() => {
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTop =
                    messageContainerRef.current.scrollHeight;
            }
        }, 100);
    };
    (0, react_1.useEffect)(() => {
        if (messages === null || messages === void 0 ? void 0 : messages.length) {
            startFromBottom();
        }
    }, [messages]);
    const handleScroll = () => {
        const container = messageContainerRef.current;
        if (!container)
            return;
        const tolerance = 1; // Adjust this tolerance as needed for pixel perfection
        const isAtBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) <= tolerance;
        setShowScrollToBottomButton(!isAtBottom && hasMore);
    };
    const debouncedHandleScroll = (0, react_1.useCallback)((0, lodash_1.debounce)(handleScroll, 100), [
        hasMore,
    ]);
    (0, react_1.useEffect)(() => {
        const container = messageContainerRef.current;
        if (container) {
            container.addEventListener("scroll", debouncedHandleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", debouncedHandleScroll);
            }
        };
    }, [debouncedHandleScroll]);
    (0, react_1.useEffect)(() => {
        const updateWidth = () => {
            var _a;
            if (messageContainerRef.current) {
                setContainerWidth(((_a = messageContainerRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) - 2);
            }
        };
        updateWidth(); // Update on mount
        window.addEventListener("resize", updateWidth); // Update on window resize
        return () => {
            window.removeEventListener("resize", updateWidth); // Cleanup on unmount
        };
    }, []);
    return (<>
      <div className={`gap-5 relative ${floating ? "max-h-[368px]" : "card max-h-[calc(100vh-142px)]"} h-full mb-5 md:mb-0 ${canReply ? "pb-20" : "pb-0"}`}>
        <div ref={messageContainerRef} className={`mx-auto flex max-w-full flex-col overflow-y-auto h-full pb-8 px-4 gap-4`}>
          <framer_motion_1.AnimatePresence>
            {Array.isArray(messages) &&
            messages.map((message, index) => (<Message_1.Message key={message.id || index} message={message} side={messageSide(message.type)} type={message.type} userAvatar={(user1 === null || user1 === void 0 ? void 0 : user1.avatar) || "/img/avatars/placeholder.webp"} agentAvatar={(user2 === null || user2 === void 0 ? void 0 : user2.avatar) || "/img/avatars/placeholder.webp"}/>))}
          </framer_motion_1.AnimatePresence>
        </div>

        {canReply && (<div className="absolute bottom-4 w-full z-10 px-4">
            {showScrollToBottomButton && (<div className="w-full flex justify-center">
                <IconButton_1.default color="muted" variant="solid" shape="full" size="sm" className="mb-2" onClick={() => scrollToBottom()}>
                  <react_2.Icon icon="mdi:chevron-down" className="h-5 w-5"/>
                </IconButton_1.default>
              </div>)}
            <Card_1.default className="relative w-full transition-all duration-300">
              <Textarea_1.default id="compose-reply" className={`!border-none !border-transparent !bg-transparent !leading-8 !shadow-none transition-all duration-300 field-sizing-content -mb-2`} rows={4} placeholder={t("Write a message...")} onFocus={() => setExpanded(true)} onBlur={handleTextareaBlur} value={message} onChange={(e) => setMessage(e.target.value)}/>
              <div className="flex gap-1.5 items-center justify-end absolute z-5 right-2 top-1.5 overflow-hidden">
                <IconButton_1.default color={"info"} variant="pastel" shape="rounded" size={"sm"} disabled={isReplying}>
                  <input id="upload-attachments" className="absolute left-0 top-0 z-1 h-full w-full opacity-0" type="file" accept="image/*,.heic,.heif" onChange={(e) => { var _a; return handleFileUpload((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]); }}/>
                  <react_2.Icon icon="material-symbols-light:upload" className="relative h-6 w-6 p-0"/>
                </IconButton_1.default>
                <IconButton_1.default color={message ? "primary" : "muted"} variant="pastel" shape="rounded" size={"sm"} disabled={!message || isReplying} onClick={onClickSend}>
                  <react_2.Icon icon="fluent:send-24-filled" className="relative -right-0.5 h-5 w-5 p-0"/>
                </IconButton_1.default>
              </div>
            </Card_1.default>
          </div>)}
      </div>
    </>);
};
exports.Chat = (0, react_1.memo)(ChatBase);
