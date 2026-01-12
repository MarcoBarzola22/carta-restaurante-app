import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicMenu from '@/features/menu/pages/PublicMenu';
import Dashboard from '@/features/admin/pages/Dashboard';
import Login from '@/features/admin/pages/Login';
import { ProtectedRoute } from '@/features/admin/components/ProtectedRoute';

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        {/* RUTA PRINCIPAL = MENÚ PÚBLICO */}
        <Route path="/" element={<PublicMenu />} />
        
        {/* RUTA ADMIN = DASHBOARD CON PEDIDOS */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;