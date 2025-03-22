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
    if (recipeDisplaySectionRef.current && window.innerWidth < 1024) {
      recipeDisplaySectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [content]); // Depend on 'content' to scroll when recipe changes

  // Add print handler to fix blank first page
  useEffect(() => {
    const handleBeforePrint = () => {
      // Force layout recalculation
      if (recipeDisplaySectionRef.current) {
        recipeDisplaySectionRef.current.style.display = "block";
        recipeDisplaySectionRef.current.style.position = "static";
        recipeDisplaySectionRef.current.style.visibility = "visible";
        recipeDisplaySectionRef.current.style.opacity = "1";
      }

      // Scroll to top before printing
      window.scrollTo(0, 0);

      // Add a class to the body to indicate we're in print mode
      document.body.classList.add("printing");

      // Set timeout to make sure CSS has applied
      setTimeout(() => {
        if (recipeDisplaySectionRef.current) {
          recipeDisplaySectionRef.current.style.display = "block";
        }
      }, 100);
    };

    const handleAfterPrint = () => {
      // Remove print mode class after printing
      document.body.classList.remove("printing");
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

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
      <h1 className="mb-0 print:mt-0">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="mt-4 print:mt-4">{children}</h2>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-none pl-0 space-y-2 print:list-disc print:pl-5">
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
          <li className="flex items-start gap-2 print:list-item">
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
              className="leading-relaxed cursor-pointer print:inline"
            >
              {children}
            </label>
          </li>
        );
      }

      return <li className="print:list-item">{children}</li>;
    },
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="break-inside-avoid print:orphans-3 print:widows-3">
        {children}
      </p>
    ),
  };

  if (!content) return null;

  return (
    <article
      ref={recipeDisplaySectionRef}
      className="recipe-display prose max-w-none p-6 print:p-0 print:visible print:break-after-avoid"
      id="recipe-to-print"
    >
      {/* Title section */}
      <div className="print:visible">
        <ReactMarkdown components={components as Partial<Components>}>
          {titleSection}
        </ReactMarkdown>
      </div>

      {/* Description sections before ingredients */}
      {filteredSections.slice(1, ingredientsIndex).map((section, index) => (
        <section key={index} className="print:break-inside-avoid print:visible">
          <ReactMarkdown components={components as Partial<Components>}>
            {section}
          </ReactMarkdown>
        </section>
      ))}

      {/* Ingredients section */}
      {ingredientsSection && (
        <section className="print:break-inside-avoid print:visible">
          <ReactMarkdown components={components as Partial<Components>}>
            {ingredientsSection}
          </ReactMarkdown>
        </section>
      )}

      {/* Equipment section */}
      {equipmentSection && (
        <section className="print:break-inside-avoid print:visible">
          <ReactMarkdown components={components as Partial<Components>}>
            {equipmentSection}
          </ReactMarkdown>
        </section>
      )}

      {/* Instructions and remaining sections */}
      {filteredSections.slice(ingredientsIndex + 1).map((section, index) => (
        <section
          key={index}
          className={`print:break-inside-avoid print:visible ${
            index === filteredSections.slice(ingredientsIndex + 1).length - 1
              ? "print:mb-0 print:pb-0 print:break-after-avoid"
              : ""
          }`}
        >
          <ReactMarkdown components={components as Partial<Components>}>
            {section}
          </ReactMarkdown>
        </section>
      ))}
    </article>
  );
}
