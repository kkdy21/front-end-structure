import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const spinnerVariants = cva(
    "animate-spin rounded-full border-primary border-t-transparent",
    {
        variants: {
            size: {
                sm: "size-4 border-2",
                md: "size-8 border-2",
                lg: "size-12 border-[3px]",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
)

function Spinner({
    className,
    size,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof spinnerVariants>) {
    return (
        <div
            data-slot="spinner"
            role="status"
            aria-label="Loading"
            className={cn(spinnerVariants({ size }), className)}
            {...props}
        />
    )
}

function SpinnerContainer({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="spinner-container"
            className={cn("flex flex-col items-center justify-center gap-3", className)}
            {...props}
        >
            {children}
        </div>
    )
}

function SpinnerText({
    className,
    ...props
}: React.ComponentProps<"p">) {
    return (
        <p
            data-slot="spinner-text"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

function SpinnerFullPage({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="spinner-fullpage"
            className={cn("flex h-screen w-full items-center justify-center", className)}
            {...props}
        >
            {children}
        </div>
    )
}

export {
    Spinner,
    SpinnerContainer,
    SpinnerText,
    SpinnerFullPage,
    spinnerVariants,
}
