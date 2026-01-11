// client/src/features/menu/pages/PublicMenu.tsx
import { useState } from "react";
import Header from "@/features/menu/components/Header";
import ChefCarousel from "@/features/menu/components/ChefCarousel";
import CategoryTabs from "@/features/menu/components/CategoryTabs";
import ProductList from "@/features/menu/components/ProductList";
import ProductModal from "@/features/menu/components/ProductModal";
import Footer from "@/features/menu/components/layout/Footer";
import { getProductsByCategory, Product } from "@/features/menu/data/menuData";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtramos productos según la categoría seleccionada
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* 1. Header con imagen */}
      <Header />
      
      <main className="pb-8 flex-grow">
        {/* 2. Carrusel de Platos del Día */}
        <ChefCarousel onProductClick={handleProductClick} />
        
        {/* 3. Pestañas de Categorías */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        {/* 4. Lista de Productos */}
        <ProductList
          products={products}
          onProductClick={handleProductClick}
        />
      </main>

      {/* 5. Footer al final */}
      <Footer />

      {/* 6. Modal (oculto por defecto) */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;