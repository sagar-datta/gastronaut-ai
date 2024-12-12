import ReactMarkdown from "react-markdown";

type RecipeDisplayProps = {
  content: string;
};

export function RecipeDisplay({ content }: RecipeDisplayProps) {
  const sections = content.split("\n\n");

  // Find the ingredients section
  const ingredientsIndex = sections.findIndex((section) =>
    section.toLowerCase().includes("## ingredients")
  );

  // Find the equipment section
  const equipmentIndex = sections.findIndex((section) =>
    section.toLowerCase().includes("## equipment needed")
  );

  // Extract sections
  const equipmentSection =
    equipmentIndex !== -1 ? sections[equipmentIndex] : null;
  const ingredientsSection =
    ingredientsIndex !== -1 ? sections[ingredientsIndex] : null;

  return (
    <div className="prose max-w-none p-6">
      <div className="space-y-4">
        {/* Title and Description */}
        {sections
          .slice(0, Math.min(equipmentIndex, ingredientsIndex))
          .map((section, index) => (
            <div key={index} className="print:!break-inside-avoid-page">
              <ReactMarkdown>{section}</ReactMarkdown>
            </div>
          ))}

        {/* Equipment section */}
        {equipmentSection && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 print:!break-inside-avoid-page">
            <ReactMarkdown>{equipmentSection}</ReactMarkdown>
          </div>
        )}

        {/* Ingredients section */}
        {ingredientsSection && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:!break-inside-avoid-page">
            <ReactMarkdown>{ingredientsSection}</ReactMarkdown>
          </div>
        )}

        {/* Remaining sections */}
        {sections
          .slice(Math.max(equipmentIndex, ingredientsIndex) + 1)
          .map((section, index) => (
            <div key={index} className="print:!break-inside-avoid-page">
              <ReactMarkdown>{section}</ReactMarkdown>
            </div>
          ))}
      </div>
    </div>
  );
}
