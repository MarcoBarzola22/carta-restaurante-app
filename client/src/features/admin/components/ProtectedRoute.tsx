import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Buscamos el token en la caja fuerte del navegador
  const token = localStorage.getItem("authToken");

  // Si NO hay token, lo mandamos al login de una patada
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, lo dejamos pasar
  return <>{children}</>;
};