import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export async function generateRecipe(params: {
  ingredients: string;
  experience: string;
  cookTime: number;
  servings: number;
  cuisine?: string;
  mealType?: string;
  dietaryGoal?: string;
  exclusions?: string;
  equipment?: string;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a recipe based on these parameters:
    - Ingredients: ${params.ingredients}
    - Cook Experience Level: ${params.experience}
    - Available Time: ${params.cookTime} minutes
    - Servings: ${params.servings}
    ${params.cuisine ? `- Preferred Cuisine: ${params.cuisine}` : ""}
    ${params.mealType ? `- Meal Type: ${params.mealType}` : ""}
    ${params.dietaryGoal ? `- Dietary Goals: ${params.dietaryGoal}` : ""}
    ${params.exclusions ? `- Dietary Restrictions: ${params.exclusions}` : ""}
    ${params.equipment ? `- Available Equipment: ${params.equipment}` : ""}

    Please provide:
    1. Recipe name
    2. Brief description
    3. Ingredients list with measurements
    4. Step-by-step instructions
    5. Cooking tips based on the experience level
    6. Estimated preparation and cooking time`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe");
  }
}
