import ReactMarkdown, { Components } from "react-markdown";
import { Button } from "./ui/button";

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

  // Get the title section (first section)
  const titleSection = sections[0];

  // Remove equipment section from its original position
  const filteredSections = sections.filter(
    (_, index) => index !== equipmentIndex
  );

  // Custom component to handle headings
  const components = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="mb-0">{children}</h1>
        <div className="flex justify-start">
          <Button
            variant="outline"
            className="print:hidden"
            onClick={() => window.print()}
          >
            Print Recipe
          </Button>
        </div>
      </div>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <div className="!break-inside-avoid-page !break-after-auto">
        <h2>{children}</h2>
      </div>
    ),
  };

  return (
    <div className="prose max-w-none p-6 print:p-0 print:my-0">
      <div className="space-y-4 print:space-y-2">
        {/* Title with Print Button */}
        <div className="!break-inside-avoid-page">
          <ReactMarkdown components={components as Partial<Components>}>
            {titleSection}
          </ReactMarkdown>
        </div>

        {/* Description */}
        {filteredSections.slice(1, ingredientsIndex).map((section, index) => (
          <div key={index} className="!break-inside-avoid-page">
            <ReactMarkdown components={components as Partial<Components>}>
              {section}
            </ReactMarkdown>
          </div>
        ))}

        {/* Ingredients section */}
        {ingredientsSection && (
          <div className="!break-inside-avoid-page">
            <ReactMarkdown components={components as Partial<Components>}>
              {ingredientsSection}
            </ReactMarkdown>
          </div>
        )}

        {/* Equipment section */}
        {equipmentSection && (
          <div className="!break-inside-avoid-page">
            <ReactMarkdown components={components as Partial<Components>}>
              {equipmentSection}
            </ReactMarkdown>
          </div>
        )}

        {/* Remaining sections */}
        {filteredSections.slice(ingredientsIndex + 1).map((section, index) => (
          <div key={index} className="!break-inside-avoid-page">
            <ReactMarkdown components={components as Partial<Components>}>
              {section}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}
