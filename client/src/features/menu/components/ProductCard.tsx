import { motion } from "framer-motion";
import { Plus } from "lucide-react"; 
import { Product } from "../data/menuData";
import { Button } from "@/components/ui/button";
import { Product } from "@/features/menu/data/menuData";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAdd: (e: React.MouseEvent) => void; // <--- Recibimos la función
}

const ProductCard = ({ product, onClick, onAdd }: ProductCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer relative overflow-hidden ${
        product.isSoldOut ? "opacity-60 grayscale" : ""
      }`}
      onClick={() => onClick(product)}
    >
<<<<<<< HEAD
      {/* 1. IMAGEN CUADRADA A LA IZQUIERDA (Diseño Original) */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.isSoldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              Agotado
            </span>
          </div>
        )}
=======
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display text-lg font-semibold text-foreground truncate">
            {product.name}
          </h3>
          {product.isNew && <span className="badge-new flex-shrink-0">Nuevo</span>}
          {product.isSoldOut && <span className="badge-soldout flex-shrink-0">Agotado</span>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        <p className="font-semibold text-primary text-lg">
            {formatCurrency(product.price)}
        </p>
>>>>>>> origin/main
      </div>

      {/* 2. CONTENIDO A LA DERECHA */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-slate-900 leading-tight">
              {product.name}
            </h3>
            {/* PRECIO */}
            <span className="font-bold text-primary shrink-0">
              ${product.price}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* 3. BOTÓN (+) INTEGRADO */}
        {/* Solo lo mostramos si hay stock. Lo ponemos alineado a la derecha abajo. */}
        {!product.isSoldOut && (
          <div className="flex justify-end mt-2">
            <Button 
                size="sm" 
                variant="secondary"
                className="h-8 px-3 rounded-full bg-slate-100 hover:bg-primary hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
                onClick={onAdd}
            >
                Agregar <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;