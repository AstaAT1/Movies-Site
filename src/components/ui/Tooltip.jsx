import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

function Tooltip({ children, content, side = "top", className }) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);

    const show = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsVisible(true), 200);
    };
    const hide = () => {
        clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    const posMap = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };
    const motionMap = {
        top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
        bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
        left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
        right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
    };
    const v = motionMap[side] || motionMap.top;

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={v.initial}
                        animate={v.animate}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className={cn(
                            "absolute z-50 pointer-events-none whitespace-nowrap rounded-md bg-popover border border-border px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md",
                            posMap[side],
                            className
                        )}
                        role="tooltip"
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export { Tooltip };
