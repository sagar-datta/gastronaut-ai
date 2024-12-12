import ReactMarkdown from "react-markdown";

type RecipeDisplayProps = {
  content: string;
};

export function RecipeDisplay({ content }: RecipeDisplayProps) {
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
