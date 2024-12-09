import ReactMarkdown from "react-markdown";

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
        // Remove bold from numbered list items but keep the colon format
        .replace(/(\d+)\.\s*\*\*(.*?)\*\*:/g, "$1. $2:")
        // Style fractions as a single unit
        .replace(/(\d+\/\d+)/g, "**$1**")
        // Style remaining numbers (except in headers)
        .replace(/(?<!#)(\d+)(?!\d*\s*#)(?!\/)/g, "**$1**")
        // Remove extra spaces
        .replace(/\s+\n/g, "\n")
        // Ensure proper spacing between sections
        .replace(/\n{3,}/g, "\n\n")
        // Add space after headers
        .replace(/##(.*?)\n/g, "## $1\n\n")
        .replace(/###(.*?)\n/g, "### $1\n\n")
    );
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
        prose-strong:text-red-500"
      >
        <ReactMarkdown>{formatContent(content)}</ReactMarkdown>
      </div>
    </div>
  );
}
