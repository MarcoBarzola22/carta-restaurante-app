import { motion } from "framer-motion";
import { categories } from "@/features/menu/data/menuData";

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs = ({ activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <section className="py-4 border-b border-border">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              className={`category-tab whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === category.id
                  ? "category-tab-active"
                  : "category-tab-inactive"
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryTabs;
