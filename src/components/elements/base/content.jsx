"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentBlock = void 0;
const Table_1 = __importDefault(require("@/components/elements/base/table/Table"));
const TH_1 = __importDefault(require("@/components/elements/base/table/TH"));
const TD_1 = __importDefault(require("@/components/elements/base/table/TD"));
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const link_1 = __importDefault(require("next/link"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const react_2 = require("@iconify/react");
const ContentBlock = ({ block, idx }) => {
    const itemVariants = {
        hidden: { opacity: 0, x: 0 },
        visible: { opacity: 1, x: 50 },
    };
    const ref = (0, react_1.useRef)(null);
    const isInView = (0, framer_motion_1.useInView)(ref, { once: true });
    switch (block.type) {
        case "paragraph":
            return (<framer_motion_1.motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} key={idx} className="text-gray-600 dark:text-gray-400">
          <p>{block.data.text}</p>
        </framer_motion_1.motion.div>);
        case "header":
            const level = Number(block.data.level);
            const className = `text-${level === 1 ? "4xl" : level === 2 ? "3xl" : level === 3 ? "2lg" : "base"}`;
            return (<framer_motion_1.motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} key={idx} className={`${className}`}>
          {(0, react_1.createElement)(`h${level}`, {
                    className: " font-bold text-muted-800 dark:text-muted-200",
                }, block.data.text)}
        </framer_motion_1.motion.div>);
        case "quote":
            return (<framer_motion_1.motion.blockquote ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} key={idx} className="italic border-l-4 pl-4  text-gray-600 dark:text-gray-400">
          <p>{block.data.text}</p>
          <cite>{block.data.caption}</cite>
        </framer_motion_1.motion.blockquote>);
        case "list":
            return (<framer_motion_1.motion.ul key={idx} ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} className="list-disc list-inside text-gray-600 dark:text-gray-400">
          {block.data.items.map((item, itemIdx) => (<li key={itemIdx}>{item.content}</li>))}
        </framer_motion_1.motion.ul>);
        case "quote":
            return (<framer_motion_1.motion.blockquote key={idx} ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} className="italic border-l-4 pl-4  text-gray-600 dark:text-gray-400">
          <p>{block.data.text}</p>
          <cite>{block.data.caption}</cite>
        </framer_motion_1.motion.blockquote>);
        case "list":
            return (<framer_motion_1.motion.ul key={idx} ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} className="list-disc list-inside text-gray-600 dark:text-gray-400">
          {block.data.items.map((item, itemIdx) => (<li key={itemIdx}>{item.content}</li>))}
        </framer_motion_1.motion.ul>);
        case "checklist":
            return (<framer_motion_1.motion.ul key={idx} ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} className="list-none text-gray-600 dark:text-gray-400">
          {block.data.items.map((item, itemIdx) => (<li key={itemIdx} className="flex items-center gap-2">
              <Checkbox_1.default type="checkbox" checked={item.checked} readOnly color="primary"/>
              {item.text}
            </li>))}
        </framer_motion_1.motion.ul>);
        case "image":
            return (<framer_motion_1.motion.div key={idx} ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} style={{
                    border: block.data.withBorder ? "1px solid black" : "none",
                }}>
          <img src={block.data.file.url} alt={block.data.caption} className="w-full rounded-xl" style={{
                    width: block.data.stretched ? "100%" : "auto",
                    backgroundColor: block.data.withBackground
                        ? "#f0f0f0"
                        : "transparent",
                }}/>
          {block.data.caption && <p>{block.data.caption}</p>}
        </framer_motion_1.motion.div>);
        case "table":
            return (<framer_motion_1.motion.span ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} key={idx}>
          <Table_1.default className="prose-none w-full overflow-x-auto rounded-lg border border-muted-200 bg-white dark:border-muted-900 dark:bg-muted-950">
            {block.data.withHeadings && (<thead>
                <tr className="bg-muted-50 dark:bg-muted-900">
                  {block.data.content[0].map((heading, headingIdx) => (<TH_1.default key={headingIdx}>{heading}</TH_1.default>))}
                </tr>
              </thead>)}
            <tbody>
              {block.data.content
                    .slice(block.data.withHeadings ? 1 : 0)
                    .map((row, rowIdx) => (<tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (<TD_1.default key={cellIdx}>
                        <div className="text-muted-800 dark:text-muted-100">
                          {cell}
                        </div>
                      </TD_1.default>))}
                  </tr>))}
            </tbody>
          </Table_1.default>
        </framer_motion_1.motion.span>);
        case "code":
            return (<framer_motion_1.motion.pre key={idx} ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} className="bg-gray-100 dark:bg-gray-800 p-4">
          {block.data.code}
        </framer_motion_1.motion.pre>);
        case "button":
            return (<framer_motion_1.motion.span ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} key={idx}>
          <link_1.default href={block.data.link} className="prose-none ">
            <Button_1.default key={idx} variant={"pastel"} size={"md"} color={"primary"}>
              {block.data.text}
            </Button_1.default>
          </link_1.default>
        </framer_motion_1.motion.span>);
        case "delimiter":
            return (<framer_motion_1.motion.hr ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} key={idx}/>);
        case "raw":
            return (<framer_motion_1.motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} key={idx} dangerouslySetInnerHTML={{ __html: block.data.html }}/>);
        case "warning":
            return (<framer_motion_1.motion.div key={idx} ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} transition={{ duration: 0.4 }} className="flex items-center gap-2 border py-3 pe-2 ps-4 rounded-md bg-warning-50 text-warning-500 dark:bg-muted-800 dark:text-warning-300 mb-5
            border-warning-500 dark:border-warning-300
          ">
          <react_2.Icon height={24} width={24} icon={"ph:warning-octagon-duotone"} className={"text-warning-500 dark:text-warning-300"}/>
          <div>
            <div className="text-sm font-semibold text-warning-500 dark:text-warning-300">
              {block.data.title}
            </div>
            <div className="text-xs text-warning-500 dark:text-warning-300">
              {block.data.message}
            </div>
          </div>
        </framer_motion_1.motion.div>);
        default:
            return null;
    }
};
exports.ContentBlock = ContentBlock;
