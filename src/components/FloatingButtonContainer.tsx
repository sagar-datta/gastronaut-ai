import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown } from "lucide-react";
import { Printer } from "lucide-react";

interface FloatingButtonContainerProps {
  externalRecipe: string | null;
  isLoading: boolean;
  hasItemsToRemove: boolean;
  getButtonText: (isSmallScreen: boolean) => string;
  getOSShortcut: () => string;
  handleGenerateRecipe: () => Promise<void>;
  setIsCollapsibleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  input: string;
}

export function FloatingButtonContainer({
  externalRecipe,
  isLoading,
  hasItemsToRemove,
  getButtonText,
  getOSShortcut,
  handleGenerateRecipe,
  setIsCollapsibleOpen,
  input,
}: FloatingButtonContainerProps) {
  const [buttonState, setButtonState] = useState<"modify" | "recipe">("modify");

  useEffect(() => {
    const handleScroll = () => {
      if (externalRecipe) {
        const recipeHeading = document.querySelector(
          ".recipe-display h2" // More robust selector
        );
        if (recipeHeading) {
          const recipeHeadingOffsetTop =
            recipeHeading.getBoundingClientRect().top + window.scrollY;
          if (window.scrollY < recipeHeadingOffsetTop - 50) {
            // Adjust offset as needed, e.g., -50px to trigger slightly before heading is at the very top
            setButtonState("recipe");
          } else {
            setButtonState("modify");
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [externalRecipe]);

  const isRecipeButton = buttonState === "recipe";
  const buttonText = isRecipeButton ? "Recipe" : "Modify"; // Ensure initializer

  return (
    <div className="fixed bottom-0 left-0 right-0 print:hidden z-50 pointer-events-none">
      <div className="relative">
        {/* Button container - only this should be interactive */}
        <div
          className="absolute inset-0 bg-[hsl(var(--app-background))]/95 backdrop-blur-[12px] transition-all duration-500"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 33%, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.7) 55%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.3) 65%, rgba(0, 0, 0, 0.1) 70%, transparent 80%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 33%, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.7) 55%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.3) 65%, rgba(0, 0, 0, 0.1) 70%, transparent 80%)",
          }}
        />
        <div className="relative pb-6 pt-16">
          <div className="w-full max-w-[1800px] mx-auto flex justify-center gap-2 px-4">
            <div className="pointer-events-auto flex gap-2 items-center">
              {externalRecipe && !isLoading && (
                <Button
                  variant="outline"
                  size={isRecipeButton ? "default" : "lg"}
                  className="lg:hidden text-[#433633]"
                  onClick={() => {
                    if (isRecipeButton) {
                      // Scroll to recipe heading
                      const recipeHeading = document.querySelector(
                        ".recipe-display h2" // More robust selector
                      );
                      if (recipeHeading) {
                        recipeHeading.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    } else {
                      // Scroll to top (modify view) - existing behavior, apply to screens smaller than lg
                      if (window.innerWidth < 1024) { // 1024px is Tailwind's lg breakpoint

                      const container = document.documentElement;
                      const startPosition = container.scrollTop;
                      const duration = 50; // Super short duration, almost instant
                      const startTime = performance.now();
                      const scroll = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Simple linear animation for fastest execution
                        container.scrollTop = startPosition * (1 - progress);
                        if (progress < 1) {
                          requestAnimationFrame(scroll);
                        } else {
                          setIsCollapsibleOpen((prev) => !prev);
                        }
                      };
                      requestAnimationFrame(scroll);
                      }
                    }
                  }}
                >
                  {isRecipeButton ? (
                    <div className="flex items-center gap-2">
                      {buttonText} <ChevronDown className="h-4 w-4" />
                    </div>
                  ) : (
                    <>
                      <span className="sm:hidden">{buttonText}</span>
                      <span className="hidden sm:inline">Modify Recipe</span>
                    </>
                  )}
                </Button>
              )}
              <TooltipProvider>
                <Tooltip delayDuration={50}>
                  {" "}
                  {/* tooltip shows on hover with shorter delay */}
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="px-8"
                      disabled={
                        isLoading || (!input.trim() && !hasItemsToRemove)
                      }
                      onClick={handleGenerateRecipe}
                    >
                      <span className="sm:hidden">{getButtonText(true)}</span>
                      <span className="hidden sm:inline">
                        {getButtonText(false)}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="hidden lg:block">
                    <p>
                      Press {getOSShortcut()} + ↵ to{" "}
                      {hasItemsToRemove
                        ? "remove"
                        : externalRecipe
                        ? "regenerate"
                        : "generate"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {externalRecipe && !isLoading && (
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        variant="outline"
                        className="px-8 sm:flex hidden items-center gap-2 text-[#433633]"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-4 w-4 text-[#433633]" />
                        Print Recipe
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden lg:block">
                      <p>Press {getOSShortcut()} + P to print</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
