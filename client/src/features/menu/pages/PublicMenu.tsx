import { useState } from "react";
import Header from "@/features/menu/components/Header";
import ChefCarousel from "@/features/menu/components/ChefCarousel";
import CategoryTabs from "@/features/menu/components/CategoryTabs";
import ProductList from "@/features/menu/components/ProductList";
import ProductModal from "@/features/menu/components/ProductModal";
import { getProductsByCategory, Product } from "@/features/menu/data/menuData";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = getProductsByCategory(activeCategory);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-8">
        <ChefCarousel onProductClick={handleProductClick} />
        
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <ProductList
          products={products}
          onProductClick={handleProductClick}
        />
      </main>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
