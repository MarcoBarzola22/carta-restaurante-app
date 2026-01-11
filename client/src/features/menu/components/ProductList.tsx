import { Product } from "@/features/menu/data/menuData";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductList = ({ products, onProductClick }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-muted-foreground text-center">
          No hay productos en esta categoría
        </p>
      </div>
    );
  }

  return (
    <section className="py-4">
      <div className="px-4 space-y-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => !product.isSoldOut && onProductClick(product)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
