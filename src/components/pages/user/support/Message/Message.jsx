"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const SupportConversation_1 = __importDefault(require("../SupportConversation"));
const date_fns_1 = require("date-fns");
const MashImage_1 = require("@/components/elements/MashImage");
const react_2 = require("@iconify/react");
const react_dom_1 = __importDefault(require("react-dom"));
const ImageModal = ({ src, onClose }) => {
    if (!src)
        return null;
    const portalRoot = document.getElementById("portal-root");
    return react_dom_1.default.createPortal(<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose} style={{ backdropFilter: "blur-sm(5px)" }}>
      <div className="rounded-lg shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()} // Prevents click inside the modal from closing it
    >
        <MashImage_1.MashImage src={src} alt="Preview" className="rounded-lg max-h-[80vh] max-w-[80vw] object-contain"/>
        <button onClick={onClose} className="absolute top-3 right-3 text-white">
          <react_2.Icon icon="eva:close-fill" className="text-2xl"/>
        </button>
      </div>
    </div>, portalRoot);
};
const MessageBase = ({ message, type, userAvatar, agentAvatar, side }) => {
    const [isModalOpen, setModalOpen] = (0, react_1.useState)(false);
    const [currentImage, setCurrentImage] = (0, react_1.useState)("");
    const ref = (0, react_1.useRef)(null);
    const isInView = (0, framer_motion_1.useInView)(ref, { once: true, margin: "-100px" });
    const variants = {
        hidden: { y: 0, opacity: 0 },
        visible: {
            y: 30,
            opacity: 1,
            transition: { type: "spring", stiffness: 120, damping: 20 },
        },
    };
    const handleImageClick = (e) => {
        e.preventDefault(); // Prevent default link behavior
        setCurrentImage(message.attachment);
        setModalOpen(true);
    };
    return (<framer_motion_1.motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={variants}>
      {isModalOpen && (<ImageModal src={currentImage} onClose={() => setModalOpen(false)}/>)}
      <SupportConversation_1.default avatar={type === "client" ? userAvatar : agentAvatar} side={side} timestamp={(0, date_fns_1.formatDate)(new Date(message.time || Date.now()), "MMM dd, yyyy h:mm a")}>
        {message.attachment ? (<div className="relative group">
            <a onClick={handleImageClick} className="block cursor-pointer">
              <MashImage_1.MashImage src={message.attachment} height={100} width={100} alt="Attachment" className="rounded-lg"/>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <react_2.Icon icon="akar-icons:eye" className="text-white text-3xl"/>
              </div>
            </a>
          </div>) : (message.text)}
      </SupportConversation_1.default>
    </framer_motion_1.motion.div>);
};
exports.Message = (0, react_1.memo)(MessageBase);
