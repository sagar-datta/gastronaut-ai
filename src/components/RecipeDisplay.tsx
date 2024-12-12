import ReactMarkdown, { Components } from "react-markdown";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import React from "react";

type RecipeDisplayProps = {
  content: string;
};

// Add these helper functions at the top of the component
const isIngredientsSection = (text: string) =>
  text.toLowerCase().includes("## ingredients");

const isEquipmentSection = (text: string) =>
  text.toLowerCase().includes("## equipment needed");

export function RecipeDisplay({ content }: RecipeDisplayProps) {
  // Add state to track checked items
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const sections = content.split("\n\n");

  const ingredientsIndex = sections.findIndex((section) =>
    section.toLowerCase().includes("## ingredients")
  );

  const equipmentIndex = sections.findIndex((section) =>
    section.toLowerCase().includes("## equipment needed")
  );

  const equipmentSection =
    equipmentIndex !== -1 ? sections[equipmentIndex] : null;
  const ingredientsSection =
    ingredientsIndex !== -1 ? sections[ingredientsIndex] : null;

  const titleSection = sections[0];

  const filteredSections = sections.filter(
    (_, index) => index !== equipmentIndex
  );

  // Custom components with conditional rendering for ingredients and equipment
  const components = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="mb-0 print:!break-before-page">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="print:!break-before-page">{children}</h2>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="!break-inside-avoid-page list-none pl-0 space-y-2 print:!break-inside-avoid">
        {children}
      </ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => {
      // Get the current section from the markdown content
      const itemText = children?.toString() || "";

      // Find the next section header after the current item
      const nextSectionIndex = content
        .slice(content.indexOf(itemText))
        .search(/\n## /);
      const currentSection = content
        .slice(0, content.indexOf(itemText))
        .split(/\n## /)
        .pop()
        ?.toLowerCase();

      // Only show checkboxes in Ingredients and Equipment sections
      const isInIngredients = currentSection?.startsWith("ingredients");
      const isInEquipment = currentSection?.startsWith("equipment needed");

      if (isInIngredients || isInEquipment) {
        const sectionType = isInIngredients ? "ingredients" : "equipment";
        const itemKey = `${sectionType}-${itemText}`;

        return (
          <li className="!break-inside-avoid-page flex items-start gap-2 print:!break-inside-avoid">
            <Checkbox
              id={itemKey}
              checked={checkedItems[itemKey]}
              onCheckedChange={(checked) => {
                setCheckedItems((prev) => ({
                  ...prev,
                  [itemKey]: checked === true,
                }));
              }}
              className="mt-1 print:hidden"
            />
            <label
              htmlFor={itemKey}
              className="leading-relaxed cursor-pointer print:before:content-['•'] print:before:mr-2 print:before:inline-block print:!break-inside-avoid"
            >
              {children}
            </label>
          </li>
        );
      }

      return (
        <li className="!break-inside-avoid-page print:!break-inside-avoid">
          {children}
        </li>
      );
    },
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="!break-inside-avoid">{children}</p>
    ),
  };

  return (
    <div className="prose max-w-none p-6 print:p-0 print:my-0 print:!break-after-auto [&_*]:!break-inside-avoid-page print:[&_p]:!orphans-3 print:[&_p]:!widows-3">
      <div className="space-y-4 print:space-y-2">
        <div className="print:!break-before-avoid print:!break-after-avoid">
          <ReactMarkdown components={components as Partial<Components>}>
            {titleSection}
          </ReactMarkdown>
        </div>

        {filteredSections.slice(1, ingredientsIndex).map((section, index) => (
          <div key={index} className="print:!break-inside-avoid-page">
            <ReactMarkdown components={components as Partial<Components>}>
              {section}
            </ReactMarkdown>
          </div>
        ))}

        {ingredientsSection && (
          <div className="print:!break-before-page print:!break-after-auto">
            <ReactMarkdown components={components as Partial<Components>}>
              {ingredientsSection}
            </ReactMarkdown>
          </div>
        )}

        {equipmentSection && (
          <div className="print:!break-before-page print:!break-after-auto">
            <ReactMarkdown components={components as Partial<Components>}>
              {equipmentSection}
            </ReactMarkdown>
          </div>
        )}

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
