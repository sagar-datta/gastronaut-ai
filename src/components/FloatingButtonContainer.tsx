import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Printer } from "lucide-react";

interface FloatingButtonContainerProps {
  externalRecipe: string | null;
  isLoading: boolean;
  hasItemsToRemove: boolean;
  getButtonText: (isSmallScreen: boolean) => string;
  getOSShortcut: () => string;
  handleGenerateRecipe: () => Promise<void>;
  setIsCollapsibleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement>; // Add containerRef prop
  input: string;
}

const MASK_GRADIENT = {
  maskImage:
    "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 33%, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.7) 55%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.3) 65%, rgba(0, 0, 0, 0.1) 70%, transparent 80%)",
  WebkitMaskImage:
    "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 33%, rgba(0, 0, 0, 0.95) 45%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.7) 55%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.3) 65%, rgba(0, 0, 0, 0.1) 70%, transparent 80%)",
};

export function FloatingButtonContainer({
  externalRecipe,
  isLoading,
  hasItemsToRemove,
  getButtonText,
  getOSShortcut,
  handleGenerateRecipe,
  setIsCollapsibleOpen,
  containerRef, // Destructure containerRef prop
  input,
}: FloatingButtonContainerProps) {
  const [buttonState, setButtonState] = useState<"modify" | "scroll">("modify");
  const [isAtTop, setIsAtTop] = useState(true);
  const recipeHeadingRef = useRef<HTMLElement | null>(null);

  // Cache recipe heading element and setup IntersectionObserver
  useEffect(() => {
    recipeHeadingRef.current = document.querySelector(".recipe-display h2");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setButtonState("modify"); // Recipe heading is out of view (below), show "Modify"
          } else {
            setButtonState("scroll"); // Recipe heading is in view (or above), show "Scroll"
          }
        });
      },
      {
        rootMargin: "-100px 0px 0px 0px", // Consider heading out of view when 100px from top
        threshold: 0, // Trigger when element is fully out of view
      }
    );

    if (recipeHeadingRef.current) {
      observer.observe(recipeHeadingRef.current);
    }

    return () => {
      observer.disconnect(); // Cleanup observer on unmount
    };
  }, [externalRecipe]);


  useEffect(() => {
    const isTop = window.scrollY < 100;
    setIsAtTop(isTop);
  }, []);


  const handleMobileButtonClick = useCallback(() => {
    if (buttonState === "scroll") {
      const recipeDisplayElement = document.querySelector(".recipe-display");
      recipeDisplayElement?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
     // Scroll to top to show input form (Modify Recipe action)
     window.scrollTo({
       top: 0,
       behavior: "smooth",
     });
    }
  }, [buttonState]);
 
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const ScrollToTopButton = useMemo(
    () =>
      externalRecipe &&
      !isLoading &&
      !isAtTop && (
        <div className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2">
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:flex hidden text-[#433633]"
                  onClick={handleScrollToTop}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" align="center">
                <p>Scroll to Top</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    [externalRecipe, isLoading, isAtTop, handleScrollToTop]
  ); // Removed updateButtonState and isTop dependencies


  return (
    <div className="fixed bottom-0 left-0 right-0 print:hidden z-50 pointer-events-none">
      <div className="relative">
        <div
          className="absolute inset-0 bg-[hsl(var(--app-background))]/95 backdrop-blur-[12px] transition-all duration-500"
          style={MASK_GRADIENT}
        />
        <div className="relative pb-6 pt-16">
          <div className="w-full max-w-[1800px] mx-auto relative">
            {ScrollToTopButton}
            <div className="pointer-events-auto flex gap-2 items-center justify-center">
              {externalRecipe && !isLoading && (
                <Button
                  variant="outline"
                  size="lg"
                  className="lg:hidden text-[#433633]"
                  onClick={handleMobileButtonClick}
                >
                  {buttonState === "scroll" ? (
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 ml-[-4px] mr-[-4px]" />
                      <span className="sm:hidden">Scroll</span>
                      <span className="hidden sm:inline">Scroll to Recipe</span>
                    </div>
                  ) : (
                    <>
                      <span className="sm:hidden">Modify</span>
                      <span className="hidden sm:inline">Modify Recipe</span>
                     </>
                  )}
                </Button>
              )}
              <TooltipProvider>
                <Tooltip delayDuration={50}>
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
