import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const texturedButtonBase =
  "px-10 py-3 bg-center bg-no-repeat bg-[length:100%_100%] text-[#3c1f0a] font-semibold drop-shadow-lg hover:drop-shadow-xl transition-transform duration-200 hover:scale-[1.02] hover:brightness-105 border-none rounded-none min-h-[52px]";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200 relative",
  {
    variants: {
      variant: {
        default: `${texturedButtonBase} bg-[url('/images/ui/button.png')]`,
        green: `${texturedButtonBase} bg-[url('/images/ui/green_button.png')]`,
        red: `${texturedButtonBase} bg-[url('/images/ui/red_button.png')]`,
        rounded: "bg-[url('/images/ui/rounded_button.png')] bg-center bg-no-repeat bg-[length:100%_100%] text-[#3c1f0a] font-semibold drop-shadow-lg hover:drop-shadow-xl transition-transform duration-200 hover:scale-[1.02] hover:brightness-105 border-none rounded-full px-4 py-2",
        outline: "border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground shadow-md hover:shadow-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        wooden: "bg-gradient-to-br from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 shadow-lg hover:shadow-xl hover:scale-[1.02] border border-amber-500/20",
        banana: "bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 hover:from-yellow-300 hover:to-amber-300 font-bold shadow-lg hover:shadow-xl hover:shadow-yellow-500/30 hover:scale-[1.02] border border-yellow-500/20",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
