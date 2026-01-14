import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/features/menu/data/menuData"; 
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ChefCarouselProps {
  products: Product[]; 
  onProductClick: (product: Product) => void;
}

const ChefCarousel = ({ products, onProductClick }: ChefCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 1. NUEVO: Estado para detectar si es celular y calcular márgenes exactos
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Verificar al cargar
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % products.length);
  };

  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + products.length) % products.length);
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [products.length, activeIndex]); 

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(nextSlide, 3500);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleManualNext = () => { nextSlide(); startTimer(); };
  const handleManualPrev = () => { prevSlide(); startTimer(); };

  const handleCardClick = (index: number, product: Product) => {
    let position = index - activeIndex;
    const half = Math.floor(products.length / 2);
    if (position < -half) position += products.length;
    if (position > half) position -= products.length;

    if (position === 0) {
      onProductClick(product);
    } else {
      setActiveIndex(index);
      startTimer(); 
    }
  };

  if (!products || products.length === 0) return null;

  // 2. CÁLCULO DE CENTRADO EXACTO
  // Móvil: w-64 (256px) -> Mitad 128px. Altura (Aspect 4/5) ~320px -> Mitad 160px
  // PC: w-72 (288px) -> Mitad 144px. Altura (Aspect 4/5) ~360px -> Mitad 180px
  const marginLeft = isMobile ? -128 : -144;
  const marginTop = isMobile ? -160 : -180;
  const xOffset = isMobile ? 160 : 240;

  return (
    <section className="py-8 bg-slate-50 overflow-hidden flex flex-col items-center">
      <div className="px-4 mb-6 text-center z-20">
        <div className="inline-flex items-center gap-2 mb-2 bg-amber-100 px-4 py-1 rounded-full shadow-sm">
          <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Recomendados
          </span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">
          Platos del Día
        </h2>
      </div>

      <div className="relative w-full h-[400px] flex items-center justify-center">
        
        {/* 3. CORRECCIÓN FLECHAS: Centrado vertical exacto (top-1/2 -translate-y-1/2) */}
        <button 
          onClick={handleManualPrev}
          className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all text-slate-800 border border-slate-100 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={handleManualNext}
          className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all text-slate-800 border border-slate-100 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="relative w-full max-w-[1200px] h-full flex items-center justify-center perspective-1000">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => {
              let position = (index - activeIndex);
              const half = Math.floor(products.length / 2);
              if (position < -half) position += products.length;
              if (position > half) position -= products.length;

              if (Math.abs(position) > 2) return null;

              const isCenter = position === 0;
              const dist = Math.abs(position);
              
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    x: position * xOffset,
                    scale: isCenter ? 1.05 : (dist === 1 ? 0.85 : 0.7),
                    zIndex: 10 - dist,
                    opacity: isCenter ? 1 : (dist === 1 ? 0.7 : 0.3),
                    filter: isCenter ? "blur(0px)" : `blur(${dist * 2}px)`,
                    rotateY: position * 5
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 30 }}
                  onClick={() => handleCardClick(index, product)}
                  
                  className={`absolute top-1/2 left-1/2 
                    w-64 md:w-72 aspect-[4/5] 
                    rounded-3xl shadow-2xl bg-white overflow-hidden border border-slate-100
                    cursor-pointer transition-shadow duration-300
                    ${isCenter ? 'shadow-amber-500/20 ring-4 ring-white' : 'shadow-slate-400/10'}
                  `}
                  // 4. APLICAMOS EL MARGEN DINÁMICO
                  style={{
                    marginTop: `${marginTop}px`,
                    marginLeft: `${marginLeft}px`, 
                  }}
                >
                  <div className="relative h-3/4 w-full bg-slate-200">
                    <img
                      src={product.image || ""}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                    
                    {isCenter && (
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border border-slate-100">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(Number(product.price))}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="h-1/4 p-4 flex flex-col justify-center items-center text-center bg-white relative z-10">
                    <h3 className={`font-serif font-bold text-slate-800 leading-tight transition-all duration-300
                      ${isCenter ? 'text-lg' : 'text-sm opacity-70'}
                    `}>
                      {product.name}
                    </h3>
                    
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: isCenter ? 1 : 0.5 }}
                      className="mt-2"
                    >
                        <span className={`text-[10px] uppercase tracking-widest font-bold border-b pb-0.5
                          ${isCenter 
                            ? 'text-amber-600 border-amber-200' 
                            : 'text-slate-400 border-transparent'}
                        `}>
                          {isCenter ? 'Ver Detalles' : 'Ver Plato'}
                        </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ChefCarousel;