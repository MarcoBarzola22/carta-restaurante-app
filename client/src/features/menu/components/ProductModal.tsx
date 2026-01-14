import { X, Info, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../data/menuData";
import { Button } from "@/components/ui/button";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal = ({ product, isOpen, onClose, onAddToCart }: ProductModalProps) => {
  // Si no hay producto, no renderizamos nada
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Fondo Oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-background w-full max-w-md max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
          >
            {/* Header Imagen */}
            <div className="relative h-56 flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <button 
                onClick={onClose} 
                className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>
                <p className="opacity-90 font-medium text-lg mt-1">${product.price}</p>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
              <p className="text-muted-foreground leading-relaxed text-sm">
                {product.fullDescription || product.description}
              </p>

              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Ingredientes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Botón - CORREGIDO */}
            <div className="p-4 border-t bg-white">
              <Button 
                onClick={() => onAddToCart(product)}
                disabled={product.isSoldOut} // Deshabilita si no está disponible
                className={`w-full h-12 text-base flex items-center justify-center gap-2 shadow-lg transition-all
                  ${product.isSoldOut 
                    ? "bg-slate-300 hover:bg-slate-300 text-slate-500 cursor-not-allowed" // Estilo para Agotado
                    : "bg-primary hover:bg-primary/90 text-white" // Estilo Normal
                  }`}
              >
                {product.isSoldOut ? (
                    "Agotado"
                ) : (
                    <>
                        <ShoppingCart className="w-5 h-5" />
                        Agregar al Pedido
                    </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;