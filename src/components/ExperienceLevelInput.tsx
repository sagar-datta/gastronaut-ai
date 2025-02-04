import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ExperienceLevelInputProps {
  experience: string;
  setExperience: (experience: string) => void;
  externalRecipe: string | null;
  isLoading: boolean;
}

const ExperienceLevelInput: React.FC<ExperienceLevelInputProps> = ({
  experience,
  setExperience,
  externalRecipe,
  isLoading,
}) => {
  // Memoize the class names since they depend on externalRecipe and isLoading
  const displayClasses = useMemo(
    () => ({
      tabs:
        externalRecipe || isLoading
          ? "min-[950px]:block hidden"
          : "min-[500px]:block hidden",
      select:
        externalRecipe || isLoading
          ? "min-[950px]:hidden block"
          : "min-[500px]:hidden block",
    }),
    [externalRecipe, isLoading]
  );

  // Memoize the common tab trigger class logic
  const getTabTriggerClass = useMemo(
    () =>
      isLoading
        ? cn("data-[state=active]:text-[#433633]", "cursor-not-allowed")
        : cn("data-[state=active]:text-[#433633]"),
    [isLoading]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience Level</CardTitle>
        <CardDescription>
          Select your comfort level in the kitchen to get personalized recipe
          suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={displayClasses.tabs}>
          <Tabs
            defaultValue="beginner"
            value={experience}
            onValueChange={setExperience}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="beginner"
                className={getTabTriggerClass}
                disabled={isLoading}
              >
                Beginner Cook
              </TabsTrigger>
              <TabsTrigger
                value="intermediate"
                className={getTabTriggerClass}
                disabled={isLoading}
              >
                Home Chef
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className={getTabTriggerClass}
                disabled={isLoading}
              >
                Professional
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className={displayClasses.select}>
          <Select
            value={experience}
            onValueChange={setExperience}
            disabled={isLoading}
          >
            <SelectTrigger className="font-medium text-[#433633]">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="beginner"
                className={cn(
                  "font-medium text-[#433633]",
                  isLoading ? "cursor-not-allowed" : ""
                )}
              >
                Beginner Cook
              </SelectItem>
              <SelectItem
                value="intermediate"
                className={cn(
                  "font-medium text-[#433633]",
                  isLoading ? "cursor-not-allowed" : ""
                )}
              >
                Home Chef
              </SelectItem>
              <SelectItem
                value="advanced"
                className={cn(
                  "font-medium text-[#433633]",
                  isLoading ? "cursor-not-allowed" : ""
                )}
              >
                Professional
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export { ExperienceLevelInput };
