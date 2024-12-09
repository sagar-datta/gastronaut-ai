import { ChatInput } from "@/components/ChatInput";

function App() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] gap-4 p-4">
      {/* Header */}
      <header className="bg-white rounded-lg p-4 text-center">
        <h1 className="text-2xl font-bold">Gastronaut AI</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your AI-powered culinary companion for recipe discovery
        </p>
      </header>

      {/* Wrapper div for centering */}
      <div className="flex justify-center w-full">
        {/* Main content */}
        <main className="bg-white rounded-lg p-4 w-full max-w-[1400px] flex flex-col">
          <div className="flex-1">
            <div className="max-w-4xl mx-auto">
              <ChatInput />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
