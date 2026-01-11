import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Plus, LogOut, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { products as initialProducts, Product } from "@/features/menu/data/menuData";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/features/menu/data/menuData";

const AdminDashboard = () => {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSoldOutToggle = (productId: string) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isSoldOut: !p.isSoldOut } : p
      )
    );
    toast({
      title: "Estado actualizado",
      description: "El estado del producto ha sido modificado",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate("/admin/login");
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      fullDescription: newProduct.description,
      ingredients: [],
      price: parseFloat(newProduct.price),
      image: initialProducts[0].image, // Default image
      category: newProduct.category,
      isNew: true,
    };

    setProductList((prev) => [product, ...prev]);
    setNewProduct({ name: "", description: "", price: "", category: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido añadido al menú`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="chef-recommendation w-10 h-10 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground leading-tight">
                Dashboard
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Gestión de productos</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Product list */}
      <main className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Productos ({productList.length})
          </h2>
        </div>

        <div className="space-y-3">
          {productList.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="food-card p-4"
            >
              <div className="flex items-center gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {product.name}
                    </h3>
                    {product.isNew && <span className="badge-new text-xs">Nuevo</span>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.description}
                  </p>
                  <p className="font-semibold text-primary mt-1">
                    €{product.price.toFixed(2)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {product.isSoldOut ? "Agotado" : "Disponible"}
                    </span>
                    <Switch
                      checked={!product.isSoldOut}
                      onCheckedChange={() => handleSoldOutToggle(product.id)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => setIsAddDialogOpen(true)}
        className="fab-button"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Agregar Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Descripción corta del producto"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.emoji} {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddProduct}
                className="flex-1 chef-recommendation border-0 hover:opacity-90"
              >
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
