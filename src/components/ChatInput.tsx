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
+
+      <FloatingButtonContainer
+        externalRecipe={externalRecipe}
+        isLoading={isLoading}
+        hasItemsToRemove={hasItemsToRemove}
+        getButtonText={getButtonText}
+        getOSShortcut={getOSShortcut}
+        handleGenerateRecipe={handleGenerateRecipe}
+        setIsCollapsibleOpen={setIsCollapsibleOpen}
+        input={input}
+      />
+    </div>
+
+
  );
}
