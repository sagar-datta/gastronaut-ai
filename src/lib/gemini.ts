import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

interface RecipeInput {
  ingredients: string;
  optionalIngredients: string;
  experience: string;
  cookTime: number;
  servings: number;
  cuisine?: string;
  mealType?: string;
  dietaryGoal?: string;
  exclusions?: string;
  equipment?: string;
  itemsToRemove?: {
    ingredients: string[];
    equipment: string[];
  };
}

const getExperienceDescription = (level: string) => {
  switch (level) {
    case "beginner":
      return `Beginner Cook:
- Limited cooking experience
- Needs detailed explanations of basic techniques
- Prefers simple recipes with common ingredients
- Benefits from step-by-step guidance
- May need explanations of cooking terms
- Appreciates tips about common mistakes to avoid
- Prefers recipes with minimal multitasking`;
    case "intermediate":
      return `Home Chef:
- Comfortable with basic cooking techniques
- Can handle multiple steps and some multitasking
- Familiar with common cooking terms
- Can follow recipes without detailed explanations
- Comfortable with basic knife skills
- Can handle more complex timing requirements
- Open to trying new techniques with guidance`;
    case "advanced":
      return `Professional:
- Extensive cooking experience
- Comfortable with complex techniques
- Expert at multitasking in the kitchen
- Understands cooking terminology
- Excellent knife skills
- Can handle complex timing and temperature control
- Comfortable with recipe modifications`;
    default:
      return "Beginner Cook";
  }
};

