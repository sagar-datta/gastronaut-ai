import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [experience, setExperience] = useState("beginner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the submission here with both input and experience level
    console.log("Submitted:", { input, experience });
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Experience Level Section */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Level</CardTitle>
          <CardDescription>
            Select your comfort level in the kitchen to get personalized recipe
            suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="beginner"
            value={experience}
            onValueChange={setExperience}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Beginner Cook</TabsTrigger>
              <TabsTrigger value="intermediate">Home Chef</TabsTrigger>
              <TabsTrigger value="advanced">Professional</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ingredients Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>
            List your ingredients with approximate amounts - don't worry about
            being too precise!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 2 chicken breasts, 500g rice, onions..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
