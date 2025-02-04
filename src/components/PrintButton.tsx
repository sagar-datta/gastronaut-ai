import { Button } from "./ui/button";
import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    // Set PDF metadata
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalTitle = document.title;

    // Update document title for PDF filename
    if (document.querySelector("h1")) {
      document.title =
        document.querySelector("h1")?.textContent || originalTitle;
    }

    // Print the document
    window.print();

    // Restore original title
    document.title = originalTitle;
  };

  return (
    <Button
      onClick={handlePrint}
      className="print:hidden flex items-center gap-2"
      variant="outline"
    >
      <Printer className="h-4 w-4" />
      <span>Print Recipe</span>
    </Button>
  );
}
