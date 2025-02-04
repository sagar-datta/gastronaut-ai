import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface TimeServingsInputProps {
  cookTime: number;
  setCookTime: (value: number) => void;
  servings: number;
  setServings: (value: number) => void;
  externalRecipe: string | null;
  isLoading: boolean;
}

export const TimeServingsInput: React.FC<TimeServingsInputProps> = ({
  cookTime,
  setCookTime,
  servings,
  setServings,
  externalRecipe,
  isLoading,
}) => {
  // Memoize grid class since it depends on externalRecipe and isLoading
  const gridClass = useMemo(
    () =>
      `grid grid-cols-1 ${
        externalRecipe || isLoading
          ? "[&>*]:col-span-1 min-[1255px]:grid-cols-2"
          : "md:grid-cols-2"
      } gap-8 col-span-1`,
    [externalRecipe, isLoading]
  );

  // Memoize button class since it only depends on isLoading
  const buttonClass = useMemo(
    () => cn("text-[#433633] disabled:text-[#5C5552]"),
    []
  );

  return (
    <div className={gridClass}>
      {/* Time Constraints */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Time Available</CardTitle>
          <CardDescription>How much time do you have to cook?</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={cookTime <= 15 || isLoading}
                onClick={() => setCookTime(Math.max(15, cookTime - 5))}
                className={buttonClass}
              >
                -
              </Button>
              <div className="text-lg min-w-[120px] text-center">
                <span className="font-bold text-[#433633]">{cookTime}</span>{" "}
                <span className="text-[#5C5552]">minutes</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={cookTime >= 180 || isLoading}
                onClick={() => setCookTime(Math.min(180, cookTime + 5))}
                className={buttonClass}
              >
                +
              </Button>
            </div>
            <Slider
              value={[cookTime]}
              onValueChange={(value) => setCookTime(Math.max(15, value[0]))}
              min={0}
              max={180}
              step={5}
              className="pt-2"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Serving Size */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Serving Size</CardTitle>
          <CardDescription>
            How many people are you cooking for?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={servings <= 1 || isLoading}
                onClick={() => setServings(Math.max(1, servings - 1))}
                className={buttonClass}
              >
                -
              </Button>
              <div className="text-lg min-w-[120px] text-center">
                <span className="font-bold text-[#433633]">{servings}</span>{" "}
                <span className="text-[#5C5552]">
                  {servings === 1 ? "person" : "people"}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={servings >= 18 || isLoading}
                onClick={() => setServings(Math.min(18, servings + 1))}
                className={buttonClass}
              >
                +
              </Button>
            </div>
            <Slider
              value={[servings]}
              onValueChange={(value) => setServings(Math.max(1, value[0]))}
              min={0}
              max={18}
              step={1}
              className="pt-2"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
