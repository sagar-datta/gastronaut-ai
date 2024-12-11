import { ChatInput } from "@/components/ChatInput";
import { useState, useRef } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

function App() {
  const [hasRecipe, setHasRecipe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRecipeChange = (recipe: string | null) => {
    setHasRecipe(!!recipe);
  };

  return (
    <div
      className="min-h-screen grid grid-rows-[auto_1fr] p-4"
      ref={containerRef}
    >
      {/* Header */}
      <header className="bg-white rounded-lg p-4 text-center print:hidden">
        <h1 className="text-2xl font-bold">Gastronaut AI</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your AI-powered culinary companion for recipe discovery
        </p>
      </header>

      {/* Main content */}
      <main className="bg-white rounded-lg p-4 w-full max-w-[1800px] mx-auto flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="w-full h-full">
            <ChatInput
              onRecipeChange={handleRecipeChange}
              scrollContainer={containerRef}
            />
          </div>
        </div>
      </main>
      <SpeedInsights />
    </div>
  );
}

export default App;
