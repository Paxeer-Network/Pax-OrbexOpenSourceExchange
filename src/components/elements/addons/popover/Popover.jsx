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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopoverContentClose = exports.PopoverClose = exports.PopoverDescription = exports.PopoverHeading = exports.PopoverContent = exports.PopoverTrigger = exports.Popover = exports.usePopoverContext = exports.usePopover = void 0;
const React = __importStar(require("react"));
const react_1 = require("@iconify/react");
const react_2 = require("@floating-ui/react");
function usePopover({ initialOpen = false, placement = "bottom", modal, open: controlledOpen, onOpenChange: setControlledOpen, } = {}) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
    const [labelId, setLabelId] = React.useState();
    const [descriptionId, setDescriptionId] = React.useState();
    const open = controlledOpen !== null && controlledOpen !== void 0 ? controlledOpen : uncontrolledOpen;
    const setOpen = setControlledOpen !== null && setControlledOpen !== void 0 ? setControlledOpen : setUncontrolledOpen;
    const data = (0, react_2.useFloating)({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: react_2.autoUpdate,
        middleware: [
            (0, react_2.offset)(5),
            (0, react_2.flip)({
                crossAxis: placement.includes("-"),
                fallbackAxisSideDirection: "end",
                padding: 5,
            }),
            (0, react_2.shift)({ padding: 5 }),
        ],
    });
    const context = data.context;
    const click = (0, react_2.useClick)(context, {
        enabled: controlledOpen == null,
    });
    const dismiss = (0, react_2.useDismiss)(context);
    const role = (0, react_2.useRole)(context);
    const interactions = (0, react_2.useInteractions)([click, dismiss, role]);
    return React.useMemo(() => ({
        open,
        setOpen,
        ...interactions,
        ...data,
        modal,
        labelId,
        descriptionId,
        setLabelId,
        setDescriptionId,
    }), [open, setOpen, interactions, data, modal, labelId, descriptionId]);
}
exports.usePopover = usePopover;
const PopoverContext = React.createContext(null);
const usePopoverContext = () => {
    const context = React.useContext(PopoverContext);
    if (context == null) {
        throw new Error("Popover components must be wrapped in <Popover />");
    }
    return context;
};
exports.usePopoverContext = usePopoverContext;
function Popover({ children, modal = false, ...restOptions }) {
    // This can accept any props as options, e.g. `placement`,
    // or other positioning options.
    const popover = usePopover({ modal, ...restOptions });
    return (<PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>);
}
exports.Popover = Popover;
exports.PopoverTrigger = React.forwardRef(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
    const context = (0, exports.usePopoverContext)();
    const childrenRef = children.ref;
    const ref = (0, react_2.useMergeRefs)([context.refs.setReference, propRef, childrenRef]);
    // `asChild` allows the user to pass any element as the anchor
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, context.getReferenceProps({
            ref,
            ...props,
            ...children.props,
            "data-state": context.open ? "open" : "closed",
        }));
    }
    return (<div ref={ref} role="button" 
    // The user can style the trigger based on the state
    data-state={context.open ? "open" : "closed"} {...context.getReferenceProps(props)}>
      {children}
    </div>);
});
exports.PopoverContent = React.forwardRef(function PopoverContent({ style, ...props }, propRef) {
    const { context: floatingContext, ...context } = (0, exports.usePopoverContext)();
    const ref = (0, react_2.useMergeRefs)([context.refs.setFloating, propRef]);
    if (!floatingContext.open)
        return null;
    return (<react_2.FloatingPortal>
      <react_2.FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div ref={ref} style={{ ...context.floatingStyles, ...style }} aria-labelledby={context.labelId} aria-describedby={context.descriptionId} {...context.getFloatingProps(props)}>
          {props.children}
        </div>
      </react_2.FloatingFocusManager>
    </react_2.FloatingPortal>);
});
exports.PopoverHeading = React.forwardRef(function PopoverHeading(props, ref) {
    const { setLabelId } = (0, exports.usePopoverContext)();
    const id = (0, react_2.useId)();
    // Only sets `aria-labelledby` on the Popover root element
    // if this component is mounted inside it.
    React.useLayoutEffect(() => {
        setLabelId(id);
        return () => setLabelId(undefined);
    }, [id, setLabelId]);
    return (<h5 {...props} ref={ref} id={id}>
      {props.children}
    </h5>);
});
exports.PopoverDescription = React.forwardRef(function PopoverDescription(props, ref) {
    const { setDescriptionId } = (0, exports.usePopoverContext)();
    const id = (0, react_2.useId)();
    // Only sets `aria-describedby` on the Popover root element
    // if this component is mounted inside it.
    React.useLayoutEffect(() => {
        setDescriptionId(id);
        return () => setDescriptionId(undefined);
    }, [id, setDescriptionId]);
    return <p {...props} ref={ref} id={id}/>;
});
exports.PopoverClose = React.forwardRef(function PopoverClose(props, ref) {
    const { setOpen } = (0, exports.usePopoverContext)();
    return (<button type="button" ref={ref} {...props} onClick={(event) => {
            var _a;
            (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, event);
            setOpen(false);
        }}>
      <react_1.Icon icon="lucide:x" className="w-4 h-4"/>
    </button>);
});
exports.PopoverContentClose = React.forwardRef((props, ref) => {
    const { children } = props;
    const { setOpen } = (0, exports.usePopoverContext)();
    // Function to clone the child element and add an additional onClick handler
    const enhanceChild = (child) => {
        const originalOnClick = child.props.onClick;
        return React.cloneElement(child, {
            onClick: (event) => {
                // Call the original onClick if it exists
                if (originalOnClick) {
                    originalOnClick(event);
                }
                // Then close the popover
                setOpen(false);
            },
        });
    };
    return (<div ref={ref}>
      {React.Children.map(children, (child) => 
        // Ensuring child is a valid element before enhancing
        React.isValidElement(child) ? enhanceChild(child) : child)}
    </div>);
});
exports.PopoverContentClose.displayName = "PopoverContentClose";
