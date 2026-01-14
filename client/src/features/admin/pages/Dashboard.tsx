import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
// IMPORTACIONES UNIFICADAS (Sin duplicados)
import { 
  ChefHat, Plus, LogOut, Loader2, Star, Utensils, Tag, Pencil, 
  Trash2, Search, AlertTriangle, Receipt, Clock, User, MapPin, QrCode, Download 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "react-qr-code";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

interface Order {
    id: number;
    customer: string;
    address?: string;
    type: string;
    total: number;
    details: string;
    createdAt: string;
}

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [productList, setProductList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // BUSCADORES
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");

  // ESTADOS UI
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [conflictProducts, setConflictProducts] = useState<string[]>([]);
  
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  
  const [uploadingImg, setUploadingImg] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", ingredients: "", categoryId: "", image: "" });
  const [categoryFormName, setCategoryFormName] = useState("");
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)

// Obtenemos la URL actual para generar el QR (apunta a la raíz donde está el menú)
const menuUrl = "https://carta-restaurante-app.vercel.app/";

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, orderRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/orders`)
      ]);
      setProductList(prodRes.data);
      setCategories(catRes.data);
      setOrders(orderRes.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  // 3. FUNCIÓN PARA DESCARGAR EL QR
  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white"; // Fondo blanco para que se lea bien
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "CodigoQR-Menu.png";
        downloadLink.href = pngFile;
        downloadLink.click();
        toast({ title: "Descarga iniciada", description: "El código QR se ha guardado." });
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]; if (!file) return; setUploadingImg(true);
      const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", CLOUDINARY_PRESET);
      try { const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      setProductForm({ ...productForm, image: res.data.secure_url }); } 
      catch (e) { toast({ title: "Error", variant: "destructive" }); } finally { setUploadingImg(false); }
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.categoryId) return toast({title:"Faltan datos", variant:"destructive"});
    try {
      if (editingProduct) {
        const res = await axios.put(`${API_URL}/api/products/${editingProduct.id}`, { ...productForm, isAvailable: editingProduct.isAvailable, isDailySpecial: editingProduct.isDailySpecial });
        setProductList(productList.map(p => p.id === editingProduct.id ? res.data : p));
      } else {
        const res = await axios.post(`${API_URL}/api/products`, productForm);
        setProductList([res.data, ...productList]);
      }
      setIsProductDialogOpen(false); setEditingProduct(null); setProductForm({ name: "", description: "", price: "", ingredients: "", categoryId: "", image: "" });
      toast({title:"Guardado"});
    } catch (e) { toast({title:"Error", variant:"destructive"}); }
  };

  const handleDeleteProduct = async (id: number) => {
    if(!confirm("¿Eliminar plato?")) return;
    try { await axios.delete(`${API_URL}/api/products/${id}`); setProductList(productList.filter(p=>p.id!==id)); } catch(e){ toast({title:"Error", variant:"destructive"}); }
  };

  const handleToggle = async (id: number, field: string, val: boolean) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, [field]: !val } : p));
    try { await axios.patch(`${API_URL}/api/products/${id}`, { [field]: !val }); } 
    catch (e) { setProductList(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p)); }
  };

  const handleSaveCategory = async () => {
    if(!categoryFormName) return;
    try {
        if(editingCategory) {
            const res = await axios.put(`${API_URL}/api/categories/${editingCategory.id}`, {name:categoryFormName});
            setCategories(categories.map(c=>c.id===editingCategory.id?res.data:c));
        } else {
            const res = await axios.post(`${API_URL}/api/categories`, {name:categoryFormName});
            setCategories([...categories, res.data]);
        }
        setIsCategoryDialogOpen(false); setEditingCategory(null); setCategoryFormName("");
        toast({title:"Guardado"});
    } catch(e) { toast({title:"Error", variant:"destructive"}); }
  };

  const handleDeleteCategory = async (id: number) => {
    if(!confirm("¿Eliminar?")) return;
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      setCategories(categories.filter(c=>c.id!==id));
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setConflictProducts(error.response.data.products);
        setIsConflictDialogOpen(true);
      } else { toast({title:"Error", variant:"destructive"}); }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const filteredProducts = productList.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = orders.filter(o => 
    String(o.id).includes(orderSearchTerm) || 
    o.customer.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2"><ChefHat className="text-primary"/><span className="font-bold hidden md:inline">Admin Panel</span></div>
        <div className="flex-1 max-w-xs mx-4 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Buscar platos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 bg-secondary/50"/>
        </div>
        

        {/* 4. BOTONES DEL HEADER (QR + LOGOUT) */}
        <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setIsQRDialogOpen(true)} className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                <span className="font-medium">Código QR</span>
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <Button variant="ghost" onClick={handleLogout}> {/* <--- AQUÍ USAMOS LA FUNCIÓN */}
              <LogOut className="w-5 h-5"/>
            </Button>
        </div>    
      </header>

      {/* CONTENIDO */}
      <main className="container px-4 py-6 max-w-5xl mx-auto">
        <Tabs defaultValue="orders">
            <TabsList className="mb-6 w-full md:w-auto grid grid-cols-3 md:flex">
                <TabsTrigger value="orders" className="gap-2"><Receipt className="w-4 h-4"/> Pedidos</TabsTrigger>
                <TabsTrigger value="products">Platos</TabsTrigger>
                <TabsTrigger value="categories">Categorías</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
               <div className="flex gap-2 mb-4 bg-white p-3 rounded-lg border shadow-sm items-center">
                  <Search className="h-5 w-5 text-slate-400" />
                  <Input placeholder="Buscar por ID o Cliente..." value={orderSearchTerm} onChange={(e) => setOrderSearchTerm(e.target.value)} className="border-0 focus-visible:ring-0 text-lg"/>
               </div>
               {filteredOrders.length === 0 && <p className="text-center text-muted-foreground py-10">No hay pedidos</p>}
               {filteredOrders.map((order) => (
                 <div key={order.id} className="bg-white border rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3 border-b pb-3 border-dashed">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-xs font-bold font-mono">ID #{order.id}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><User className="w-4 h-4"/> {order.customer}</h3>
                        </div>
                        <div className="text-right">
                             <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.type === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{order.type}</span>
                             {order.type === 'DELIVERY' && <p className="text-xs mt-1 text-slate-600 flex items-center justify-end gap-1"><MapPin className="w-3 h-3"/> {order.address}</p>}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 whitespace-pre-line mb-3 border font-mono">{order.details}</div>
                    <div className="flex justify-between items-center"><span className="text-sm font-semibold text-slate-500">Total Comida:</span><span className="text-xl font-bold text-green-600">${order.total}</span></div>
                 </div>
               ))}
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
                {filteredProducts.map((p) => (
                    <div key={p.id} className={`p-4 rounded-xl border flex items-center gap-4 bg-white ${!p.isAvailable ? 'opacity-70 bg-slate-50' : ''}`}>
                        <img src={p.image || ""} className="w-16 h-16 rounded-lg bg-slate-200 object-cover border" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2"><span className="font-bold truncate">{p.name}</span>{p.isDailySpecial && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}</div>
                            <div className="text-xs text-muted-foreground">${p.price}</div>
                        </div>
                        <div className="flex flex-col gap-2 items-end mr-4">
                            <div className="flex items-center gap-2"><span className={`text-[10px] font-bold ${p.isAvailable ? 'text-green-600' : 'text-slate-400'}`}>{p.isAvailable ? "En Venta" : "Agotado"}</span><Switch checked={p.isAvailable} onCheckedChange={() => handleToggle(p.id, 'isAvailable', p.isAvailable)} /></div>
                            <div className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground">Destacar</span><Switch checked={p.isDailySpecial} onCheckedChange={() => handleToggle(p.id, 'isDailySpecial', p.isDailySpecial)} className="data-[state=checked]:bg-amber-400"/></div>
                        </div>
                        <div className="flex flex-col gap-2 border-l pl-4">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(p); setIsProductDialogOpen(true); setProductForm({ name: p.name, description: p.description||"", price: String(p.price), ingredients: p.ingredients||"", categoryId: String(p.categoryId), image: p.image||"" }); }}><Pencil className="w-4 h-4 text-blue-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                    </div>
                ))}
            </TabsContent>

            <TabsContent value="categories" className="space-y-2">
                {filteredCategories.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border bg-white flex items-center justify-between">
                        <span className="font-medium flex items-center gap-2"><Tag className="w-4 h-4 text-slate-400"/> {c.name}</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(c); setCategoryFormName(c.name); setIsCategoryDialogOpen(true); }}><Pencil className="w-4 h-4 text-blue-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(c.id)}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                    </div>
                ))}
            </TabsContent>
        </Tabs>
      </main>

      {/* FAB */}
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

      {/* DIALOGOS */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? "Editar Plato" : "Nuevo Plato"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Foto</Label><div className="flex gap-2 items-center"><Input type="file" onChange={handleImageUpload} className="text-xs"/>{uploadingImg && <Loader2 className="animate-spin text-primary" />}</div>{productForm.image && <img src={productForm.image} className="h-32 w-full object-cover rounded-lg border" />}</div>
                <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Nombre</Label><Input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} /></div><div className="space-y-2"><Label>Precio</Label><Input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} /></div></div>
                <div className="space-y-2"><Label>Categoría</Label><Select value={productForm.categoryId} onValueChange={v => setProductForm({...productForm, categoryId: v})}><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Ingredientes</Label><Input placeholder="Ej: Tomate, Queso" value={productForm.ingredients} onChange={e => setProductForm({...productForm, ingredients: e.target.value})} /></div>
                <div className="space-y-2"><Label>Descripción</Label><Textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} /></div>
                <Button onClick={handleSaveProduct} className="w-full" disabled={uploadingImg}>{editingProduct ? "Guardar Cambios" : "Crear Plato"}</Button>
            </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle></DialogHeader><Input value={categoryFormName} onChange={e => setCategoryFormName(e.target.value)} placeholder="Nombre" /><Button onClick={handleSaveCategory} className="w-full mt-4">Guardar</Button></DialogContent>
      </Dialog>

      <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <DialogContent className="border-l-4 border-l-red-500"><DialogHeader><DialogTitle className="text-red-600 flex gap-2"><AlertTriangle/> No se puede eliminar</DialogTitle><DialogDescription>Tiene productos dentro.</DialogDescription></DialogHeader><ul className="list-disc pl-5 text-sm bg-slate-50 p-2 rounded max-h-32 overflow-y-auto">{conflictProducts.map((p,i)=><li key={i}>{p}</li>)}</ul><Button onClick={()=>setIsConflictDialogOpen(false)}>Entendido</Button></DialogContent>
      </Dialog>

      {/* 5. NUEVO DIALOGO PARA EL CÓDIGO QR */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md flex flex-col items-center">
            <DialogHeader>
                <DialogTitle className="text-center">Código QR del Menú</DialogTitle>
                <DialogDescription className="text-center">
                    Escanea para ver la carta o descarga la imagen para imprimir.
                </DialogDescription>
            </DialogHeader>
            
            <div className="p-6 bg-white rounded-xl shadow-inner border my-4">
                <QRCode
                    id="qr-code-svg"
                    value={menuUrl}
                    size={200}
                    level="H" 
                />
            </div>
            
            <Button onClick={handleDownloadQR} className="w-full gap-2" variant="outline">
                <Download className="w-4 h-4" />
                Descargar Imagen
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard; // <--- AQUÍ ESTÁ EL DEFAULT EXPORT QUE FALTABA