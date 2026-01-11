import { motion } from "framer-motion";
import { Product } from "@/features/menu/data/menuData";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index: number;
}

const ProductCard = ({ product, onClick, index }: ProductCardProps) => {
  const isDisabled = product.isSoldOut;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      disabled={isDisabled}
      className={`food-card w-full text-left flex gap-4 p-4 ${
        isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
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
          €{product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex-shrink-0">
        <div className="w-24 h-24 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.button>
  );
};

export default ProductCard;
