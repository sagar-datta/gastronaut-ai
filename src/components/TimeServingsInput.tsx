import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
  const handleTimeChange = (value: number[]) => {
    setCookTime(Math.max(15, value[0]));
  };

  const handleServingsChange = (value: number[]) => {
    setServings(Math.max(1, value[0]));
  };

  return (
    <div
      className={`grid grid-cols-1 ${
        externalRecipe || isLoading
          ? "[&>*]:col-span-1 min-[1255px]:grid-cols-2"
          : "md:grid-cols-2"
      } gap-8 col-span-1`}
    >
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
                disabled={cookTime <= 15}
                onClick={() => setCookTime(Math.max(15, cookTime - 5))}
                className="text-[#433633] disabled:text-[#5C5552]"
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
                disabled={cookTime >= 180}
                onClick={() => setCookTime(Math.min(180, cookTime + 5))}
                className="text-[#433633] disabled:text-[#5C5552]"
              >
                +
              </Button>
            </div>
            <Slider
              value={[cookTime]}
              onValueChange={handleTimeChange}
              min={0}
              max={180}
              step={5}
              className="pt-2"
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
                disabled={servings <= 1}
                onClick={() => setServings(Math.max(1, servings - 1))}
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
                disabled={servings >= 18}
                onClick={() => setServings(Math.min(18, servings + 1))}
              >
                +
              </Button>
            </div>
            <Slider
              value={[servings]}
              onValueChange={handleServingsChange}
              min={0}
              max={18}
              step={1}
              className="pt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
