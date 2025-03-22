import { ChatInput } from "@/components/ChatInput";
import { GitHubRibbon } from "@/components/GitHubRibbon";
import { useRef, useState } from "react";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [, setCanGenerate] = useState(false);

  const handleReset = () => {
    // Reload the page to reset everything
    window.location.reload();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="min-h-screen grid grid-rows-[auto_1fr_auto] p-4 pb-24 print:p-0 bg-[hsl(var(--app-background))] print:bg-white"
      ref={containerRef}
    >
      <GitHubRibbon className="print:hidden" />
      {/* Header */}
      <header className="bg-[hsl(var(--app-background))] rounded-lg p-4 text-center print:hidden">
        <button
          onClick={handleReset}
          className="hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl font-bold text-[#433633]">Gastronaut AI</h1>
        </button>
        <p className="text-sm text-[#5C5552] mt-1">
          Your AI-powered culinary companion for recipe discovery
        </p>
        {recipe && (
          <button
            onClick={handlePrint}
            className="mt-2 px-4 py-2 bg-[#433633] text-white rounded hover:bg-[#5C5552] transition-colors"
          >
            Print Recipe
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="bg-[hsl(var(--app-background))] p-4 w-full max-w-[1800px] mx-auto flex flex-col print:p-0 print:bg-white">
        <div className="flex-1 flex flex-col print:block">
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
