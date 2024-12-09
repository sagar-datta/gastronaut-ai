import ReactMarkdown from "react-markdown";

type RecipeDisplayProps = {
  content: string;
};

export function RecipeDisplay({ content }: RecipeDisplayProps) {
  // Function to process the content and add proper markdown formatting
  const formatContent = (text: string) => {
    return (
      text
        // Format headers
        .replace(/\*\*(.*?):\*\*/g, "\n## $1\n")
        // Remove bold from numbered list items but keep the colon format
        .replace(/\d+\. \*\*(.*?):\*\* /g, "$1. $2: ")
        // Format lists
        .replace(/\* /g, "\n* ")
        // Remove extra spaces
        .replace(/\s+\n/g, "\n")
        // Ensure proper spacing between sections
        .replace(/\n{3,}/g, "\n\n")
        // Add space after headers
        .replace(/##(.*?)\n/g, "## $1\n\n")
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 h-full overflow-y-auto max-w-[1000px] mx-auto">
      <div
        className="prose prose-sm max-w-none dark:prose-invert 
        prose-h1:text-3xl 
        prose-h2:text-xl 
        prose-ol:text-base 
        prose-ul:text-base
        prose-p:text-base
        prose-ol:mt-2
        prose-ul:mt-2"
      >
        <ReactMarkdown>{formatContent(content)}</ReactMarkdown>
      </div>
    </div>
  );
}
