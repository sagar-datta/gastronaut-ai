import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, disabled, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    disabled={disabled}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full",
        disabled ? "bg-[#E3E0DE]/50" : "bg-[#E3E0DE]"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full rounded-full",
          disabled ? "bg-[#433633]/50" : "bg-[#433633]"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={
        disabled
          ? cn(
              "block h-4 w-4 rounded-full border border-border bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-default"
            )
          : cn(
              "block h-4 w-4 rounded-full border border-border bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer",
              disabled && "!cursor-default"
            )
      }
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
