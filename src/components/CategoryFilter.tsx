import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant={selectedCategory === null ? "default" : "category"}
        size="sm"
        onClick={() => onCategorySelect(null)}
        className="rounded-full"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "category"}
          size="sm"
          onClick={() => onCategorySelect(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};