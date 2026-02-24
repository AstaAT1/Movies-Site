import * as React from "react";
import { createContext, useContext, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const SheetContext = createContext(null);

function Sheet({ children, open, onOpenChange }) {
    return (
        <SheetContext.Provider value={{ open, onOpenChange }}>
            {children}
        </SheetContext.Provider>
    );
}

function SheetTrigger({ children, className, ...props }) {
    const { onOpenChange } = useContext(SheetContext);
    return (
        <button className={cn("cursor-pointer", className)} onClick={() => onOpenChange(true)} {...props}>
            {children}
        </button>
    );
}

function SheetContent({ children, className, side = "right", ...props }) {
    const { open, onOpenChange } = useContext(SheetContext);
    const handleKey = useCallback((e) => { if (e.key === "Escape") onOpenChange(false); }, [onOpenChange]);

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleKey);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [open, handleKey]);

    const slideVariants = {
        right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
        left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    };
    const v = slideVariants[side] || slideVariants.right;

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />
                    <motion.div
                        initial={v.initial}
                        animate={v.animate}
                        exit={v.exit}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className={cn(
                            "fixed z-50 flex flex-col gap-4 bg-background border-border p-6 shadow-xl",
                            side === "right" && "inset-y-0 right-0 h-full w-[85%] max-w-sm border-l",
                            side === "left" && "inset-y-0 left-0 h-full w-[85%] max-w-sm border-r",
                            className
                        )}
                        role="dialog"
                        aria-modal="true"
                        {...props}
                    >
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function SheetHeader({ className, ...props }) {
    return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
    return <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle };
