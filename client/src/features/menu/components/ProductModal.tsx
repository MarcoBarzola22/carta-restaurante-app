import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Product } from "@/features/menu/data/menuData";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl max-h-[90vh] overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-square max-h-[50vh]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isNew && <span className="badge-new">Nuevo</span>}
                {product.isSoldOut && <span className="badge-soldout">Agotado</span>}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 -mt-8 relative">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {product.name}
                </h2>
                <p className="font-bold text-2xl text-primary">
                  €{product.price.toFixed(2)}
                </p>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  Ingredientes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safe area padding for mobile */}
              <div className="h-6" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
