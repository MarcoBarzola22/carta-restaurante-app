import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChefHat, Plus, LogOut, Loader2, Image as ImageIcon, Star, Utensils, Tag, Pencil, Trash2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- PON TUS DATOS DE CLOUDINARY ---
const CLOUDINARY_CLOUD_NAME = "dkiw87eau"; // Ej: dxy82jk...
const CLOUDINARY_PRESET = "carta-restaurante";  // Ej: carta-restaurante

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  ingredients: string | null;
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
  
  // ESTADOS
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // CONTROL DE UI
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // EDICIÓN
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [uploadingImg, setUploadingImg] = useState(false);

  // FORMULARIOS
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", ingredients: "", categoryId: "", image: ""
  });
  const [categoryFormName, setCategoryFormName] = useState("");

  useEffect(() => { fetchData(); }, []);

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

  // --- ACCIONES DE PRODUCTOS ---

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este plato?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      setProductList(productList.filter(p => p.id !== id));
      toast({ title: "Eliminado", description: "El producto se ha borrado." });
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      ingredients: product.ingredients || "",
      categoryId: String(product.categoryId),
      image: product.image || ""
    });
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.categoryId) {
        toast({ title: "Faltan datos", variant: "destructive" }); return;
    }

    try {
      if (editingProduct) {
        // EDITAR
        const res = await axios.put(`http://localhost:3000/api/products/${editingProduct.id}`, {
            ...productForm,
            isAvailable: editingProduct.isAvailable,
            isDailySpecial: editingProduct.isDailySpecial
        });
        setProductList(productList.map(p => p.id === editingProduct.id ? res.data : p));
        toast({ title: "Actualizado", description: "Producto modificado correctamente" });
      } else {
        // CREAR
        const res = await axios.post("http://localhost:3000/api/products", productForm);
        setProductList([res.data, ...productList]);
        toast({ title: "Creado", description: "Nuevo plato agregado" });
      }
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", ingredients: "", categoryId: "", image: "" });
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  // --- ACCIONES DE CATEGORÍAS ---

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Borrar categoría? Si tiene productos, estos podrían quedar huérfanos.")) return;
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast({ title: "Eliminada", description: "Categoría borrada." });
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormName(category.name);
    setIsCategoryDialogOpen(true);
  }

  const handleSaveCategory = async () => {
    if (!categoryFormName.trim()) return;
    try {
        if (editingCategory) {
            const res = await axios.put(`http://localhost:3000/api/categories/${editingCategory.id}`, { name: categoryFormName });
            setCategories(categories.map(c => c.id === editingCategory.id ? res.data : c));
            toast({ title: "Actualizada" });
        } else {
            const res = await axios.post("http://localhost:3000/api/categories", { name: categoryFormName });
            setCategories([...categories, res.data]);
            toast({ title: "Creada" });
        }
        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
        setCategoryFormName("");
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  // --- EL RESTO (Cloudinary y Switches) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploadingImg(true);
    const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", CLOUDINARY_PRESET);
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      setProductForm({ ...productForm, image: res.data.secure_url });
    } catch (error) { toast({ title: "Error subiendo imagen", variant: "destructive" }); } 
    finally { setUploadingImg(false); }
  };

  const handleToggle = async (id: number, field: 'isAvailable' | 'isDailySpecial', val: boolean) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, [field]: !val } : p));
    try { await axios.patch(`http://localhost:3000/api/products/${id}`, { [field]: !val }); } 
    catch (e) { setProductList(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p)); }
  };

  const handleLogout = () => { localStorage.removeItem("authToken"); navigate("/login"); };

  return (
    <div className="min-h-screen bg-background relative pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <ChefHat className="text-primary" />
            <span className="font-bold">Admin Panel</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-5 h-5" /></Button>
      </header>

      <main className="container px-4 py-6 max-w-5xl mx-auto">
        <Tabs defaultValue="products">
            <TabsList className="mb-4">
                <TabsTrigger value="products">Platos</TabsTrigger>
                <TabsTrigger value="categories">Categorías</TabsTrigger>
            </TabsList>

            {/* --- TABLA PRODUCTOS --- */}
            <TabsContent value="products" className="space-y-4">
                {productList.map((p) => (
                    <div key={p.id} className={`p-4 rounded-xl border flex items-center gap-4 bg-white ${!p.isAvailable ? 'opacity-70 bg-slate-50' : ''}`}>
                        <img src={p.image || ""} className="w-16 h-16 rounded-lg bg-slate-200 object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-bold truncate">{p.name}</span>
                                {p.isDailySpecial && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                            </div>
                            <div className="text-xs text-muted-foreground">${p.price}</div>
                        </div>
                        
                        <div className="flex flex-col gap-2 items-end mr-4">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold ${p.isAvailable ? 'text-green-600' : 'text-slate-400'}`}>{p.isAvailable ? "En Venta" : "Agotado"}</span>
                                <Switch checked={p.isAvailable} onCheckedChange={() => handleToggle(p.id, 'isAvailable', p.isAvailable)} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">Destacar</span>
                                <Switch checked={p.isDailySpecial} onCheckedChange={() => handleToggle(p.id, 'isDailySpecial', p.isDailySpecial)} className="data-[state=checked]:bg-amber-400"/>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex flex-col gap-2 border-l pl-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEditProductClick(p)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </div>
                ))}
            </TabsContent>

            {/* --- TABLA CATEGORÍAS --- */}
            <TabsContent value="categories" className="space-y-2">
                {categories.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border bg-white flex items-center justify-between">
                        <span className="font-medium">🍴 {c.name}</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditCategoryClick(c)}><Pencil className="w-4 h-4 text-blue-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(c.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                    </div>
                ))}
            </TabsContent>
        </Tabs>
      </main>

      {/* --- BOTÓN FLOTANTE --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isFabOpen && (
            <>
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                <span className="bg-white px-2 py-1 rounded text-xs shadow">Categoría</span>
                <Button onClick={() => { setIsCategoryDialogOpen(true); setIsFabOpen(false); setEditingCategory(null); setCategoryFormName(""); }} className="h-12 w-12 rounded-full bg-blue-600 shadow-lg"><Tag/></Button>
              </motion.div>
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="flex items-center gap-2">
                <span className="bg-white px-2 py-1 rounded text-xs shadow">Plato</span>
                <Button onClick={() => { setIsProductDialogOpen(true); setIsFabOpen(false); setEditingProduct(null); setProductForm({name:"", description:"", price:"", ingredients:"", categoryId:"", image:""}); }} className="h-12 w-12 rounded-full bg-emerald-600 shadow-lg"><Utensils/></Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <Button onClick={() => setIsFabOpen(!isFabOpen)} className={`h-14 w-14 rounded-full shadow-xl transition-all ${isFabOpen ? 'rotate-45 bg-slate-800' : 'bg-primary'}`}><Plus/></Button>
      </div>

      {/* --- DIALOGO PRODUCTO --- */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? "Editar Plato" : "Nuevo Plato"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label>Foto</Label>
                    <div className="flex gap-2 items-center">
                        <Input type="file" onChange={handleImageUpload} />
                        {uploadingImg && <Loader2 className="animate-spin" />}
                    </div>
                    {productForm.image && <img src={productForm.image} className="h-20 w-full object-cover rounded" />}
                </div>
                <Input placeholder="Nombre" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                <Input type="number" placeholder="Precio" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                <Select value={productForm.categoryId} onValueChange={v => setProductForm({...productForm, categoryId: v})}>
                    <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Ingredientes (separados por coma)" value={productForm.ingredients} onChange={e => setProductForm({...productForm, ingredients: e.target.value})} />
                <Textarea placeholder="Descripción" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                <Button onClick={handleSaveProduct} className="w-full" disabled={uploadingImg}>{editingProduct ? "Guardar Cambios" : "Crear"}</Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* --- DIALOGO CATEGORÍA --- */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle></DialogHeader>
            <Input placeholder="Nombre" value={categoryFormName} onChange={e => setCategoryFormName(e.target.value)} />
            <Button onClick={handleSaveCategory} className="w-full mt-4">{editingCategory ? "Guardar" : "Crear"}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;