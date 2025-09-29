import { Button } from "@/components/ui/button";
import { MapPin, Store, Menu } from "lucide-react";

interface NavigationProps {
  currentMode: 'landing' | 'customer' | 'business' | 'pricing';
  onModeChange: (mode: 'landing' | 'customer' | 'business' | 'pricing') => void;
}

export const Navigation = ({ currentMode, onModeChange }: NavigationProps) => {
  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onModeChange('landing')}
          >
            <div className="bg-hero-gradient p-2 rounded-lg shadow-soft">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-hero-gradient bg-clip-text text-transparent">
              Market Connect
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={currentMode === 'customer' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('customer')}
            >
              <MapPin className="h-4 w-4" />
              Customer Mode
            </Button>
            <Button
              variant={currentMode === 'business' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange('business')}
            >
              <Store className="h-4 w-4" />
              Business Mode
            </Button>
            <Button
              variant={currentMode === 'pricing' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onModeChange('pricing')}
            >
              Pricing
            </Button>
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};