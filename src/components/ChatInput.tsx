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
import { useState, useRef, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Printer } from "lucide-react";
import { generateRecipe } from "@/lib/gemini";
import { RecipeDisplay } from "./RecipeDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatInputProps {
  onRecipeChange?: (recipe: string | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onCanGenerateChange?: (canGenerate: boolean) => void;
  scrollContainer?: React.RefObject<HTMLDivElement>;
  recipe: string | null;
}

export function ChatInput({
  onRecipeChange,
  onLoadingChange,
  onCanGenerateChange,
  scrollContainer,
  recipe: externalRecipe,
}: ChatInputProps) {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [optionalIngredients, setOptionalIngredients] = useState("");
  const [hasSetHandler, setHasSetHandler] = useState(false);

  const handleGenerateRecipe = useCallback(async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      onLoadingChange?.(true);
      setIsCollapsibleOpen(false);
      if (scrollContainer?.current) {
        scrollContainer.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      const response = await generateRecipe({
        ingredients: input,
        optionalIngredients,
        experience,
        cookTime,
        servings,
        cuisine,
        mealType,
        dietaryGoal,
        exclusions,
        equipment,
      });
      onRecipeChange?.(response);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }, [
    input,
    optionalIngredients,
    experience,
    cookTime,
    servings,
    cuisine,
    mealType,
    dietaryGoal,
    exclusions,
    equipment,
    onRecipeChange,
    onLoadingChange,
    scrollContainer,
  ]);

  // Update parent components when input changes - only update canGenerate state
  useEffect(() => {
    onCanGenerateChange?.(!!input.trim());
  }, [input, onCanGenerateChange]);

  // Set the generate handler only once on mount
  useEffect(() => {
    if (!hasSetHandler) {
      setHasSetHandler(true);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleTimeChange = (value: number[]) => {
    setCookTime(Math.max(15, value[0]));
  };

  const handleServingsChange = (value: number[]) => {
    setServings(Math.max(1, value[0]));
  };

  return (
    <div className="h-full" ref={containerRef}>
      <motion.div
        className="flex flex-col lg:flex-row h-full relative print:!block print:!w-full"
        initial={false}
        animate={{
          gap: 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Chat Input Section */}
        {externalRecipe || isLoading ? (
          <Collapsible
            className="w-full lg:w-1/2 lg:max-w-[900px] print:!hidden"
            open={isCollapsibleOpen}
            onOpenChange={setIsCollapsibleOpen}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-4 lg:hidden mx-auto"
              >
                <span>Modify Recipe</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent
              forceMount
              className="hidden lg:block data-[state=open]:block"
            >
              <motion.div
                className="flex flex-col h-full overflow-hidden print:!hidden"
                initial={false}
                animate={{
                  width: "100%",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Existing chat input content */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-8 sm:p-6 p-0">
                    {/* Experience Level Section */}
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Experience Level</CardTitle>
                        <CardDescription>
                          Select your comfort level in the kitchen to get
                          personalized recipe suggestions
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
                              <TabsTrigger value="beginner">
                                Beginner Cook
                              </TabsTrigger>
                              <TabsTrigger value="intermediate">
                                Home Chef
                              </TabsTrigger>
                              <TabsTrigger value="advanced">
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
                          >
                            <SelectTrigger className="font-medium">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="beginner"
                                className="font-medium"
                              >
                                Beginner Cook
                              </SelectItem>
                              <SelectItem
                                value="intermediate"
                                className="font-medium"
                              >
                                Home Chef
                              </SelectItem>
                              <SelectItem
                                value="advanced"
                                className="font-medium"
                              >
                                Professional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Time and Servings */}
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
                                <span className="text-muted-foreground">
                                  minutes
                                </span>
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
                          List your ingredients with approximate amounts - don't
                          worry about being too precise!
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <div className="font-medium">
                            Required Ingredients
                          </div>
                          <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., 2 chicken breasts, a bag of rice..."
                            className="flex-1 min-h-[100px] resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium flex sm:items-center sm:flex-row flex-col gap-2">
                            Optional Ingredients
                            <span className="text-sm font-normal text-muted-foreground">
                              (Nice to have, but not essential)
                            </span>
                          </div>
                          <Textarea
                            value={optionalIngredients}
                            onChange={(e) =>
                              setOptionalIngredients(e.target.value)
                            }
                            placeholder="e.g., fresh herbs, spices, garnishes..."
                            className="flex-1 min-h-[100px] resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Settings Collapsible */}
                    <Collapsible
                      open={isOpen}
                      onOpenChange={setIsOpen}
                      className="w-full space-y-2 col-span-1"
                    >
                      <div className="flex justify-center">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 p-4"
                          >
                            <span>Optional Extra Inputs</span>
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
                                Describe your preferred style of cooking or
                                specific cuisines you'd like to explore
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
                                Describe what kind of meal you're planning to
                                make and its context
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
                                Tell us about your nutritional preferences or
                                dietary objectives
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
                                Tell us what cooking equipment you have
                                available - this helps us suggest suitable
                                recipes
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
                  </div>
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          // Original chat input when no recipe
          <motion.div
            className="flex flex-col h-full overflow-hidden print:!hidden"
            initial={false}
            animate={{
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Existing chat input content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="grid grid-cols-1 gap-8 sm:p-6 p-0">
                {/* Experience Level Section */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Experience Level</CardTitle>
                    <CardDescription>
                      Select your comfort level in the kitchen to get
                      personalized recipe suggestions
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
                          <TabsTrigger value="beginner">
                            Beginner Cook
                          </TabsTrigger>
                          <TabsTrigger value="intermediate">
                            Home Chef
                          </TabsTrigger>
                          <TabsTrigger value="advanced">
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
                      <Select value={experience} onValueChange={setExperience}>
                        <SelectTrigger className="font-medium">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner" className="font-medium">
                            Beginner Cook
                          </SelectItem>
                          <SelectItem
                            value="intermediate"
                            className="font-medium"
                          >
                            Home Chef
                          </SelectItem>
                          <SelectItem value="advanced" className="font-medium">
                            Professional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Time and Servings */}
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
                            <span className="text-muted-foreground">
                              minutes
                            </span>
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
                      List your ingredients with approximate amounts - don't
                      worry about being too precise!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="font-medium">Required Ingredients</div>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., 2 chicken breasts, a bag of rice..."
                        className="flex-1 min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium flex sm:items-center sm:flex-row flex-col gap-2">
                        Optional Ingredients
                        <span className="text-sm font-normal text-muted-foreground">
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

                {/* Additional Settings Collapsible */}
                <Collapsible
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  className="w-full space-y-2 col-span-1"
                >
                  <div className="flex justify-center">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 p-4"
                      >
                        <span>Optional Extra Inputs</span>
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
                            Describe what kind of meal you're planning to make
                            and its context
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
                            Tell us about your nutritional preferences or
                            dietary objectives
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Recipe Display Section */}
        <AnimatePresence mode="sync">
          {(externalRecipe || isLoading) && (
            <motion.div
              className="w-full lg:w-1/2 print:!static print:!w-full print:!block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full p-6 space-y-4 print:!hidden"
                  >
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
                  </motion.div>
                ) : externalRecipe ? (
                  <motion.div
                    key="recipe"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full overflow-y-auto print:!w-full print:!max-w-none"
                  >
                    <div className="print:!break-inside-avoid-page">
                      <RecipeDisplay content={externalRecipe} />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add the floating button with progressive blur effect */}
      <div className="fixed bottom-0 left-0 right-0 print:hidden z-50 pointer-events-none">
        <div className="relative">
          {/* Single blur layer with mask gradient - click-through */}
          <div
            className="absolute inset-0 bg-white/95 backdrop-blur-[12px] transition-all duration-500"
            style={{
              maskImage:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)",
            }}
          />

          {/* Button container - only this should be interactive */}
          <div className="relative pb-6 pt-24">
            <div className="w-full max-w-[1800px] mx-auto flex justify-center gap-2 px-4">
              <div className="pointer-events-auto">
                <Button
                  size="lg"
                  className="px-8"
                  disabled={isLoading || !input.trim()}
                  onClick={handleGenerateRecipe}
                >
                  {isLoading
                    ? "Generating..."
                    : externalRecipe
                    ? "Regenerate Recipe"
                    : "Generate Recipe"}
                </Button>
              </div>

              {externalRecipe && !isLoading && (
                <div className="pointer-events-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 flex items-center gap-2"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4" />
                    Print Recipe
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
