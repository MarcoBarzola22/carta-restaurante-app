import { Product } from "../data/menuData";
import ProductCard from "./ProductCard";
import { useCart } from "@/context/CartContext"; // <--- Importamos el carrito

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductList = ({ products, onProductClick }: ProductListProps) => {
  const { addToCart } = useCart(); // <--- Hook del carrito

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay productos en esta categoría.</p>
      </div>
    );
  }

  return (
    <section className="px-4 pb-20">
      <div className="space-y-4"> {/* <--- ESPACIADO VERTICAL SIMPLE (COMO ANTES) */}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            onAdd={(e) => {
               e.stopPropagation(); // Para que no se abra el modal al dar al (+)
               addToCart(product);
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;