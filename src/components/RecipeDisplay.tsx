import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";

type RecipeDisplayProps = {
  content: string;
};

export function RecipeDisplay({ content }: RecipeDisplayProps) {
  const formatContent = (text: string) => {
    return (
      text
        // Format h3 headers first (more specific)
        .replace(/###\s*(.*?):/g, "\n### $1\n")
        // Then format h2 headers
        .replace(/\*\*(.*?):\*\*/g, "\n## $1\n")
        // Format lists
        .replace(/\* /g, "\n* ")
        // Format numbered instructions to ensure they're on new lines
        .replace(/(\d+)\./g, "\n\n$1.")
        // Remove bold from numbered list items but keep the colon format
        .replace(/(\d+)\.\s*\*\*(.*?)\*\*:/g, "$1. $2:")
        // Style fractions as a single unit
        .replace(/(\d+\/\d+)/g, "**$1**")
        // Style remaining numbers (except in headers)
        .replace(/(?<!#)(\d+)(?!\d*\s*#)(?!\/)/g, "**$1**")
        // Format section headers
        .replace(/\*\*(.*?):\*\*/g, "\n## $1\n")
        // Remove extra spaces
        .replace(/\s+\n/g, "\n")
        // Ensure proper spacing between sections
        .replace(/\n{3,}/g, "\n\n")
        // Add space after headers
        .replace(/##(.*?)\n/g, "## $1\n\n")
        .replace(/###(.*?)\n/g, "### $1\n\n")
        // Ensure each instruction is on its own line
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n\n")
    );
  };

  return (
    <div className="prose max-w-none p-6">
      <div className="space-y-4">
        {content.split("\n\n").map((section, index) => (
          <div key={index} className="print:!break-inside-avoid-page">
            <ReactMarkdown>{section}</ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}
