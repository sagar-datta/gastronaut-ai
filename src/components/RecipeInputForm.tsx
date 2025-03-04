import React, { useMemo } from "react";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExperienceLevelInput } from "./ExperienceLevelInput";
import { IngredientsInput } from "./IngredientsInput";
import OptionalSettings from "./OptionalSettings";
import { TimeServingsInput } from "./TimeServingsInput";
import { Button } from "@/components/ui/button";

interface RecipeInputFormProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  optionalIngredients: string;
  setOptionalIngredients: React.Dispatch<React.SetStateAction<string>>;
  experience: string;
  setExperience: React.Dispatch<React.SetStateAction<string>>;
  exclusions: string;
  setExclusions: React.Dispatch<React.SetStateAction<string>>;
  cuisine: string;
  setCuisine: React.Dispatch<React.SetStateAction<string>>;
  cookTime: number;
  setCookTime: React.Dispatch<React.SetStateAction<number>>;
  dietaryGoal: string;
  setDietaryGoal: React.Dispatch<React.SetStateAction<string>>;
  servings: number;
  setServings: React.Dispatch<React.SetStateAction<number>>;
  mealType: string;
  setMealType: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  externalRecipe: string | null;
  equipment: string;
  setEquipment: React.Dispatch<React.SetStateAction<string>>;
}

export const RecipeInputForm: React.FC<RecipeInputFormProps> = ({
  input,
  setInput,
  optionalIngredients,
  setOptionalIngredients,
  experience,
  setExperience,
  exclusions,
  setExclusions,
  cuisine,
  setCuisine,
  cookTime,
  setCookTime,
  dietaryGoal,
  setDietaryGoal,
  servings,
  setServings,
  mealType,
  setMealType,
  isOpen,
  setIsOpen,
  isLoading,
  externalRecipe,
  equipment,
  setEquipment,
}) => {
  // Memoize the collapsible change handler
  const handleCollapsibleChange = useMemo(
    () => (open: boolean) => {
      if (!open) {
        // Get the trigger button position before animation starts
        const trigger = document.querySelector("[data-optional-trigger]");
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          const scrollTarget =
            window.scrollY + rect.top - window.innerHeight + rect.height + 100;

          // First scroll to position
          new Promise<void>((resolve) => {
            window.scrollTo({
              top: scrollTarget,
              behavior: "smooth",
            });
            setTimeout(resolve, 500);
          }).then(() => {
            setIsOpen(open);
          });
        }
      } else {
        setIsOpen(open);
      }
    },
    [setIsOpen]
  );

  // Memoize the button class and content since they only depend on isOpen
  const optionalButton = useMemo(
    () => ({
      className:
        "flex items-center gap-2 p-4 text-[#433633] hover:bg-[#E3E0DE]",
      content: (
        <>
          <span>Optional Extra Inputs</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </>
      ),
    }),
    [isOpen]
  );

  return (
    <div className="grid grid-cols-1 gap-8 sm:p-6 p-0">
      {/* Experience Level Section */}
      <ExperienceLevelInput
        experience={experience}
        setExperience={setExperience}
        externalRecipe={externalRecipe}
        isLoading={isLoading}
      />

      {/* Time and Servings */}
      <TimeServingsInput
        cookTime={cookTime}
        setCookTime={setCookTime}
        servings={servings}
        setServings={setServings}
        externalRecipe={externalRecipe}
        isLoading={isLoading}
      />

      {/* Ingredients Section */}
      <IngredientsInput
        input={input}
        optionalIngredients={optionalIngredients}
        setInput={setInput}
        setOptionalIngredients={setOptionalIngredients}
        isLoading={isLoading}
      />

      {/* Additional Settings Collapsible */}
      <Collapsible
        open={isOpen}
        onOpenChange={handleCollapsibleChange}
        className="w-full space-y-2 col-span-1"
      >
        <div className="flex justify-center">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={optionalButton.className}
              data-optional-trigger
            >
              {optionalButton.content}
            </Button>
          </CollapsibleTrigger>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                opacity: { duration: 0.3 },
              }}
            >
              <OptionalSettings
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                cuisine={cuisine}
                setCuisine={setCuisine}
                mealType={mealType}
                setMealType={setMealType}
                dietaryGoal={dietaryGoal}
                setDietaryGoal={setDietaryGoal}
                exclusions={exclusions}
                setExclusions={setExclusions}
                equipment={equipment}
                setEquipment={setEquipment}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
};

export default RecipeInputForm;
