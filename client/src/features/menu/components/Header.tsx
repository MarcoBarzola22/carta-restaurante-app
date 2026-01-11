// client/src/features/menu/components/Header.tsx
import { ChefHat } from "lucide-react";

const Header = () => {
  return (
    <header className="relative w-full h-[250px] overflow-hidden">
      {/* 1. Imagen de Fondo con Efecto Blur */}
      {/* NOTA: Cambia la URL por una foto real de tu restaurante más adelante */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-[2px] brightness-50 transform scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop')" }} 
      />
      
      {/* 2. Contenido Sobrepuesto (Logo y Texto) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
        <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl mb-4 bg-black/40 flex items-center justify-center backdrop-blur-md">
           {/* Usamos un ícono por ahora, luego pones <img src="/logo.png" /> */}
           <ChefHat className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-wider mb-2 shadow-sm">
          SABORES
        </h1>
        
        <p className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-[0.3em] text-amber-400">
          Villa Mercedes • Food Truck
        </p>
      </div>
    </header>
  );
};

export default Header;