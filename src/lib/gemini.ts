import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

interface RecipeInput {
  ingredients: string;
  experience: string;
  cookTime: number;
  servings: number;
  cuisine?: string;
  mealType?: string;
  dietaryGoal?: string;
  exclusions?: string;
  equipment?: string;
}

export async function generateRecipe({
  ingredients,
  experience,
  cookTime,
  servings,
  cuisine,
  mealType,
  dietaryGoal,
  exclusions,
  equipment,
}: RecipeInput): Promise<string> {
  const prompt = `Create a detailed recipe that uses common pantry ingredients along with ${ingredients}. The recipe should:
  - Be suitable for a ${experience} level cook
  - Take about ${cookTime} minutes to prepare and cook
  - Serve ${servings} ${servings === 1 ? "person" : "people"}
  ${cuisine ? `- Include elements of ${cuisine} cuisine` : ""}
  ${mealType ? `- Be suitable as a ${mealType}` : ""}
  ${dietaryGoal ? `- Meet these dietary goals: ${dietaryGoal}` : ""}
  ${exclusions ? `- Avoid these ingredients: ${exclusions}` : ""}
  ${equipment ? `- Use this available equipment: ${equipment}` : ""}

  Format the recipe in markdown using this structure:

  # [Recipe Name]
  
  ## Description
  [A brief, appetizing description of the dish]
  
  ## Ingredients
  - [ingredient 1 with amount]
  - [ingredient 2 with amount]
  - [etc...]
  
  ## Instructions
  1. Prep ingredients: [First step details]
  2. Heat the pan: [Second step details]
  3. Cook the main ingredients: [Third step details]
  4. [Continue with clear, concise steps in the format "Step description: Details"]
  
  ## Cooking Tips
  - [Tip 1 relevant to experience level]
  - [Tip 2]
  - [etc...]
  
  ## Time Breakdown
  - Prep Time: [X] minutes
  - Cook Time: [Y] minutes
  - Total Time: [Z] minutes

  Important formatting notes:
  - Do not use any bold text (**) in the instructions
  - Each instruction step should be in the format "Step description: Details"
  - Keep the markdown formatting simple and clean

  Make sure the recipe:
  - Is complete and balanced (protein, vegetables, carbs if appropriate)
  - Uses common accompaniments and seasonings
  - Includes proper seasoning amounts
  - Has clear portion sizes
  - Provides specific temperatures and cooking times`;

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
