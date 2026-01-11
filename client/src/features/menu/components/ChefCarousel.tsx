import { motion } from "framer-motion";
import { getChefRecommendations, Product } from "@/features/menu/data/menuData";
import { Sparkles } from "lucide-react";

interface ChefCarouselProps {
  onProductClick: (product: Product) => void;
}

const ChefCarousel = ({ onProductClick }: ChefCarouselProps) => {
  const recommendations = getChefRecommendations();

  return (
    <section className="py-6">
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="chef-recommendation w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Recomendados del Chef
            </h2>
            <p className="text-sm text-muted-foreground">Los favoritos de la casa</p>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 pb-2">
          {recommendations.map((product, index) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !product.isSoldOut && onProductClick(product)}
              disabled={product.isSoldOut}
              className={`flex-shrink-0 w-40 group ${product.isSoldOut ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {product.isNew && (
                  <span className="absolute top-2 left-2 badge-new">Nuevo</span>
                )}
                {product.isSoldOut && (
                  <span className="absolute top-2 left-2 badge-soldout">Agotado</span>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white font-semibold text-sm text-left truncate">
                    €{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <h3 className="font-medium text-foreground text-sm text-left truncate">
                {product.name}
              </h3>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefCarousel;
