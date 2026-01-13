import { Instagram, MapPin, Phone, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 text-center mt-auto border-t border-slate-800">
      <div className="max-w-md mx-auto flex flex-col items-center">
        
        {/* SECCIÓN INFO */}
        <h3 className="text-white font-serif text-xl mb-6 tracking-wide">MÁS INFORMACIÓN</h3>
        
        <div className="space-y-4 text-sm mb-8 flex flex-col items-center">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500"/> Betbeder 92, Villa Mercedes
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-500"/> (2657) 78-7075
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500"/> Lun - Dom: 18:30 - 00:00
          </p>
        </div>

        {/* SECCIÓN REDES SOCIALES */}
        <div className="flex flex-col items-center gap-4 mb-8">
            <h3 className="text-white font-serif text-lg tracking-wide uppercase">
              Redes Sociales
            </h3>
            
            <a 
                href="https://www.instagram.com/sr.arepa.villamercedes/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
                <Instagram className="w-5 h-5" />
                Seguinos en Instagram
            </a>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-slate-800 pt-6 w-full">
          <p className="text-xs text-slate-600">
            Desarrollado por <span className="text-amber-600 font-bold">GEPI SOFTWARE</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;