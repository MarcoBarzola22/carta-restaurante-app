import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicMenu from '@/features/menu/pages/PublicMenu';
import Dashboard from '@/features/admin/pages/Dashboard';
import Login from '@/features/admin/pages/Login';
import { ProtectedRoute } from '@/features/admin/components/ProtectedRoute'; // <--- IMPORTAMOS AL GUARDIA

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<PublicMenu />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta Protegida (Solo entra si tiene token) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;