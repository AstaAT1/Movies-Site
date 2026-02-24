import * as React from "react";
import { cn } from "../../lib/utils";

const TabsContext = React.createContext(null);

function Tabs({ defaultValue, value, onValueChange, children, className, ...props }) {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue || "");
    const current = value !== undefined ? value : activeTab;
    const handleChange = (val) => onValueChange ? onValueChange(val) : setActiveTab(val);

    return (
        <TabsContext.Provider value={{ value: current, onValueChange: handleChange }}>
            <div className={cn("w-full", className)} {...props}>{children}</div>
        </TabsContext.Provider>
    );
}

function TabsList({ className, children, ...props }) {
    return (
        <div
            role="tablist"
            className={cn("inline-flex items-center gap-1 rounded-lg bg-muted p-1", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function TabsTrigger({ value, className, children, ...props }) {
    const ctx = React.useContext(TabsContext);
    const isActive = ctx?.value === value;
    return (
        <button
            role="tab"
            aria-selected={isActive}
            onClick={() => ctx?.onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

function TabsContent({ value, className, children, ...props }) {
    const ctx = React.useContext(TabsContext);
    if (ctx?.value !== value) return null;
    return <div role="tabpanel" className={cn("mt-3", className)} {...props}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
