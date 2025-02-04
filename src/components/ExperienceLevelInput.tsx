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
                className="data-[state=active]:text-[#433633]"
                disabled={isLoading}
              >
                Beginner Cook
              </TabsTrigger>
              <TabsTrigger
                value="intermediate"
                className="data-[state=active]:text-[#433633]"
                disabled={isLoading}
              >
                Home Chef
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="data-[state=active]:text-[#433633]"
                disabled={isLoading}
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
            disabled={isLoading}
          >
            <SelectTrigger className="font-medium text-[#433633]">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="beginner"
                className="font-medium text-[#433633]"
              >
                Beginner Cook
              </SelectItem>
              <SelectItem
                value="intermediate"
                className="font-medium text-[#433633]"
              >
                Home Chef
              </SelectItem>
              <SelectItem
                value="advanced"
                className="font-medium text-[#433633]"
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
