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

interface ModificationInput {
  originalRecipe: string;
  modification: string;
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
  1. [First step details]
  2. [Second step details]
  3. [Third step details]
  4. [Continue with clear, concise steps]
  
  ## Cooking Tips
  - [Tip 1 relevant to experience level]
  - [Tip 2]
  - [etc...]
  
  ## Time Breakdown
  - Prep Time: [X] minutes
  - Cook Time: [Y] minutes
  - Total Time: [Z] minutes

  Important formatting rules:
  1. Never use bold text (**) in any section
  2. Keep steps simple and numbered
  3. Use plain text for all instructions
  4. Each instruction step should be a simple statement without colons or special formatting`;

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

export async function generateRecipeModification({
  originalRecipe,
  modification,
}: ModificationInput): Promise<{
  suggestedChanges: string;
  proposedRecipe: string;
}> {
  const prompt = `Given this recipe:

${originalRecipe}

Please modify it according to this request: "${modification}"

Important: Your response must follow this EXACT format with these EXACT labels:

CHANGES:
[Write a brief, friendly explanation of the modifications made]

RECIPE:
[Paste the complete modified recipe here]

Rules:
1. Never use placeholders like [ingredient] - always specify real ingredients
2. Never use bold text (**) anywhere
3. Keep the exact same markdown format as the original
4. Include the complete recipe with all sections`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split the response into changes and recipe
    const [changesSection, recipeSection] = text.split("RECIPE:");

    if (!changesSection || !recipeSection) {
      throw new Error("Invalid response format");
    }

    const changes = changesSection.replace("CHANGES:", "").trim();
    const recipe = recipeSection.trim();

    return {
      suggestedChanges: changes,
      proposedRecipe: recipe,
    };
  } catch (error) {
    console.error("Modification error:", error);
    throw new Error(
      "Failed to modify recipe. Please try again with a different request."
    );
  }
}
