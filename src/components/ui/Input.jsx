import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
    <input
        type={type}
        className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors",
            className
        )}
        ref={ref}
        {...props}
    />
));
Input.displayName = "Input";

export { Input };
