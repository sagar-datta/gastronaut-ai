import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [equipment, setEquipment] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [exclusions, setExclusions] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookTime, setCookTime] = useState(15);
  const [dietaryGoal, setDietaryGoal] = useState("");
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState("");

  const handleTimeChange = (value: number[]) => {
    setCookTime(Math.max(15, value[0]));
  };

  const handleServingsChange = (value: number[]) => {
    setServings(Math.max(1, value[0]));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Experience Level Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Experience Level</CardTitle>
          <CardDescription>
            Select your comfort level in the kitchen to get personalized recipe
            suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="beginner"
            value={experience}
            onValueChange={setExperience}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Beginner Cook</TabsTrigger>
              <TabsTrigger value="intermediate">Home Chef</TabsTrigger>
              <TabsTrigger value="advanced">Professional</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Time Constraints */}
      <Card>
        <CardHeader>
          <CardTitle>Time Available</CardTitle>
          <CardDescription>
            How much time do you have for cooking and preparation?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={cookTime <= 15}
                onClick={() => setCookTime((prev) => Math.max(15, prev - 5))}
              >
                -
              </Button>
              <div className="text-lg min-w-[120px] text-center">
                <span className="font-bold">{cookTime}</span>{" "}
                <span className="text-muted-foreground">minutes</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={cookTime >= 180}
                onClick={() => setCookTime((prev) => Math.min(180, prev + 5))}
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
      <Card>
        <CardHeader>
          <CardTitle>Serving Size</CardTitle>
          <CardDescription>
            How many people are you cooking for?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={servings <= 1}
                onClick={() => setServings((prev) => Math.max(1, prev - 1))}
              >
                -
              </Button>
              <div className="text-lg min-w-[120px] text-center">
                <span className="font-bold">{servings}</span>{" "}
                <span className="text-muted-foreground">
                  {servings === 1 ? "person" : "people"}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={servings >= 18}
                onClick={() => setServings((prev) => Math.min(18, prev + 1))}
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

      {/* Ingredients Section */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>
            List your ingredients with approximate amounts - don't worry about
            being too precise!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 2 chicken breasts, a bag of rice, some carrots, onions..."
            className="flex-1 min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Cuisine Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Cuisine Preferences</CardTitle>
          <CardDescription>
            Describe your preferred style of cooking or specific cuisines you'd
            like to explore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="e.g., I love spicy Indian food, or I'd like to try making authentic Italian pasta, or I enjoy fusion cuisines..."
            className="flex-1 min-h-[100px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Dietary Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Goals</CardTitle>
          <CardDescription>
            Tell us about your nutritional preferences or dietary objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={dietaryGoal}
            onChange={(e) => setDietaryGoal(e.target.value)}
            placeholder="e.g., I'm looking for high-protein meals for muscle gain, or I want to reduce carbs while keeping meals filling..."
            className="flex-1 min-h-[100px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Meal Type */}
      <Card>
        <CardHeader>
          <CardTitle>Meal Type</CardTitle>
          <CardDescription>
            Describe what kind of meal you're planning to make and its context
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            placeholder="e.g., Post-workout dinner, light lunch for work, weekend brunch with friends, healthy afternoon snack..."
            className="flex-1 min-h-[100px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Allergies and Exclusions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Restrictions</CardTitle>
          <CardDescription>
            Tell us about any allergies, intolerances, or ingredients you'd like
            to avoid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={exclusions}
            onChange={(e) => setExclusions(e.target.value)}
            placeholder="e.g., peanuts, dairy, shellfish, mushrooms..."
            className="flex-1"
          />
        </CardContent>
      </Card>

      {/* Equipment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cooking Equipment</CardTitle>
          <CardDescription>
            Tell us what cooking equipment you have available - this helps us
            suggest suitable recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            placeholder="e.g., oven, stovetop, slow cooker, air fryer..."
            className="flex-1"
          />
        </CardContent>
      </Card>
    </div>
  );
}
