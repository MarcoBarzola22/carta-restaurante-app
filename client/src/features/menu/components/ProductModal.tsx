// client/src/features/menu/components/ProductModal.tsx
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
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-[2px]" // Fondo un poco más oscuro
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden relative shadow-2xl"
          >
            {/* Imagen Header */}
            <div className="relative h-64 w-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Botón Cerrar flotante */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-sm hover:bg-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Limpio */}
            <div className="p-6 pt-8"> {/* Padding ajustado */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h2>
                <p className="font-bold text-xl text-amber-600 shrink-0 ml-4">
                  €{product.price.toFixed(2)}
                </p>
              </div>

              <p className="text-slate-600 mb-8 leading-relaxed text-sm font-light">
                {product.fullDescription}
              </p>

              {/* Ingredientes Estilo Etiqueta Simple */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Ingredientes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-8" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;