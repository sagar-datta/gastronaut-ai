import { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] gap-4 p-4">
      {/* Header */}
      <header className="bg-muted rounded-lg p-4">
        Header content will go here
      </header>

      {/* Wrapper div for centering */}
      <div className="flex justify-center w-full">
        {/* Main grid with three columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(180px,220px)_minmax(500px,1200px)_minmax(180px,220px)] gap-4 w-full max-w-[1640px]">
          {/* Left sidebar - hidden on tablet and below */}
          <aside className="hidden lg:block bg-muted rounded-lg p-4">
            Left sidebar content
          </aside>

          {/* Main center content - takes full width on tablet and below */}
          <main className="bg-muted rounded-lg p-4 lg:w-full w-[calc(100vw-2rem)]">
            Main chat interface will go here
          </main>

          {/* Right sidebar - hidden on tablet and below */}
          <aside className="hidden lg:block bg-muted rounded-lg p-4">
            Right sidebar content
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
