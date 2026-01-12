import { useState } from "react";
import axios from "axios";
import { ShoppingCart, Trash2, MapPin, User, Store, Bike, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// ⚠️ PON TU NÚMERO AQUÍ (Sin espacios, sin +)
const RESTAURANT_PHONE = "5492657249135"; 

export const CartSidebar = () => {
  const { items, removeFromCart, updateQuantity, total, count, clearCart } = useCart();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [deliveryType, setDeliveryType] = useState<"RETIRO" | "DELIVERY">("DELIVERY");
  const [address, setAddress] = useState("");

  const handleCheckout = async () => {
    if (!name.trim()) return toast({ title: "Falta tu nombre", variant: "destructive" });
    if (deliveryType === "DELIVERY" && !address.trim()) return toast({ title: "Falta dirección", variant: "destructive" });

    setLoading(true);
    // Crear string de detalles
    const detailsText = items.map(i => `${i.quantity}x ${i.name} ($${i.price * i.quantity})`).join('\n');

    try {
      // 1. Guardar en Base de Datos (Generar ID)
      const { data: order } = await axios.post("http://localhost:3000/api/orders", {
        customer: name,
        address: deliveryType === "DELIVERY" ? address : null,
        type: deliveryType,
        total,
        details: detailsText
      });

      // 2. Mensaje de WhatsApp
      const message = `Hola! Quiero hacer un pedido:
${detailsText}

*Total Comida:* $${total}
*Cliente:* ${name}
*Modo:* ${deliveryType} ${deliveryType === 'DELIVERY' ? `(${address})` : ''}
${deliveryType === 'DELIVERY' ? '*Envío:* A coordinar' : ''}

🆔 *ID de Seguridad:* #${order.id}
_(No borrar este ID)_`;

      window.open(`https://wa.me/${RESTAURANT_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
      
      clearCart();
      setIsOpen(false);
      toast({ title: "¡Pedido Enviado!", description: "Continúa en WhatsApp" });

    } catch (e) { 
        toast({ title: "Error", description: "No se pudo crear el pedido", variant: "destructive" }); 
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 flex flex-col items-center justify-center p-0 bg-primary hover:scale-105 transition-transform border-4 border-white">
          <div className="relative">
            <ShoppingCart className="w-7 h-7" />
            {count > 0 && <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-white shadow">{count}</span>}
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader><SheetTitle>Tu Carrito 🛒</SheetTitle></SheetHeader>
        
        <ScrollArea className="flex-1 pr-2 -mr-2 my-4">
            {items.length === 0 ? 
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-50">
                    <ShoppingCart className="w-12 h-12 mb-2"/>
                    <p>Carrito vacío</p>
                </div> 
            : items.map((item) => (
                <div key={item.id} className="flex gap-3 mb-4 p-2 border rounded-lg bg-slate-50/50">
                  <div className="h-16 w-16 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={item.image} className="h-full w-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-primary font-bold text-sm">${item.price * item.quantity}</p>
                        <div className="flex items-center gap-2 bg-white rounded-md border px-1 h-7 shadow-sm">
                            <button onClick={() => updateQuantity(String(item.id), -1)} className="px-1.5 hover:bg-slate-100">-</button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(String(item.id), 1)} className="px-1.5 hover:bg-slate-100">+</button>
                        </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(String(item.id))} className="text-red-400 hover:text-red-600 px-1"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
        </ScrollArea>

        {items.length > 0 && (
          <div className="space-y-4 pt-4 border-t bg-background">
            <RadioGroup defaultValue="DELIVERY" onValueChange={(v: any) => setDeliveryType(v)} className="grid grid-cols-2 gap-3">
              <div>
                  <RadioGroupItem value="DELIVERY" id="d" className="sr-only"/>
                  <Label htmlFor="d" className={`flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer hover:bg-slate-50 ${deliveryType==='DELIVERY'?'border-primary bg-primary/5 text-primary':''}`}><Bike className="w-5 h-5 mb-1"/>Delivery</Label>
              </div>
              <div>
                  <RadioGroupItem value="RETIRO" id="r" className="sr-only"/>
                  <Label htmlFor="r" className={`flex flex-col items-center justify-center p-2 border-2 rounded-lg cursor-pointer hover:bg-slate-50 ${deliveryType==='RETIRO'?'border-primary bg-primary/5 text-primary':''}`}><Store className="w-5 h-5 mb-1"/>Retiro</Label>
              </div>
            </RadioGroup>
            
            <div className="space-y-2">
                <div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/><Input className="pl-9" placeholder="Tu Nombre" value={name} onChange={e => setName(e.target.value)} /></div>
                {deliveryType === "DELIVERY" && <div className="relative animate-in fade-in slide-in-from-top-1"><MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/><Input className="pl-9" placeholder="Dirección exacta" value={address} onChange={e => setAddress(e.target.value)} /></div>}
            </div>

            <div className="flex justify-between items-end border-t pt-2">
                <span className="text-muted-foreground text-sm">Total Comida:</span>
                <span className="font-bold text-2xl text-primary">${total}</span>
            </div>
            
            <Button onClick={handleCheckout} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2"/> : "Enviar Pedido a WhatsApp"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};