import { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Button onClick={() => setCount((count) => count + 1)}>Click me</Button>
      <p className="text-lg">Count: {count}</p>
    </div>
  );
}

export default App;
