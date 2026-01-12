import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Lock, User } from "lucide-react"; // Cambié Mail por User que es más común
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios"; 

const Login = () => { // Quitamos el "export" de aquí
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Petición al backend
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      if (response.data.success) {
        // Guardamos la sesión
        localStorage.setItem("authToken", response.data.token);
        navigate("/admin");
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Bienvenido Chef</h1>
            <p className="text-slate-500">Ingresa al panel de control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Usuario" 
                  className="pl-10" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  type="password" 
                  placeholder="Contraseña" 
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Verificando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; // <--- ESTO ES LO QUE FALTABA