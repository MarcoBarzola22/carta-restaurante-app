import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

// Importamos tus componentes ORIGINALES (Intactos)
import Header from "@/features/menu/components/Header";
import ChefCarousel from "@/features/menu/components/ChefCarousel";
import CategoryTabs from "@/features/menu/components/CategoryTabs";
import ProductList from "@/features/menu/components/ProductList";
import ProductModal from "@/features/menu/components/ProductModal";
import Footer from "@/features/menu/components/layout/Footer";

// Importamos el tipo de dato original para respetar tu diseño
import { Product } from "@/features/menu/data/menuData";

const PublicMenu = () => {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Usamos any para flexibilidad con tu diseño original
  const [loading, setLoading] = useState(true);
  
  // Estados de UI (Igual que antes)
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- DICCIONARIO DE EMOJIS (Para recuperar los iconos) ---
  const getCategoryEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("hamburguesa")) return "🍔";
    if (lower.includes("pizza")) return "🍕";
    if (lower.includes("ensalada") || lower.includes("entrada")) return "🥗";
    if (lower.includes("postre") || lower.includes("dulce")) return "🍰";
    if (lower.includes("bebida") || lower.includes("trago")) return "🥤";
    if (lower.includes("pasta")) return "🍝";
    if (lower.includes("carne") || lower.includes("asado")) return "🥩";
    if (lower.includes("pescado") || lower.includes("mar")) return "🐟";
    return "🍴"; // Emoji por defecto
  };

  // --- CARGAR Y ADAPTAR DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("http://localhost:3000/api/products"),
          axios.get("http://localhost:3000/api/categories")
        ]);

        // 1. ADAPTAR CATEGORÍAS (DB -> Diseño Original)
        const adaptedCategories = catRes.data.map((c: any) => ({
          id: String(c.id),    // Tu diseño usa IDs como string ("1", "entradas")
          name: c.name,
          emoji: getCategoryEmoji(c.name) // ¡Aquí recuperamos los iconos!
        }));

        // 2. ADAPTAR PRODUCTOS (DB -> Diseño Original)
        const adaptedProducts: Product[] = prodRes.data
          // ⚠️ IMPORTANTE: NO filtramos los disponibles. Los mostramos todos.
          .map((p: any) => ({
            id: String(p.id),
            name: p.name,
            // Si no hay descripción, ponemos una frase genérica para que no se rompa el diseño
            description: p.description || "Una deliciosa elección de nuestro chef.",
            fullDescription: p.description || p.name, 
            price: Number(p.price),
            image: p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            
            // TRUCO: Convertimos "Pan, Carne, Queso" (DB) -> ["Pan", "Carne", "Queso"] (Diseño)
            ingredients: p.ingredients ? p.ingredients.split(',').map((i: string) => i.trim()) : [],
            
            category: String(p.categoryId), // Enlazamos con la categoría adaptada
            
            // MAPEO DE "LOGICA DE NEGOCIO" A "ESTÉTICA"
            // Si en Admin isAvailable = false -> En Store isSoldOut = true
            isSoldOut: !p.isAvailable, 
            
            isNew: false, // Podrías calcular esto por fecha si quisieras
            isChefRecommended: p.isDailySpecial, // Usamos tu "Plato del día" para activar el carrusel
            isDailySpecial: p.isDailySpecial 
          }));

        setCategories(adaptedCategories);
        setProducts(adaptedProducts);
      } catch (error) {
        console.error("Error cargando el menú:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- LÓGICA ORIGINAL (No la tocamos) ---
  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  // Filtramos para el carrusel (Solo los que marcaste como Plato del Día en el Admin)
  const heroProducts = products.filter(p => p.isChefRecommended);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
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
        {/* Usamos heroProducts para que el carrusel solo muestre lo importante */}
        {/* Al pasarle 'products={heroProducts}', tu componente ChefCarousel original funcionará con su autoplay */}
        {heroProducts.length > 0 && (
            <ChefCarousel 
                products={heroProducts} // <--- Pasamos los datos adaptados
                onProductClick={handleProductClick} 
            />
        )}
        
        {/* Pasamos las categorías con emojis generados */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        {/* La lista de productos normal */}
        <ProductList
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PublicMenu;