export async function generateRecipe({
  ingredients,
  optionalIngredients,
  experience,
  cookTime,
  servings,
  cuisine,
  mealType,
  dietaryGoal,
  exclusions,
  equipment,
  itemsToRemove,
}: RecipeInput): Promise<string> {
  // Combine ingredient exclusions
  const allIngredientExclusions = itemsToRemove?.ingredients?.length
    ? `${exclusions ? `${exclusions}\n` : ""}${itemsToRemove.ingredients.join(
        "\n"
      )}`
    : exclusions;

  // Combine equipment exclusions
  const allEquipmentExclusions = itemsToRemove?.equipment?.length
    ? `${
        equipment ? `\nThe following equipment is NOT available:\n` : ""
      }${itemsToRemove.equipment.join("\n")}`
    : "";

  const prompt = `You are a professional chef creating a recipe. Please create a detailed, easy-to-follow recipe based on these specifications:

INGREDIENTS MANAGEMENT:
Required Ingredients (MUST be used in the recipe as key components):
${ingredients}

Note about required ingredients:
- These ingredients should be featured prominently in the recipe
- Create a complete dish that incorporates these ingredients
- Add complementary ingredients to create a proper meal
- Do not simply provide instructions for cooking the ingredients alone
- Basic pantry items (salt, pepper, oil, etc.) can be assumed available
- Common spices and seasonings can be added as needed

${
  optionalIngredients
    ? `Optional Available Ingredients (user has these available):
${optionalIngredients}

Note about optional ingredients:
- These are simply ingredients the user has available
- They may not all make culinary sense with the required ingredients
- Use professional judgment to determine which (if any) would enhance the dish
- Only incorporate ingredients that make sense for the recipe
- Ignore ingredients that would clash or not complement the dish
- Consider traditional and modern flavor combinations
- Focus on ingredients that will improve the final result

IMPORTANT CULINARY GUIDELINES:
1. The final recipe MUST be culinarily sound and appetizing
2. Do NOT combine ingredients that clash in flavor or texture
3. Maintain traditional or logical flavor profiles
4. Reject any optional ingredients that would create unusual or unpleasant combinations
5. Focus on creating a cohesive, well-balanced dish
6. Consider cultural and traditional cooking practices
7. Avoid experimental or questionable flavor combinations
8. Ensure all ingredient combinations follow established culinary principles
9. The recipe should be something you would confidently serve in a restaurant

CRITICAL RECIPE REQUIREMENTS:
1. NEVER combine dessert items (like ice cream) with savory main dishes
2. Create a complete, well-seasoned dish (not just plain ingredients)
3. Add appropriate aromatics, seasonings, and complementary ingredients
4. Ensure the recipe follows established cooking techniques
5. Optional ingredients should only be used if they genuinely enhance the dish
6. The final dish must be something commonly served in restaurants
7. If optional ingredients don't fit the dish, ignore them completely
8. Focus on creating a proper, complete recipe that makes culinary sense

Additional Ingredients:
- Basic pantry items can be assumed available (salt, pepper, oil, etc.)
- Common spices and seasonings can be added as needed
- Additional ingredients can be suggested if they significantly enhance the dish
- Keep any extra ingredients simple and commonly available
- Consider the specified cuisine style when suggesting additions
- All additions must maintain culinary coherence`
    : ""
}

MANDATORY RESTRICTIONS:
${
  allIngredientExclusions
    ? `The following ingredients and their derivatives MUST NOT be used under any circumstances:
${allIngredientExclusions}

You must ensure:
1. None of these ingredients appear in the recipe
2. No derivatives or related ingredients are used
3. No suggested substitutions include these items
4. No cross-contamination risks are introduced
5. All replacements are completely free of these items`
    : ""
}

${
  dietaryGoal
    ? `DIETARY REQUIREMENTS:
Primary Goal: ${dietaryGoal}

This recipe MUST strictly adhere to these dietary specifications:
1. For specific diets (e.g., vegetarian, vegan, kosher):
   - Exclude ALL non-compliant ingredients
   - Ensure no cross-contamination suggestions
   - Verify all suggested substitutes are compliant
   
2. For macronutrient goals (e.g., high-protein, low-carb):
   - Prioritize ingredients that match the dietary goal
   - Include approximate macronutrient ratios
   - Suggest modifications to further align with the goal
   - Focus cooking techniques that support the dietary requirement

3. For health-specific diets:
   - Strictly avoid any non-compliant ingredients
   - Consider ingredient interactions
   - Include relevant nutritional notes`
    : ""
}

COOKING PARAMETERS:
Experience Level:
${getExperienceDescription(experience)}

Time Constraints:
- Maximum Total Time Allowed: ${cookTime} minutes
This is a STRICT maximum time limit that includes:
1. All preparation time (washing, chopping, measuring)
2. All cooking time (heating, cooking, baking)
3. Any resting or cooling time required
4. Any sauce or garnish preparation
The recipe MUST be completable within ${cookTime} minutes by someone of the specified experience level.

Cuisine Preference:
${
  cuisine
    ? `The recipe should align with ${cuisine} cuisine where possible:
- Prioritize ${cuisine} cooking techniques and flavor profiles
- Consider fusion approaches if ingredients aren't traditional
- Adapt methods while maintaining authentic flavors
- Use available ingredients creatively to match the cuisine style`
    : ""
}

Meal Context:
${
  mealType
    ? `Desired meal specifications:
- Time of Day: Consider appropriate dishes for ${mealType}
- Meal Type: Adapt recipe complexity and portion size accordingly
- Consider traditional meal patterns for this time of day
- Ensure the recipe suits the intended dining occasion`
    : ""
}

Kitchen Equipment Context:
${
  equipment
    ? `Available Equipment:
${equipment}
${allEquipmentExclusions}

CRITICAL EQUIPMENT RESTRICTIONS:
- The user DOES NOT have access to: ${itemsToRemove?.equipment?.join(", ")}
- You MUST NOT suggest any techniques that require the excluded equipment
- You MUST NOT mention or reference the excluded equipment anywhere in the recipe
- If a step typically uses excluded equipment, you MUST provide alternative methods
- All cooking methods MUST use only the available equipment
- Ensure every step can be completed with the equipment listed as available
- If a traditional technique requires excluded equipment, you MUST provide a different approach

Equipment Guidelines:
- Only use the available equipment listed above
- Adapt ALL techniques to work with available tools
- Basic kitchen equipment can be assumed available EXCEPT excluded items
- Consider equipment limitations in timing estimates
- If a crucial technique requires excluded equipment, provide a complete alternative method`
    : ""
}

Other Parameters:
- Serving Size: ${servings} ${servings === 1 ? "person" : "people"}

Please create a recipe that:
1. Strictly adheres to all ingredient restrictions and dietary requirements
2. Primarily uses the required ingredients listed
3. May incorporate optional ingredients if they enhance the dish
4. MUST be completable within ${cookTime} minutes total time
   - Include efficient prep techniques
   - Consider parallel tasks where appropriate for the skill level
   - Account for all preparation and cooking steps
   - Include any resting or cooling time in the total
5. Precisely matches the specified cooking experience level:
   - Use appropriate techniques for their skill level
   - Provide explanations matching their expertise
   - Include tips specific to their experience level
   - Adjust complexity of steps accordingly
6. Aligns with cuisine preference when possible:
   - Adapt traditional techniques to available ingredients
   - Maintain authentic flavors while being flexible with methods
   - Consider fusion approaches when traditional ingredients aren't available
7. Suits the specified meal context:
   - Appropriate for the time of day
   - Matches the desired meal type
   - Considers typical eating patterns
8. Provides clear, step-by-step instructions
9. Includes helpful cooking tips

Format the recipe in markdown using this exact structure:

# [Recipe Name]

## Description
[Write an appetizing description of the dish in 2-3 sentences. Include what makes it special and what to expect from the final result.]

## Ingredients
For [number] servings:
- [List each ingredient with precise measurements]
- [Group optional ingredients separately if used]

## Equipment Needed
- [List essential equipment and tools required]
- [Include any optional but helpful tools]

## Instructions
1. [Clear, actionable step]
2. [Each step should be concise and specific]
3. [Include cooking temperatures where relevant]
4. [Include timing for each major step]
${
  experience === "beginner"
    ? "5. [Include explanations for any cooking terms or techniques]"
    : ""
}

## Cooking Tips
- [Include 3-4 tips specific to this recipe]
- [Add tips matching the cook's experience level]
- [Include substitution suggestions if relevant]
${experience === "beginner" ? "- [Include common mistakes to avoid]" : ""}

## Time Breakdown
- Prep Time: [X] minutes
- Cook Time: [Y] minutes
- Total Time: [Z] minutes (MUST be less than or equal to ${cookTime} minutes)
- [Include any parallel tasks or time-saving notes]

Formatting Rules:
1. Never use bold text (**) anywhere in the recipe
2. Keep numbered steps simple and clear
3. Use plain text throughout
4. Include exact measurements and temperatures
5. Be specific with timing in instructions
6. ${
    experience === "beginner"
      ? "Explain all cooking terms and techniques"
      : experience === "intermediate"
      ? "Explain advanced techniques only"
      : "Focus on precision and efficiency"
  }`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe");
  }
}
