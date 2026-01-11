import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChefHat, Plus, LogOut, Loader2, Image as ImageIcon, Star, Utensils, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// -------------------------------------------------------------
// 👇 PEGA TUS DATOS DE CLOUDINARY AQUÍ
// -------------------------------------------------------------
const CLOUDINARY_CLOUD_NAME = "dkiw87eau"; // Ej: dxy82jk...
const CLOUDINARY_PRESET = "carta-restaurante";  // Ej: carta-restaurante

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  isDailySpecial: boolean;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // ESTADOS DE DATOS
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS DE INTERFAZ
  const [isFabOpen, setIsFabOpen] = useState(false); // Para el botón flotante
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // ESTADOS DE FORMULARIOS
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", ingredients: "", categoryId: "", image: ""
  });
  const [newCategoryName, setNewCategoryName] = useState("");

  // 1. CARGA INICIAL
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get("http://localhost:3000/api/products"),
        axios.get("http://localhost:3000/api/categories")
      ]);
      setProductList(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. SUBIR FOTO A CLOUDINARY
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET); 

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      setNewProduct({ ...newProduct, image: res.data.secure_url });
      toast({ title: "Imagen lista", description: "Foto subida correctamente" });
    } catch (error) {
      toast({ title: "Error", description: "Revisa tu Cloud Name y Preset en el código", variant: "destructive" });
    } finally {
      setUploadingImg(false);
    }
  };

  // 3. SWITCHES (Disponible / Destacado)
  const handleToggle = async (id: number, field: 'isAvailable' | 'isDailySpecial', currentValue: boolean) => {
    // Actualización optimista
    setProductList(prev => prev.map(p => p.id === id ? { ...p, [field]: !currentValue } : p));

    try {
      await axios.patch(`http://localhost:3000/api/products/${id}`, { [field]: !currentValue });
    } catch (error) {
      // Revertir
      setProductList(prev => prev.map(p => p.id === id ? { ...p, [field]: currentValue } : p));
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" });
    }
  };

  // 4. CREAR PRODUCTO
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId || !newProduct.ingredients) {
      toast({ title: "Faltan datos", description: "Completa los campos obligatorios (*)", variant: "destructive" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/products", newProduct);
      setProductList([res.data, ...productList]);
      setNewProduct({ name: "", description: "", price: "", ingredients: "", categoryId: "", image: "" });
      setIsProductDialogOpen(false);
      setIsFabOpen(false);
      toast({ title: "¡Plato creado!", description: "Se agregó al menú correctamente." });
    } catch (error) {
      toast({ title: "Error", description: "Falló al crear el plato", variant: "destructive" });
    }
  };

  // 5. CREAR CATEGORÍA
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await axios.post("http://localhost:3000/api/categories", { name: newCategoryName });
      setCategories([...categories, res.data]);
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
      setIsFabOpen(false);
      toast({ title: "Categoría creada", description: `Se agregó "${res.data.name}"` });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear la categoría", variant: "destructive" });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground leading-tight">Panel Admin</h1>
              <p className="text-xs text-muted-foreground">Gestiona tu carta</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-red-500">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* --- LISTA DE PRODUCTOS --- */}
      <main className="container px-4 py-6 max-w-4xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Menú ({productList.length})</h2>
        </div>

        {loading ? (
           <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {productList.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border transition-all ${
                    !product.isAvailable ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-border shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Imagen */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20}/></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                        {product.isDailySpecial && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Star size={10} fill="currentColor"/> Plato del Día
                          </span>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{product.description || "Sin descripción"}</p>
                    <p className="font-semibold text-primary mt-1">${product.price}</p>
                  </div>

                  {/* Switches */}
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold ${product.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                            {product.isAvailable ? "En Venta" : "Agotado"}
                        </span>
                        <Switch checked={product.isAvailable} onCheckedChange={() => handleToggle(product.id, 'isAvailable', product.isAvailable)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Destacar</span>
                        <Switch checked={product.isDailySpecial} onCheckedChange={() => handleToggle(product.id, 'isDailySpecial', product.isDailySpecial)} className="data-[state=checked]:bg-amber-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* --- BOTÓN FLOTANTE (SPEED DIAL) --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isFabOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <span className="bg-white px-2 py-1 rounded-md text-xs font-medium shadow text-slate-700">Nueva Categoría</span>
                <Button 
                  onClick={() => setIsCategoryDialogOpen(true)} 
                  className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                >
                  <Tag className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="bg-white px-2 py-1 rounded-md text-xs font-medium shadow text-slate-700">Nuevo Plato</span>
                <Button 
                  onClick={() => setIsProductDialogOpen(true)} 
                  className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                >
                  <Utensils className="w-5 h-5" />
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <Button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${isFabOpen ? 'bg-slate-800 rotate-45' : 'bg-primary hover:scale-105'}`}
        >
          <Plus className="w-7 h-7" />
        </Button>
      </div>

      {/* --- MODAL CREAR PLATO --- */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nuevo Plato</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
                <Label>Foto del plato</Label>
                <div className="flex items-center gap-4">
                    <Input type="file" onChange={handleImageUpload} className="text-xs" />
                    {uploadingImg && <Loader2 className="animate-spin h-4 w-4 text-primary" />}
                </div>
                {newProduct.image && <img src={newProduct.image} className="h-24 w-full object-cover rounded-lg border" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Precio *</Label>
                    <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select value={newProduct.categoryId} onValueChange={(val) => setNewProduct({...newProduct, categoryId: val})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (<SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Ingredientes (Obligatorio) *</Label>
                <Input value={newProduct.ingredients} onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })} placeholder="Ej: Salsa, Queso, Orégano" />
            </div>
            <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            </div>
            <Button onClick={handleAddProduct} className="w-full" disabled={uploadingImg}>
              {uploadingImg ? "Subiendo..." : "Guardar Plato"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- MODAL CREAR CATEGORÍA --- */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nueva Categoría</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nombre de la Categoría</Label>
              <Input 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="Ej: Promociones, Pastas, Vinos..." 
              />
            </div>
            <Button onClick={handleAddCategory} className="w-full bg-blue-600 hover:bg-blue-700">
              Crear Categoría
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Dashboard;