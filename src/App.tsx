import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import CustomerDashboard from "@/pages/CustomerDashboard";
import BusinessDashboard from "@/pages/BusinessDashboard";
import PricingPage from "@/pages/PricingPage";

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="market-connect-theme">
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/business" 
              element={
                <ProtectedRoute>
                  <BusinessDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
