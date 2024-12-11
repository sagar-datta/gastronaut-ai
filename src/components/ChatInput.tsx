import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { generateRecipe, generateRecipeModification } from "@/lib/gemini";
import { RecipeDisplay } from "./RecipeDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onRecipeChange?: (recipe: string | null) => void;
}

export function ChatInput({ onRecipeChange }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [equipment, setEquipment] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [exclusions, setExclusions] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookTime, setCookTime] = useState(15);
  const [dietaryGoal, setDietaryGoal] = useState("");
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [modifications, setModifications] = useState<
    Array<{
      request: string;
      response: { recipe: string; response: string } | null;
      timestamp: Date;
    }>
  >([]);
  const [isProcessingMod, setIsProcessingMod] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [modifications]);

  const handleTimeChange = (value: number[]) => {
    setCookTime(Math.max(15, value[0]));
  };

  const handleServingsChange = (value: number[]) => {
    setServings(Math.max(1, value[0]));
  };

  const handleGenerateRecipe = async () => {
    try {
      setIsLoading(true);
      const response = await generateRecipe({
        ingredients: input,
        experience,
        cookTime,
        servings,
        cuisine,
        mealType,
        dietaryGoal,
        exclusions,
        equipment,
      });
      setRecipe(response);
      onRecipeChange?.(response);
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModification = async (input: string) => {
    const newModification = {
      request: input,
      response: null,
      timestamp: new Date(),
    };
    setModifications((prev) => [...prev, newModification]);
    setNotes("");

    setIsProcessingMod(true);
    try {
      const response = await generateRecipeModification({
        originalRecipe: recipe!,
        modification: input,
      });

      // Update the modifications with the response
      setModifications((prev) =>
        prev.map((mod, index) =>
          index === prev.length - 1
            ? {
                ...mod,
                response: {
                  recipe: response.proposedRecipe,
                  response: response.suggestedChanges,
                },
              }
            : mod
        )
      );

      // Update the main recipe display
      setRecipe(response.proposedRecipe);
      onRecipeChange?.(response.proposedRecipe);
    } catch (error) {
      console.error("Error:", error);
      setModifications((prev) =>
        prev.map((mod, index) =>
          index === prev.length - 1
            ? {
                ...mod,
                response: {
                  recipe: recipe!,
                  response:
                    "Failed to process modification. Please try again with a different request.",
                },
              }
            : mod
        )
      );
    } finally {
      setIsProcessingMod(false);
    }
  };

  return (
    <div className="h-full">
      <div
        className={`grid ${
          recipe || isLoading ? "grid-cols-2" : "grid-cols-1"
        } gap-6 h-full`}
      >
        {/* Left side - Chat Input */}
        <div
          className={`flex flex-col h-full overflow-hidden ${
            recipe || isLoading ? "" : "max-w-[900px] mx-auto w-full"
          } print:hidden`}
        >
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-1 gap-8 p-6">
              {/* Experience Level Section */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Experience Level</CardTitle>
                  <CardDescription>
                    Select your comfort level in the kitchen to get personalized
                    recipe suggestions
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

              {/* Time and Servings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 col-span-1">
                {/* Time Constraints */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Time Available</CardTitle>
                    <CardDescription>
                      How much time do you have to cook?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={cookTime <= 15}
                          onClick={() =>
                            setCookTime((prev) => Math.max(15, prev - 5))
                          }
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
                          onClick={() =>
                            setCookTime((prev) => Math.min(180, prev + 5))
                          }
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
                          onClick={() =>
                            setServings((prev) => Math.max(1, prev - 1))
                          }
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
                          onClick={() =>
                            setServings((prev) => Math.min(18, prev + 1))
                          }
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

              {/* Ingredients Section */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>
                    List your ingredients with approximate amounts - don't worry
                    about being too precise!
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

              {/* Additional Settings Collapsible */}
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="w-full space-y-2 col-span-1"
              >
                <div className="px-4">
                  <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80">
                    <h4 className="text-sm font-semibold text-foreground">
                      Optional Extra Inputs
                    </h4>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cuisine Preferences */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Cuisine Preferences
                          <span className="text-sm font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Describe your preferred style of cooking or specific
                          cuisines you'd like to explore
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
                          <span className="text-sm font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Describe what kind of meal you're planning to make and
                          its context
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
                          <span className="text-sm font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Tell us about your nutritional preferences or dietary
                          objectives
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
                          <span className="text-sm font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Tell us about any allergies, intolerances, or
                          ingredients you'd like to avoid
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
                          <span className="text-sm font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Tell us what cooking equipment you have available -
                          this helps us suggest suitable recipes
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
                </CollapsibleContent>
              </Collapsible>

              {/* Generate Recipe Button */}
              <div className="flex justify-center col-span-1">
                <Button
                  size="lg"
                  className="px-8"
                  onClick={handleGenerateRecipe}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? "Generating..." : "Generate Recipe"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Recipe Display or Skeleton */}
        <AnimatePresence>
          {(recipe || isLoading) && (
            <motion.div
              className="h-full"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {recipe ? (
                <div className="h-full overflow-y-auto print:w-full print:max-w-none">
                  <RecipeDisplay content={recipe} />
                </div>
              ) : isLoading ? (
                <div className="h-full p-6 space-y-4">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="space-y-2 mt-8">
                    {" "}
                    {/* Ingredients */}
                    <Skeleton className="h-8 w-1/4" /> {/* Section title */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="space-y-2 mt-8">
                    {" "}
                    {/* Instructions */}
                    <Skeleton className="h-8 w-1/4" /> {/* Section title */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="space-y-2 mt-8">
                    {" "}
                    {/* Tips */}
                    <Skeleton className="h-8 w-1/4" /> {/* Section title */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
