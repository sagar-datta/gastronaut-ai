import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface OptionalSettingsProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  cuisine: string;
  setCuisine: (value: string) => void;
  mealType: string;
  setMealType: (value: string) => void;
  dietaryGoal: string;
  setDietaryGoal: (value: string) => void;
  exclusions: string;
  setExclusions: (value: string) => void;
  equipment: string;
  setEquipment: (value: string) => void;
  isLoading: boolean;
}

const OptionalSettings: React.FC<OptionalSettingsProps> = ({
  cuisine,
  setCuisine,
  mealType,
  setMealType,
  dietaryGoal,
  setDietaryGoal,
  exclusions,
  setExclusions,
  equipment,
  setEquipment,
  isLoading,
}) => {
  // Memoize common card title styles
  const optionalText = useMemo(
    () => (
      <span className="text-sm font-normal text-[#5C5552]">(Optional)</span>
    ),
    []
  );

  // Memoize common textarea props
  const textareaProps = useMemo(
    () => ({
      className: "flex-1 min-h-[100px] resize-none",
      disabled: isLoading,
    }),
    [isLoading]
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cuisine Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Cuisine Preferences
              {optionalText}
            </CardTitle>
            <CardDescription>
              Describe your preferred style of cooking or specific cuisines
              you'd like to explore
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g., I love spicy Indian food, or I'd like to try making authentic Italian pasta..."
              {...textareaProps}
            />
          </CardContent>
        </Card>

        {/* Meal Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Meal Type
              {optionalText}
            </CardTitle>
            <CardDescription>
              Describe what kind of meal you're planning to make and its context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              placeholder="e.g., Post-workout dinner, light lunch for work, weekend brunch with friends..."
              {...textareaProps}
            />
          </CardContent>
        </Card>

        {/* Dietary Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Dietary Goals
              {optionalText}
            </CardTitle>
            <CardDescription>
              Tell us about your nutritional preferences or dietary objectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={dietaryGoal}
              onChange={(e) => setDietaryGoal(e.target.value)}
              placeholder="e.g., I'm looking for high-protein meals for muscle gain, or I want to reduce carbs..."
              {...textareaProps}
            />
          </CardContent>
        </Card>

        {/* Dietary Restrictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Dietary Restrictions
              {optionalText}
            </CardTitle>
            <CardDescription>
              Tell us about any allergies, intolerances, or ingredients you'd
              like to avoid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              placeholder="e.g., peanuts, dairy, shellfish, mushrooms..."
              {...textareaProps}
            />
          </CardContent>
        </Card>

        {/* Equipment Section */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Cooking Equipment
              {optionalText}
            </CardTitle>
            <CardDescription>
              Tell us what cooking equipment you have available - this helps us
              suggest suitable recipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="e.g., oven, stovetop, slow cooker, air fryer..."
              {...textareaProps}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptionalSettings;
