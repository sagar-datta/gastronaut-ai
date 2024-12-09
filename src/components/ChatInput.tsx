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
  const [equipment, setEquipment] = useState("");
  const [experience, setExperience] = useState("beginner");

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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 2 chicken breasts, a bag of rice, some carrots, onions..."
            className="flex-1"
          />
        </CardContent>
      </Card>

      {/* Equipment Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Cooking Equipment</CardTitle>
          <CardDescription>
            Tell us what cooking equipment you have available - this helps us
            suggest suitable recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            placeholder="e.g., oven, stovetop, slow cooker, air fryer..."
            className="flex-1"
          />
        </CardContent>
      </Card>
    </div>
  );
}
