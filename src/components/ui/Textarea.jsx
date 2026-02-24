import * as React from "react";
import { cn } from "../../lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
    <textarea
        className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors resize-none",
            className
        )}
        ref={ref}
        {...props}
    />
));
Textarea.displayName = "Textarea";

export { Textarea };
