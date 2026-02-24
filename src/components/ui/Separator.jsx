import * as React from "react";
import { cn } from "../../lib/utils";

function Separator({ className, orientation = "horizontal", ...props }) {
    return (
        <div
            role="separator"
            aria-orientation={orientation}
            className={cn(
                orientation === "horizontal"
                    ? "h-px w-full separator-gradient"
                    : "w-px h-full bg-border",
                className
            )}
            {...props}
        />
    );
}

export { Separator };
