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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg p-6 h-full overflow-y-auto max-w-[900px] mx-auto">
      <div
        className="prose prose-sm max-w-none dark:prose-invert 
        prose-h1:text-3xl 
        prose-h2:text-xl 
        prose-h3:text-lg
        prose-ol:text-base 
        prose-ul:text-base
        prose-p:text-base
        prose-ol:mt-2
        prose-ul:mt-2
        [&_ol>li]:marker:text-red-500
        [&_ol>li]:marker:font-bold
        prose-strong:text-red-500
        print:max-w-full
        print:prose-h1:text-2xl
        print:prose-h2:text-xl
        print:prose-h3:text-lg
        [&_ol>li]:mb-4
        [&_ol>li]:block
        [&_ol>li]:break-inside-avoid-page
        [&_h2]:break-before-page
        print:prose-h2:mt-0
        [&_h1]:flex
        [&_h1]:items-center
        [&_h1]:justify-between
        [&_h1]:gap-4"
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1>
                {children}
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="gap-2 print:hidden"
                >
                  <Printer className="h-4 w-4" />
                  Print Recipe
                </Button>
              </h1>
            ),
          }}
        >
          {formatContent(content)}
        </ReactMarkdown>
      </div>
    </div>
  );
}
