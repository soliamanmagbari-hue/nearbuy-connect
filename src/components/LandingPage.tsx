import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Store, Bell, CreditCard, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

interface LandingPageProps {
  onModeChange: (mode: 'customer' | 'business' | 'pricing') => void;
}

export const LandingPage = ({ onModeChange }: LandingPageProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Connect Local
                  <span className="bg-hero-gradient bg-clip-text text-transparent block">
                    Businesses & Customers
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  The ultimate platform connecting nearby stores, cafés, and markets with customers. 
                  Discover local businesses or showcase your store to the community.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => onModeChange('customer')}
                  className="group"
                >
                  <MapPin className="h-5 w-5 group-hover:animate-pulse" />
                  Explore as Customer
                </Button>
                <Button
                  variant="location"
                  size="lg"
                  onClick={() => onModeChange('business')}
                  className="group"
                >
                  <Store className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Join as Business
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Free for Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <span>Grow Your Business</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-hero-gradient rounded-3xl blur-3xl opacity-20 animate-pulse-glow"></div>
              <img 
                src={heroImage} 
                alt="Market Connect App Interface" 
                className="relative rounded-3xl shadow-strong animate-float w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Two Modes, Endless Possibilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're discovering local gems or promoting your business, 
              Market Connect has the perfect solution for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Customer Mode */}
            <Card className="p-8 bg-card-gradient border-2 border-primary/20 hover:border-primary/40 transition-smooth group">
              <div className="space-y-6">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Customer Mode</h3>
                  <p className="text-muted-foreground mb-6">
                    Discover amazing local businesses around you with our interactive map and smart notifications.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-secondary" />
                      <span className="text-sm">Push notifications for nearby offers</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-secondary" />
                      <span className="text-sm">Interactive location-based discovery</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Store className="h-4 w-4 text-secondary" />
                      <span className="text-sm">Detailed store profiles & products</span>
                    </li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onModeChange('customer')}
                >
                  Try Customer Mode
                </Button>
              </div>
            </Card>

            {/* Business Mode */}
            <Card className="p-8 bg-card-gradient border-2 border-secondary/20 hover:border-secondary/40 transition-smooth group">
              <div className="space-y-6">
                <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Store className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Business Mode</h3>
                  <p className="text-muted-foreground mb-6">
                    Showcase your business to local customers and track engagement with powerful analytics.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-accent" />
                      <span className="text-sm">Monthly subscription model</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-sm">Customer engagement analytics</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-accent" />
                      <span className="text-sm">Promote offers & special deals</span>
                    </li>
                  </ul>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => onModeChange('business')}
                >
                  Start Your Business
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              variant="hero"
              size="lg"
              onClick={() => onModeChange('pricing')}
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};