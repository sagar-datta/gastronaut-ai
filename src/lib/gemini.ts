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
  1. [Simple step description without any formatting, bold text, or headings]
  2. [Next step in plain text only]
  3. [Continue with plain numbered steps]
  
  ## Cooking Tips
  - [Tip 1 relevant to experience level]
  - [Tip 2]
  - [etc...]
  
  ## Time Breakdown
  - Prep Time: [X] minutes
  - Cook Time: [Y] minutes
  - Total Time: [Z] minutes

  Important formatting rules:
  1. Never use bold text (**) anywhere in the recipe
  2. Instructions should be simple numbered steps without any headings or formatting
  3. Each instruction should be a plain text description without colons or special characters
  4. Do not add titles or headings within the numbered steps`;

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
  proposedRecipe: string | null;
}> {
  const prompt = `Given this recipe:

${originalRecipe}

The user's message is: "${modification}"

Important formatting rules:
1. Use this exact structure:
   # [Recipe Name]
   
   ## Ingredients
   - [ingredient with amount]
   
   ## Instructions
   1. [step]
   2. [step]
   
   ## Cooking Tips
   - [tip]
   
   ## Time Breakdown
   - Prep: [X] minutes
   - Cook: [Y] minutes
   - Total: [Z] minutes

2. Never use bold text (**) in any section
3. Keep steps simple and numbered
4. Use plain text for all instructions

When handling modifications:
1. For direct modification requests (e.g., "make it vegan"):
   - Suggest specific changes in suggestedChanges
   - Include the complete modified recipe in proposedRecipe

2. For confirmations of previous suggestions:
   - Implement the previously suggested changes
   - Set suggestedChanges to explain what was changed
   - Include the modified recipe in proposedRecipe

3. For unclear requests:
   - Set suggestedChanges to ask for clarification
   - Set proposedRecipe to null

Keep responses conversational but specific about what will be changed.
Ensure the recipe maintains the same markdown formatting as the original.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);

      if (!parsed.suggestedChanges) {
        throw new Error("Missing suggestedChanges in response");
      }

      return {
        suggestedChanges: parsed.suggestedChanges,
        proposedRecipe: parsed.proposedRecipe || null,
      };
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      console.error("Raw response:", text);

      return {
        suggestedChanges:
          "I apologize, but I couldn't process that modification. Could you try rephrasing your request?",
        proposedRecipe: null,
      };
    }
  } catch (error) {
    console.error("Error generating recipe modification:", error);
    throw new Error("Failed to modify recipe");
  }
}
