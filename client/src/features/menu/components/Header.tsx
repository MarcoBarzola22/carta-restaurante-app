import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="chef-recommendation w-10 h-10 rounded-xl flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground leading-tight">
              Sabores
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Food Truck</p>
          </div>
        </Link>
        <Link 
          to="/admin/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  );
};

export default Header;
