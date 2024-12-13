import { ChatInput } from "@/components/ChatInput";
import { useRef, useState } from "react";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [, setCanGenerate] = useState(false);

  return (
    <div
      className="min-h-screen grid grid-rows-[auto_1fr_auto] p-4 pb-24 print:p-4 bg-[hsl(var(--app-background))]"
      ref={containerRef}
    >
      {/* Header */}
      <header className="bg-[hsl(var(--app-background))] rounded-lg p-4 text-center print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Gastronaut AI</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your AI-powered culinary companion for recipe discovery
        </p>
      </header>

      {/* Main content */}
      <main className="bg-[hsl(var(--app-background))] rounded-lg p-4 w-full max-w-[1800px] mx-auto flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="w-full h-full">
            <ChatInput
              scrollContainer={containerRef}
              onCanGenerateChange={setCanGenerate}
              onLoadingChange={setIsLoading}
              onRecipeChange={setRecipe}
              recipe={recipe}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
