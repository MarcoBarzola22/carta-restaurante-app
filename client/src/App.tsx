import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicMenu from '@/features/menu/pages/PublicMenu';
import Dashboard from '@/features/admin/pages/Dashboard';
import Login from '@/features/admin/pages/Login';

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicMenu />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;