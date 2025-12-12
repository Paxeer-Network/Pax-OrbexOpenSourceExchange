"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@craftjs/core");
const Text_1 = require("./Text");
const Link_1 = require("./Link");
const Button_1 = require("./Button");
const Image_1 = require("./Image");
const Svg_1 = require("./Svg");
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Textarea_1 = __importDefault(require("@/components/elements/form/textarea/Textarea"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const Radio_1 = __importDefault(require("@/components/elements/form/radio/Radio"));
const html_1 = require("../utils/html");
const Child = ({ root, d = [0] }) => {
    if (!root || (root === null || root === void 0 ? void 0 : root.childNodes.length) === 0)
        return null;
    return (<>
      {Array.from(root === null || root === void 0 ? void 0 : root.childNodes).map((r, i) => {
            var _a, _b;
            const key = d.concat(i).join("");
            const classNames = ((_a = r.classNames) === null || _a === void 0 ? void 0 : _a.toString()) || "";
            const cleanedAttrs = (0, html_1.cleanHTMLAttrs)(r.attrs);
            if (r.nodeType === 1) {
                switch (r.tagName) {
                    case "SECTION":
                        return (<section className={classNames} id={key} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </section>);
                    case "DIV":
                        return (<div key={key} id={key} className={classNames}>
                  <Child root={r} d={d.concat(i)}/>
                </div>);
                    case "H1":
                        return (<h1 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </h1>);
                    case "H2":
                        return (<h2 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </h2>);
                    case "H3":
                        return (<h3 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </h3>);
                    case "H4":
                        return (<h4 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </h4>);
                    case "H5":
                        return (<h5 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </h5>);
                    case "H6":
                        return (<h6 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </h6>);
                    case "P":
                        return (<p className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </p>);
                    case "A":
                        return (<core_1.Element is={Link_1.Link} key={key} r={r} d={d} i={i} id={key} propId={key}/>);
                    case "SPAN":
                        return (<span className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </span>);
                    case "STRONG":
                        return (<strong className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </strong>);
                    case "EM":
                        return (<em className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </em>);
                    case "HEADER":
                        return (<header className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </header>);
                    case "MAIN":
                        return (<main className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </main>);
                    case "FOOTER":
                        return (<footer className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </footer>);
                    case "NAV":
                        return (<nav className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </nav>);
                    case "ASIDE":
                        return (<aside className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </aside>);
                    case "DETAILS":
                        return (<details className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </details>);
                    case "SUMMARY":
                        return (<summary className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </summary>);
                    case "BLOCKQUOTE":
                        return (<blockquote className={classNames} key={key} {...cleanedAttrs}>
                  <Child root={r} d={d.concat(i)}/>
                </blockquote>);
                    case "INPUT":
                        if (r.attrs.type === "checkbox") {
                            return (<Checkbox_1.default className={classNames} key={key} {...cleanedAttrs}/>);
                        }
                        else if (r.attrs.type === "radio") {
                            return (<Radio_1.default label={cleanedAttrs.label} className={classNames} key={key} {...cleanedAttrs}/>);
                        }
                        else {
                            return (<Input_1.default className={classNames} key={key} {...cleanedAttrs}/>);
                        }
                    case "LABEL":
                        (0, html_1.transferLabelInnerText)(r);
                        return;
                    case "TEXTAREA":
                        return (<Textarea_1.default defaultValue={r.innerText} className={classNames} key={key} {...cleanedAttrs}/>);
                    case "BUTTON":
                        return (<core_1.Element is={Button_1.Button} key={key} r={r} d={d} i={i} id={key} propId={key}/>);
                    case "FORM":
                        return (<form className={classNames} key={key} {...cleanedAttrs}>
                  <Child root={r} d={d.concat(i)}/>
                </form>);
                    case "SVG":
                        return <core_1.Element is={Svg_1.Svg} key={key} r={r} id={key} propId={key}/>;
                    case "ADDRESS":
                        return (<address className={classNames} key={key} {...cleanedAttrs}>
                  <Text_1.Text className={""} text={r.innerText} key={key} id={key}/>
                </address>);
                    case "FIGURE":
                        return (<figure className={classNames} key={key} {...cleanedAttrs}>
                  <Child root={r} d={d.concat(i)}/>
                </figure>);
                    case "IMG":
                        return (<core_1.Element is={Image_1.Image} key={key} d={d} i={i} classNames={classNames} attrs={cleanedAttrs} id={key} propId={key}/>);
                    case "ARTICLE":
                    case "DL":
                    case "DD":
                    case "DT":
                        return (<article className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </article>);
                    case "SCRIPT":
                        return null;
                    case "LINK":
                        return (<link className={classNames} {...cleanedAttrs} key={key}></link>);
                    case "BR":
                        return <br className={classNames} key={key}/>;
                    case "UL":
                        return (<ul className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </ul>);
                    case "LI":
                        return (<li className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </li>);
                    case "CITE":
                        return (<cite className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </cite>);
                    case "HR":
                        return <hr className={classNames} key={key}></hr>;
                    case "IFRAME":
                        return (<iframe className={classNames} {...cleanedAttrs} key={key}/>);
                    case "STYLE":
                        return <style key={key}>{r.innerText}</style>;
                    case "TABLE":
                        return (<table className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </table>);
                    case "THEAD":
                        return (<thead className={classNames} {...cleanedAttrs} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </thead>);
                    case "TBODY":
                        return (<tbody className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </tbody>);
                    case "TR":
                        return (<tr className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </tr>);
                    case "TD":
                        return (<td className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </td>);
                    case "TH":
                        return (<th className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </th>);
                    case "FIGCAPTION":
                        return (<figcaption className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)}/>
                </figcaption>);
                    default:
                        return <p key={key}>Unknown container</p>;
                }
            }
            else if (r.nodeType === 3) {
                if (r.innerText.trim() === "")
                    return null;
                return (<Text_1.Text className={classNames} text={(_b = r.innerText) !== null && _b !== void 0 ? _b : ""} key={key} id={key}/>);
            }
            else {
                return <p key={key}>Unknown type</p>;
            }
        })}
    </>);
};
exports.default = Child;
const Component = ({ root }) => {
    const { connectors, node } = (0, core_1.useNode)((node) => ({ node }));
    return (<div id={node.id} ref={(ref) => {
            connectors.connect(ref);
        }}>
      <Child root={root}/>
    </div>);
};
exports.Component = Component;
