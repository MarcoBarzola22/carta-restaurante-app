// client/src/components/layout/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 text-center mt-auto">
        <div className="max-w-md mx-auto">
          <h3 className="text-white font-serif text-xl mb-4">MAS INFORMACION</h3>
          
          <div className="space-y-2 text-sm mb-8">
            <p>📍 Calle Falsa 123, Villa Mercedes</p>
            <p>📞 (2657) 123-456</p>
            <p>⏰ Mar - Dom: 19:00 - 01:00</p>
            <p>Redes sociales</p>
              
          </div>
  
          <div className="border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-600">
              Desarrollado por <span className="text-amber-600 font-bold">GEPI SOFTWARE</span>
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;