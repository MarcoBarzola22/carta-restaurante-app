import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

import Header from "@/features/menu/components/Header";
import ChefCarousel from "@/features/menu/components/ChefCarousel";
import CategoryTabs from "@/features/menu/components/CategoryTabs";
import ProductList from "@/features/menu/components/ProductList";
import ProductModal from "@/features/menu/components/ProductModal";
import Footer from "@/features/menu/components/layout/Footer";
import { Product } from "@/features/menu/data/menuData";

// LO NUEVO
import { useCart } from "@/context/CartContext";
import { CartSidebar } from "@/features/menu/components/CartSidebar";

const PublicMenu = () => {
  const { addToCart } = useCart(); // <--- EL CEREBRO DEL CARRITO
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MANTENEMOS TU LÓGICA ORIGINAL: "all" por defecto
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCategoryEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("hamburguesa")) return "🍔";
    if (lower.includes("pizza")) return "🍕";
    if (lower.includes("ensalada") || lower.includes("entrada")) return "🥗";
    if (lower.includes("postre") || lower.includes("dulce")) return "🍰";
    if (lower.includes("bebida") || lower.includes("trago")) return "🥤";
    if (lower.includes("pasta")) return "🍝";
    if (lower.includes("carne") || lower.includes("asado")) return "🥩";
    return "🍴";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`),
          axios.get(`${API_URL}/api/categories`)
        ]);

        const adaptedCategories = catRes.data.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          emoji: getCategoryEmoji(c.name)
        }));

        const adaptedProducts: Product[] = prodRes.data.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          description: p.description || "Deliciosa elección.",
          fullDescription: p.description || p.name,
          price: Number(p.price),
          image: p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          ingredients: p.ingredients ? p.ingredients.split(',').map((i: string) => i.trim()) : [],
          category: String(p.categoryId), // Usamos String para comparar fácil
          isSoldOut: !p.isAvailable,      // Mantenemos tu lógica de SoldOut
          isChefRecommended: p.isDailySpecial,
          isDailySpecial: p.isDailySpecial 
        }));

        // --- AQUÍ ESTÁ LA MAGIA PARA EL "TODOS" ---
        // Agregamos manualmente la categoría "Todos" al principio del array.
        // Usamos el ID "all" para que coincida con tu useState("all") inicial.
        const categoriesWithAll = [
            { id: "all", name: "Todos", emoji: "🍽️" }, 
            ...adaptedCategories
        ];

        setCategories(categoriesWithAll);
        setProducts(adaptedProducts);
      } catch (error) {
        console.error("Error cargando menú:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroProducts = products.filter(p => p.isChefRecommended);
  
  // TU FILTRO ORIGINAL FUNCIONA PERFECTO AHORA
  // Porque activeCategory empieza en "all" y ahora el botón "Todos" tiene id "all".
  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="pb-24 flex-grow">
        {heroProducts.length > 0 && (
            <ChefCarousel 
                products={heroProducts} 
                onProductClick={handleProductClick} 
            />
        )}
        
        {/* Usamos tus props originales: categories, activeCategory, onCategoryChange */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <ProductList
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      </main>

      <Footer />

      {/* MODAL CON FUNCIONALIDAD DE CARRITO */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={(product) => {
            addToCart(product);
            setIsModalOpen(false);
        }}
      />

      {/* BARRA LATERAL DEL CARRITO */}
      <CartSidebar />
    </div>
  );
};

export default PublicMenu;