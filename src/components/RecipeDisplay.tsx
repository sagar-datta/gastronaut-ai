import ReactMarkdown, { Components } from "react-markdown";
import { Checkbox } from "./ui/checkbox";
import { useState, useEffect, useRef } from "react";
import React from "react";

export type CheckedItems = {
  [key: string]: {
    text: string;
    type: "ingredients" | "equipment";
    checked: boolean;
  };
};

type RecipeDisplayProps = {
  content: string;
  onItemsChange?: (items: CheckedItems) => void;
};

export function RecipeDisplay({ content, onItemsChange }: RecipeDisplayProps) {
  // Update the state to include more information about checked items
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

  // Add effect to notify parent of changes
  useEffect(() => {
    onItemsChange?.(checkedItems);
  }, [checkedItems, onItemsChange]);

  const recipeDisplaySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to recipe display on mobile after recipe is rendered
    if (recipeDisplaySectionRef.current && window.innerWidth < 768) {
      // Example mobile breakpoint, adjust if needed
      recipeDisplaySectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [content]); // Depend on 'content' to scroll when recipe changes

  const sections = React.useMemo(() => content.split("\n\n"), [content]);

  const ingredientsIndex = React.useMemo(
    () =>
      sections.findIndex((section) =>
        section.toLowerCase().includes("## ingredients")
      ),
    [sections]
  );

  const equipmentIndex = React.useMemo(
    () =>
      sections.findIndex((section) =>
        section.toLowerCase().includes("## equipment needed")
      ),
    [sections]
  );

  const equipmentSection = React.useMemo(
    () => (equipmentIndex !== -1 ? sections[equipmentIndex] : null),
    [equipmentIndex, sections]
  );

  const ingredientsSection = React.useMemo(
    () => (ingredientsIndex !== -1 ? sections[ingredientsIndex] : null),
    [ingredientsIndex, sections]
  );

  const titleSection = React.useMemo(() => sections[0], [sections]);

  const filteredSections = React.useMemo(
    () => sections.filter((_, index) => index !== equipmentIndex),
    [sections, equipmentIndex]
  );

  // Custom components with conditional rendering for ingredients and equipment
  const components = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="mb-0 print:break-before-page">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="print:break-before-page">{children}</h2>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="break-inside-avoid-page list-none pl-0 space-y-2 print:break-inside-avoid">
        {children}
      </ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => {
      // Get the current section from the markdown content
      const itemText = children?.toString() || "";

      // Find the next section header after the current item
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
          <li className="break-inside-avoid-page flex items-start gap-2 print:break-inside-avoid">
            <Checkbox
              id={itemKey}
              checked={checkedItems[itemKey]?.checked ?? false}
              onCheckedChange={(checked) => {
                setCheckedItems((prev) => ({
                  ...prev,
                  [itemKey]: {
                    text: itemText,
                    type: sectionType,
                    checked: checked === true,
                  },
                }));
              }}
              className="mt-1 print:hidden"
            />
            <label
              htmlFor={itemKey}
              className="leading-relaxed cursor-pointer print:before:content-['•'] print:before:mr-2 print:before:inline-block print:break-inside-avoid"
            >
              {children}
            </label>
          </li>
        );
      }

      return (
        <li className="break-inside-avoid-page print:break-inside-avoid">
          {children}
        </li>
      );
    },
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="break-inside-avoid">{children}</p>
    ),
  };

  return (
    <article
      ref={recipeDisplaySectionRef}
      className="prose max-w-none p-6 print:p-0 print:my-0 print:break-after-auto [&_*]:break-inside-avoid-page print:[&_p]:orphans-3 print:[&_p]:widows-3"
    >
      <main className="space-y-4 print:space-y-2">
        <header className="print:break-before-avoid print:break-after-avoid">
          <ReactMarkdown components={components as Partial<Components>}>
            {titleSection}
          </ReactMarkdown>
        </header>

        {filteredSections.slice(1, ingredientsIndex).map((section, index) => (
          <section key={index} className="print:break-inside-avoid-page">
            <ReactMarkdown components={components as Partial<Components>}>
              {section}
            </ReactMarkdown>
          </section>
        ))}

        {ingredientsSection && (
          <section className="print:break-before-page print:break-inside-avoid print:break-after-avoid">
            <ReactMarkdown components={components as Partial<Components>}>
              {ingredientsSection}
            </ReactMarkdown>
          </section>
        )}

        {equipmentSection && (
          <section className="print:break-before-page print:break-inside-avoid print:break-after-avoid">
            <ReactMarkdown components={components as Partial<Components>}>
              {equipmentSection}
            </ReactMarkdown>
          </section>
        )}

        {filteredSections
          .slice(ingredientsIndex + 1)
          .map((section, index, array) => (
            <section
              key={index}
              className={`print:break-before-page print:break-inside-avoid ${
                index === array.length - 1 ? "print:break-after-auto" : ""
              }`}
            >
              <ReactMarkdown components={components as Partial<Components>}>
                {section}
              </ReactMarkdown>
            </section>
          ))}
      </main>
    </article>
  );
}
