// client/src/features/menu/components/Header.tsx
import { ChefHat } from "lucide-react"; 

// 1. IMPORTA TUS IMÁGENES AQUÍ
// CORRECCIÓN 1: Agregué la comilla que faltaba al final
import imgFondo from "@/assets/FondoSr-Arepa.JPG"; 
import imgLogo from "@/assets/logoConBordes.png"; 

const Header = () => {
  return (
    <header className="relative w-full h-[250px] overflow-hidden">
      {/* 1. IMAGEN DE FONDO */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] brightness-50 transform scale-105"
        style={{ 
           backgroundImage: `url(${imgFondo})` 
        }} 
      />
      
      {/* 2. Contenido Sobrepuesto */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
        
        {/* CÍRCULO DEL LOGO */}
        <div className="w-28 h-28 rounded-full border-4 border-white/20 shadow-xl mb-3 bg-black/40 flex items-center justify-center backdrop-blur-md overflow-hidden relative">
           
           {imgLogo ? (
             <img 
               src={imgLogo} /* CORRECCIÓN 2: Usar la variable imgLogo entre llaves {} */
               alt="Logo Sr. Arepa" 
               className="w-full h-full object-cover" 
             />
           ) : (
             <ChefHat className="w-12 h-12 text-white" />
           )}
        </div>
        
        {/* TÍTULO PRINCIPAL */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-wider mb-2 shadow-sm text-amber-400 drop-shadow-md">
          Sr. Arepa
        </h1>
        
        {/* SUBTÍTULO */}
        <p className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-[0.2em] text-white">
          Villa Mercedes • Comida Típica Venezolana
        </p>
      </div>
    </header>
  );
};

export default Header;