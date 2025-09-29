import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { LandingPage } from "@/components/LandingPage";
import { CustomerView } from "@/components/CustomerView";
import { BusinessDashboard } from "@/components/BusinessDashboard";
import { PricingPage } from "@/components/PricingPage";

const Index = () => {
  const [currentMode, setCurrentMode] = useState<'landing' | 'customer' | 'business' | 'pricing'>('landing');

  const handleModeChange = (mode: 'landing' | 'customer' | 'business' | 'pricing') => {
    setCurrentMode(mode);
  };

  return (
    <div className="min-h-screen">
      <Navigation currentMode={currentMode} onModeChange={handleModeChange} />
      
      {currentMode === 'landing' && <LandingPage onModeChange={handleModeChange} />}
      {currentMode === 'customer' && <CustomerView />}
      {currentMode === 'business' && <BusinessDashboard />}
      {currentMode === 'pricing' && <PricingPage onModeChange={handleModeChange} />}
    </div>
  );
};

export default Index;
