import ReactMarkdown, { Components } from "react-markdown";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";

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
      <h1 className="mb-0 print:!break-before-page">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="print:!break-before-page">{children}</h2>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="!break-inside-avoid-page">{children}</ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="!break-inside-avoid-page">{children}</ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="!break-inside-avoid">{children}</li>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="!break-inside-avoid">{children}</p>
    ),
  };

  return (
    <div className="prose max-w-none p-6 print:p-0 print:my-0 print:!break-after-auto">
      <div className="space-y-4 print:space-y-2">
        {/* Title */}
        <div className="print:!break-before-avoid print:!break-after-avoid">
          <ReactMarkdown components={components as Partial<Components>}>
            {titleSection}
          </ReactMarkdown>
        </div>

        {/* Description */}
        {filteredSections.slice(1, ingredientsIndex).map((section, index) => (
          <div key={index} className="print:!break-inside-avoid-page">
            <ReactMarkdown components={components as Partial<Components>}>
              {section}
            </ReactMarkdown>
          </div>
        ))}

        {/* Ingredients section */}
        {ingredientsSection && (
          <div className="print:!break-before-page print:!break-after-auto">
            <ReactMarkdown components={components as Partial<Components>}>
              {ingredientsSection}
            </ReactMarkdown>
          </div>
        )}

        {/* Equipment section */}
        {equipmentSection && (
          <div className="print:!break-before-page print:!break-after-auto">
            <ReactMarkdown components={components as Partial<Components>}>
              {equipmentSection}
            </ReactMarkdown>
          </div>
        )}

        {/* Remaining sections */}
        {filteredSections
          .slice(ingredientsIndex + 1)
          .map((section, index, array) => (
            <div
              key={index}
              className={`print:!break-before-page ${
                index === array.length - 1 ? "print:!break-after-auto" : ""
              }`}
            >
              <ReactMarkdown components={components as Partial<Components>}>
                {section}
              </ReactMarkdown>
            </div>
          ))}
      </div>
    </div>
  );
}
