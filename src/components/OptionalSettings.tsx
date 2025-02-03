import React, { Dispatch, SetStateAction } from "react";
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
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cuisine: string;
  setCuisine: Dispatch<SetStateAction<string>>;
  mealType: string;
  setMealType: Dispatch<SetStateAction<string>>;
  dietaryGoal: string;
  setDietaryGoal: Dispatch<SetStateAction<string>>;
  exclusions: string;
  setExclusions: Dispatch<SetStateAction<string>>;
  equipment: string;
  setEquipment: Dispatch<SetStateAction<string>>;
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
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cuisine Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Cuisine Preferences
              <span className="text-sm font-normal text-[#5C5552]">
                (Optional)
              </span>
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
              className="flex-1 min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Meal Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Meal Type
              <span className="text-sm font-normal text-[#5C5552]">
                (Optional)
              </span>
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
              className="flex-1 min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Dietary Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Dietary Goals
              <span className="text-sm font-normal text-[#5C5552]">
                (Optional)
              </span>
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
              className="flex-1 min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Dietary Restrictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Dietary Restrictions
              <span className="text-sm font-normal text-[#5C5552]">
                (Optional)
              </span>
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
              className="flex-1 min-h-[70px] resize-none"
            />
          </CardContent>
        </Card>

        {/* Equipment Section */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Cooking Equipment
              <span className="text-sm font-normal text-[#5C5552]">
                (Optional)
              </span>
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
              className="flex-1 min-h-[70px] resize-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptionalSettings;
