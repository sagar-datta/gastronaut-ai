import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";
import { Printer } from "lucide-react";
import { generateRecipe } from "@/lib/gemini";
import { RecipeDisplay } from "./RecipeDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckedItems } from "./RecipeDisplay";
import { RecipeInputForm } from "./RecipeInputForm"; import { FloatingButtonContainer } from "./FloatingButtonContainer";

interface ChatInputProps {
  onRecipeChange?: (recipe: string | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onCanGenerateChange?: (canGenerate: boolean) => void;
  scrollContainer?: React.RefObject<HTMLDivElement>;
  recipe: string | null;
}

const getOSShortcut = () => {
  // Check if running in browser environment
  if (typeof window === "undefined") return "Ctrl + ↵";

  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes("mac")) {
    return "⌘ + ↵";
  } else if (platform.includes("win")) {
    return "Ctrl + ↵";
  } else {
    return "Ctrl + Enter";
  }
};

const getPrintShortcut = () => {
  if (typeof window === "undefined") return "Ctrl + P";

  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes("mac")) {
    return "⌘ + P";
  } else if (platform.includes("win")) {
    return "Ctrl + P";
  } else {
    return "Ctrl + P";
  }
};

export function ChatInput({
  onRecipeChange,
  onLoadingChange,
  onCanGenerateChange,
  scrollContainer,
  recipe: externalRecipe,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [equipment, setEquipment] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [exclusions, setExclusions] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookTime, setCookTime] = useState(15);
  const [dietaryGoal, setDietaryGoal] = useState("");
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [optionalIngredients, setOptionalIngredients] = useState("");
  const [hasSetHandler, setHasSetHandler] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPrintHovered, setIsPrintHovered] = useState(false);
  const [isPrintMobileHovered, setIsPrintMobileHovered] = useState(false);
  const [itemsToRemove, setItemsToRemove] = useState<CheckedItems>({});
  const hasItemsToRemove = Object.values(itemsToRemove).some(
    (item) => item.checked
  );
  const [allRemovedItems, setAllRemovedItems] = useState<Set<string>>(
    new Set()
  );

  const getButtonText = React.useCallback(
    (isSmallScreen: boolean) => {
      if (isLoading) return "Generating...";
      if (hasItemsToRemove) return isSmallScreen ? "Remove" : "Remove Items";
      return isSmallScreen
        ? externalRecipe
          ? "Regenerate"
          : "Generate"
        : externalRecipe
        ? "Regenerate Recipe"
        : "Generate Recipe";
    },
    [isLoading, hasItemsToRemove, externalRecipe]
  );

  const handleGenerateRecipe = useCallback(async () => {
    if (!input.trim() && !hasItemsToRemove) return;

    try {
      setIsLoading(true);
      onLoadingChange?.(true);
      setIsCollapsibleOpen(false);

      if (scrollContainer?.current) {
        scrollContainer.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      let response;
      if (hasItemsToRemove) {
        const newItemsToRemove = Object.values(itemsToRemove)
          .filter((item) => item.checked)
          .reduce(
            (acc, item) => {
              if (item.type === "ingredients") {
                acc.ingredients.push(item.text);
              } else if (item.type === "equipment") {
                acc.equipment.push(item.text);
              }
              return acc;
            },
            { ingredients: [], equipment: [] } as {
              ingredients: string[];
              equipment: string[];
            }
          );

        response = await generateRecipe({
          ingredients: input,
          optionalIngredients,
          experience,
          cookTime,
          servings,
          cuisine,
          mealType,
          dietaryGoal,
          exclusions,
          equipment,
          itemsToRemove: newItemsToRemove,
        });
      } else {
        setAllRemovedItems(new Set());
        response = await generateRecipe({
          ingredients: input,
          optionalIngredients,
          experience,
          cookTime,
          servings,
          cuisine,
          mealType,
          dietaryGoal,
          exclusions,
          equipment,
        });
      }

      onRecipeChange?.(response);
      setItemsToRemove({});
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [
    input,
    optionalIngredients,
    experience,
    cookTime,
    servings,
    cuisine,
    mealType,
    dietaryGoal,
    exclusions,
    equipment,
    onRecipeChange,
    onLoadingChange,
    scrollContainer,
    hasItemsToRemove,
    itemsToRemove,
    externalRecipe,
    allRemovedItems,
  ]);

  // Update parent components when input changes - only update canGenerate state
  useEffect(() => {
    onCanGenerateChange?.(!!input.trim());
  }, [input]);

  // Set the generate handler only once on mount
  useEffect(() => {
    if (!hasSetHandler) {
      setHasSetHandler(true);
    }
  }, []); // Empty dependency array - only run once on mount

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if the screen is large enough (lg breakpoint is typically 1024px)
      if (window.innerWidth < 1024) return;

      // Check for Command/Control + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior

        // Only trigger if button would be enabled
        if (!isLoading && input.trim()) {
          handleGenerateRecipe();
        }
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleGenerateRecipe, isLoading, input]); // Dependencies for the effect

  return (
    <div className="h-full" ref={containerRef}>
      <motion.div
        className={`flex flex-col h-full relative print:!block print:!w-full ${
          externalRecipe || isLoading
            ? "lg:flex-row"
            : "lg:justify-center lg:items-center items-center" // Center when no recipe
        }`}
        initial={false}
        animate={{
          gap: 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Chat Input Section */}
        <AnimatePresence>
          <Collapsible
            className={`w-full lg:max-w-screen-lg print:!hidden ${
              externalRecipe || isLoading
                ? "lg:w-1/2"
                : ""
            }`}
            open={isCollapsibleOpen}
            onOpenChange={setIsCollapsibleOpen}
          >
            <RecipeInputForm
              input={input}
              setInput={setInput}
              optionalIngredients={optionalIngredients}
              setOptionalIngredients={setOptionalIngredients}
              experience={experience}
              setExperience={setExperience}
              exclusions={exclusions}
              setExclusions={setExclusions}
              cuisine={cuisine}
              setCuisine={setCuisine}
              cookTime={cookTime}
              setCookTime={setCookTime}
              dietaryGoal={dietaryGoal}
              setDietaryGoal={setDietaryGoal}
              servings={servings}
              setServings={setServings}
              mealType={mealType}
              setMealType={setMealType}
              equipment={equipment}
              setEquipment={setEquipment}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoading={isLoading}
              externalRecipe={externalRecipe}
            />
          </Collapsible>
        </AnimatePresence>

        {/* Recipe Display Section */}
        {externalRecipe || isLoading ? (
          <AnimatePresence mode="sync">
            <motion.div
              key="recipe-display-container" // Add a key for AnimatePresence
              className="w-full lg:w-1/2 print:!static print:!w-full print:!block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full p-6 space-y-4 print:!hidden"
                  >
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2 mt-8">
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-2 mt-8">
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-2 mt-8">
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </motion.div>
                ) : externalRecipe ? (
                  <motion.div
                    key="recipe"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full overflow-y-auto print:!w-full print:!max-w-none"
                  >
                    <div className="print:!break-inside-avoid-page">
                      <RecipeDisplay
                        content={externalRecipe}
                        onItemsChange={setItemsToRemove}
                      />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </motion.div>

      {/* Add the floating button with progressive blur effect */}
      <div className="fixed bottom-0 left-0 right-0 print:hidden z-50 pointer-events-none">
        <div className="relative">
          {/* Single blur layer with mask gradient - click-through */}
          <div
            className="absolute inset-0 bg-[hsl(var(--app-background))]/95 backdrop-blur-[12px] transition-all duration-500"
            style={{
              maskImage:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 33%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 70%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 33%, rgba(0,0,0,0.95) 45%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.7) 55%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.1) 70%, transparent 80%)",
            }}
          />

          {/* Button container - only this should be interactive */}
          <div className="relative pb-6 pt-16">
            <div className="w-full max-w-[1800px] mx-auto flex justify-center gap-2 px-4">
              <div className="pointer-events-auto flex gap-2 items-center">
                {externalRecipe && !isLoading && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="lg:hidden text-[#433633]"
                    onClick={() => {
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
                    }}
                  >
                    <span className="sm:hidden">Modify</span>
                    <span className="hidden sm:inline">Modify Recipe</span>
                  </Button>
                )}

                <TooltipProvider>
                  <Tooltip open={isHovered && window.innerWidth >= 1024}>
                    <TooltipTrigger asChild>
                      <Button
                        size="lg"
                        className="px-8"
                        disabled={
                          isLoading || (!input.trim() && !hasItemsToRemove)
                        }
                        onClick={handleGenerateRecipe}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <span className="sm:hidden">{getButtonText(true)}</span>
                        <span className="hidden sm:inline">
                          {getButtonText(false)}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden lg:block">
                      <p>
                        Press {getOSShortcut()} to{" "}
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
                  <>
                    <TooltipProvider>
                      <Tooltip
                        open={isPrintHovered && window.innerWidth >= 1024}
                      >
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            variant="outline"
                            className="px-8 sm:flex hidden items-center gap-2 text-[#433633]"
                            onClick={() => window.print()}
                            onMouseEnter={() => setIsPrintHovered(true)}
                            onMouseLeave={() => setIsPrintHovered(false)}
                          >
                            <Printer className="h-4 w-4 text-[#433633]" />
                            Print Recipe
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="hidden lg:block">
                          <p>Press {getPrintShortcut()} to print</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip
                        open={isPrintMobileHovered && window.innerWidth >= 1024}
                      >
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            variant="outline"
                            className="px-4 sm:hidden flex items-center text-[#433633]"
                            onClick={() => window.print()}
                            onMouseEnter={() => setIsPrintMobileHovered(true)}
                            onMouseLeave={() => setIsPrintMobileHovered(false)}
                          >
                            <Printer className="h-4 w-4 text-[#433633]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="hidden lg:block">
                          <p>Press {getPrintShortcut()} to print</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
