import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChefHat, Plus, LogOut, Loader2, Image as ImageIcon, Star, Utensils, Tag, Pencil, Trash2, Search, AlertTriangle, QrCode, Download } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "react-qr-code";

// --- TUS DATOS DE CLOUDINARY ---
const CLOUDINARY_CLOUD_NAME = "TU_CLOUD_NAME"; 
const CLOUDINARY_PRESET = "TU_UPLOAD_PRESET"; 

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
  
  // ESTADOS DE DATOS
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ESTADO DEL BUSCADOR
  const [searchTerm, setSearchTerm] = useState("");

  // ESTADOS DE UI
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // ESTADO DE ALERTA DE CONFLICTO (Para categoría con productos)
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [conflictProducts, setConflictProducts] = useState<string[]>([]);
  
  // EDICIÓN
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  // FORMULARIOS
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: "", ingredients: "", categoryId: "", image: ""
  });
  const [categoryFormName, setCategoryFormName] = useState("");

  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false); // <--- NUEVO ESTADO

  // CARGA INICIAL
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

  // --- LÓGICA DEL BUSCADOR ---
  // Filtramos la lista original basándonos en lo que escribe el usuario
  const filteredProducts = productList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- FUNCIÓN PARA DESCARGAR EL QR ---
  const handleDownloadQR = () => {
    const svg = document.getElementById("QRCode");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "mi-carta-qr.svg"; // Se descarga como SVG (Vectorial, alta calidad)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ACCIONES PRODUCTOS ---
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
        const res = await axios.put(`http://localhost:3000/api/products/${editingProduct.id}`, {
            ...productForm,
            isAvailable: editingProduct.isAvailable,
            isDailySpecial: editingProduct.isDailySpecial
        });
        setProductList(productList.map(p => p.id === editingProduct.id ? res.data : p));
        toast({ title: "Actualizado", description: "Producto modificado correctamente" });
      } else {
        const res = await axios.post("http://localhost:3000/api/products", productForm);
        setProductList([res.data, ...productList]);
        toast({ title: "Creado", description: "Nuevo plato agregado" });
      }
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", ingredients: "", categoryId: "", image: "" });
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  // --- ACCIONES CATEGORÍAS (CON PROTECCIÓN) ---
  const handleDeleteCategory = async (id: number) => {
    // Primer aviso simple
    if (!confirm("¿Intentar eliminar categoría?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      // Si pasa (no hay error), la borramos del estado
      setCategories(categories.filter(c => c.id !== id));
      toast({ title: "Eliminada", description: "Categoría borrada correctamente." });
    } catch (error: any) {
      // AQUÍ CAPTURAMOS EL BLOQUEO DEL BACKEND
      if (error.response && error.response.status === 409) {
        // Guardamos los productos conflictivos y abrimos el modal
        setConflictProducts(error.response.data.products);
        setIsConflictDialogOpen(true);
      } else {
        toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
      }
    }
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
      {/* HEADER MEJORADO */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 h-16 flex items-center justify-between relative">
        
        {/* 1. Lado Izquierdo: Logo */}
        <div className="flex items-center gap-2 relative z-10">
            <ChefHat className="text-primary w-6 h-6" />
            <span className="font-bold hidden md:inline text-lg tracking-tight">Admin Panel</span>
        </div>
        
        {/* 2. Centro Perfecto: Buscador (Posición Absoluta) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 hidden md:block">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Buscar platos o categorías..." 
                    className="pl-10 bg-slate-100/50 border-slate-200 focus:bg-white focus:border-primary/50 transition-all rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* 3. Lado Derecho: Botones */}
        <div className="flex items-center gap-2 relative z-10">
            {/* BOTÓN QR CON TEXTO */}
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsQRDialogOpen(true)} 
                className="gap-2 hidden sm:flex border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                title="Ver Código QR"
            >
                <QrCode className="w-4 h-4" />
                <span>Código QR</span>
            </Button>
            
            {/* Botón QR (Solo ícono para móvil) */}
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsQRDialogOpen(true)} 
                className="sm:hidden text-slate-600"
            >
                <QrCode className="w-5 h-5" />
            </Button>

            <div className="h-6 w-px bg-slate-200 mx-1" /> {/* Separador visual */}

            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
            </Button>
        </div>
      </header>

      <main className="container px-4 py-6 max-w-5xl mx-auto">
        <Tabs defaultValue="products">
            <TabsList className="mb-4 w-full md:w-auto">
                <TabsTrigger value="products" className="flex-1 md:flex-none">Platos ({filteredProducts.length})</TabsTrigger>
                <TabsTrigger value="categories" className="flex-1 md:flex-none">Categorías ({filteredCategories.length})</TabsTrigger>
            </TabsList>

            {/* --- LISTA FILTRADA DE PRODUCTOS --- */}
            <TabsContent value="products" className="space-y-4">
                {filteredProducts.length === 0 && <p className="text-center text-muted-foreground py-10">No se encontraron productos</p>}
                
                {filteredProducts.map((p) => (
                    <div key={p.id} className={`p-4 rounded-xl border flex items-center gap-4 bg-white transition-opacity ${!p.isAvailable ? 'opacity-70 bg-slate-50' : ''}`}>
                        <img src={p.image || ""} className="w-16 h-16 rounded-lg bg-slate-200 object-cover border" />
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

                        <div className="flex flex-col gap-2 border-l pl-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditProductClick(p)}><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    </div>
                ))}
            </TabsContent>

            {/* --- LISTA FILTRADA DE CATEGORÍAS --- */}
            <TabsContent value="categories" className="space-y-2">
                {filteredCategories.length === 0 && <p className="text-center text-muted-foreground py-10">No se encontraron categorías</p>}

                {filteredCategories.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border bg-white flex items-center justify-between hover:shadow-sm transition-shadow">
                        <span className="font-medium flex items-center gap-2">
                            <Tag className="w-4 h-4 text-slate-400"/> {c.name}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditCategoryClick(c)} className="hover:bg-blue-50 text-blue-600"><Pencil className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(c.id)} className="hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
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
                <span className="bg-white px-2 py-1 rounded text-xs shadow font-medium">Categoría</span>
                <Button onClick={() => { setIsCategoryDialogOpen(true); setIsFabOpen(false); setEditingCategory(null); setCategoryFormName(""); }} className="h-12 w-12 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700"><Tag/></Button>
              </motion.div>
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="flex items-center gap-2">
                <span className="bg-white px-2 py-1 rounded text-xs shadow font-medium">Plato</span>
                <Button onClick={() => { setIsProductDialogOpen(true); setIsFabOpen(false); setEditingProduct(null); setProductForm({name:"", description:"", price:"", ingredients:"", categoryId:"", image:""}); }} className="h-12 w-12 rounded-full bg-emerald-600 shadow-lg hover:bg-emerald-700"><Utensils/></Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <Button onClick={() => setIsFabOpen(!isFabOpen)} className={`h-14 w-14 rounded-full shadow-xl transition-all ${isFabOpen ? 'rotate-45 bg-slate-800' : 'bg-primary hover:scale-105'}`}><Plus/></Button>
      </div>

      {/* --- DIALOGO DE ERROR: CATEGORÍA CON PRODUCTOS --- */}
      <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <DialogContent className="border-l-4 border-l-red-500">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5"/> No se puede eliminar
                </DialogTitle>
                <DialogDescription className="pt-2">
                    Esta categoría contiene <b>{conflictProducts.length} productos</b>. Debes eliminarlos o cambiarlos de categoría antes de borrarla.
                </DialogDescription>
            </DialogHeader>
            
            <div className="bg-slate-50 p-3 rounded-md max-h-40 overflow-y-auto border text-sm">
                <p className="font-semibold mb-2 text-slate-700">Productos en conflicto:</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {conflictProducts.map((name, i) => (
                        <li key={i}>{name}</li>
                    ))}
                </ul>
            </div>

            <DialogFooter>
                <Button onClick={() => setIsConflictDialogOpen(false)}>Entendido</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- DIALOGO PRODUCTO --- */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? "Editar Plato" : "Nuevo Plato"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label>Foto</Label>
                    <div className="flex gap-2 items-center">
                        <Input type="file" onChange={handleImageUpload} className="text-xs"/>
                        {uploadingImg && <Loader2 className="animate-spin text-primary" />}
                    </div>
                    {productForm.image && <img src={productForm.image} className="h-32 w-full object-cover rounded-lg border" />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Precio</Label>
                        <Input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={productForm.categoryId} onValueChange={v => setProductForm({...productForm, categoryId: v})}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                        <SelectContent>{categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Ingredientes</Label>
                    <Input placeholder="Ej: Tomate, Queso, Albahaca" value={productForm.ingredients} onChange={e => setProductForm({...productForm, ingredients: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                </div>
                <Button onClick={handleSaveProduct} className="w-full" disabled={uploadingImg}>{editingProduct ? "Guardar Cambios" : "Crear Plato"}</Button>
            </div>
        </DialogContent>
      </Dialog>

      {/* --- DIALOGO CATEGORÍA --- */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle></DialogHeader>
            <div className="py-4">
                <Label>Nombre</Label>
                <Input className="mt-2" value={categoryFormName} onChange={e => setCategoryFormName(e.target.value)} placeholder="Ej: Bebidas, Postres..." />
            </div>
            <Button onClick={handleSaveCategory} className="w-full">{editingCategory ? "Guardar" : "Crear"}</Button>
        </DialogContent>
      </Dialog>
        
              {/* --- DIALOGO CÓDIGO QR --- */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
      <DialogContent className="sm:max-w-md flex flex-col items-center">
          <DialogHeader className="text-center">
              <DialogTitle className="text-xl">Menú Digital</DialogTitle>
              <DialogDescription>
                  Escanea o imprime este código para tus mesas.
              </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border my-4 flex flex-col items-center gap-4">
              {/* El componente QR */}
              <div className="bg-white p-2">
                  <QRCode
                      id="QRCode"
                      value={window.location.origin} // Toma la URL actual automáticamente
                      size={200}
                      level="H" // Nivel de corrección alto (se ve mejor)
                      className="h-auto max-w-full"
                  />
              </div>
              <p className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
                  {window.location.origin}
              </p>
          </div>

          <DialogFooter className="w-full sm:justify-center">
              <Button onClick={handleDownloadQR} className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800">
                  <Download className="w-4 h-4" /> Descargar Imagen QR
              </Button>
          </DialogFooter>
      </DialogContent>
      </Dialog>

    </div>
  );
};

export default Dashboard;