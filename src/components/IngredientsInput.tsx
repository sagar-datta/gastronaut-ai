import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface IngredientsInputProps {
  input: string;
  optionalIngredients: string;
  setInput: (value: string) => void;
  setOptionalIngredients: (value: string) => void;
}

export function IngredientsInput({
  input,
  optionalIngredients,
  setInput,
  setOptionalIngredients,
}: IngredientsInputProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
        <CardDescription>
          List your ingredients with approximate amounts - don't worry about
          being too precise!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="font-medium text-[#433633]">Required Ingredients</div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 2 chicken breasts, a bag of rice..."
            className="flex-1 min-h-[100px] resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="font-medium flex sm:items-center sm:flex-row flex-col gap-2">
            <span className="text-[#433633]">Optional Ingredients</span>
            <span className="text-sm font-normal text-[#5C5552]">
              (Nice to have, but not essential)
            </span>
          </div>
          <Textarea
            value={optionalIngredients}
            onChange={(e) => setOptionalIngredients(e.target.value)}
            placeholder="e.g., fresh herbs, spices, garnishes..."
            className="flex-1 min-h-[100px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
