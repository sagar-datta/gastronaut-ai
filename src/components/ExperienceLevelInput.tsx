import React from "react";
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
        <div
          className={`${
            externalRecipe || isLoading
              ? "min-[950px]:block hidden"
              : "min-[500px]:block hidden"
          }`}
        >
          <Tabs
            defaultValue="beginner"
            value={experience}
            onValueChange={setExperience}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="beginner"
                className={cn("data-[state=active]:text-[#433633]")}
                className={isLoading ? cn("data-[state=active]:text-[#433633] cursor-not-allowed") : cn("data-[state=active]:text-[#433633]")} // Conditional cursor
                // Removed disabled prop
              >
               Beginner Cook
             </TabsTrigger>
              <TabsTrigger
                value="intermediate"
                disabled={isLoading}
                className={
                  isLoading
                    ? cn("data-[state=active]:text-[#433633] cursor-not-allowed")
                    : cn("data-[state=active]:text-[#433633]") // Conditional cursor
                }
              >
                Home Chef
             </TabsTrigger>
              <TabsTrigger
                value="advanced"
                disabled={isLoading}
                className={
                  isLoading
                    ? cn("data-[state=active]:text-[#433633]", "cursor-not-allowed")
                    : cn("data-[state=active]:text-[#433633]") // Conditional cursor
                }
              >
                Professional

              </TabsTrigger>
           </TabsList>
          </Tabs>
        </div>
        <div
          className={`${
            externalRecipe || isLoading
              ? "min-[950px]:hidden block"
              : "min-[500px]:hidden block"
          }`}
        >
          <Select
            value={experience}
            onValueChange={setExperience}
            // Removed disabled prop
          >
            <SelectTrigger className="font-medium text-[#433633]">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="beginner"
                className={cn(
                  "font-medium text-[#433633]",
                  isLoading ? "cursor-not-allowed" : "" // Conditional cursor
                )}
              >
                Beginner Cook
              </SelectItem>
              <SelectItem
                value="intermediate"
                className={cn(
                  "font-medium text-[#433633]",
                  isLoading ? "cursor-not-allowed" : "" // Conditional cursor
                 )}
              >
                Home Chef
              </SelectItem>
              <SelectItem
                value="advanced"
                className={cn(
                  "font-medium text-[#433633]",
                  isLoading ? "cursor-not-allowed" : "" // Conditional cursor
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
