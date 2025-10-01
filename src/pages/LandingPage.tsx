import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowRight, MapPin, Smartphone, Store, Users, Star, TrendingUp, Shield, Zap, LogOut } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
const LandingPage = () => {
  const {
    user,
    signOut
  } = useAuth();
  const features = [{
    icon: MapPin,
    title: "Location-Based Discovery",
    description: "Find businesses around you with real-time location tracking and mapping."
  }, {
    icon: Smartphone,
    title: "Push Notifications",
    description: "Get notified about special offers and promotions when you're nearby."
  }, {
    icon: Store,
    title: "Business Profiles",
    description: "Detailed store information with photos, hours, contact details and more."
  }, {
    icon: Users,
    title: "Customer Insights",
    description: "Businesses can track customer engagement and optimize their offerings."
  }];
  const stats = [{
    number: "1000+",
    label: "Local Businesses"
  }, {
    number: "50k+",
    label: "Active Users"
  }, {
    number: "500k+",
    label: "Connections Made"
  }, {
    number: "98%",
    label: "Customer Satisfaction"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold">Market Connect</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            {user ? <div className="flex items-center gap-2">
                <Link to="/customer" className="hidden sm:block">
                  <Button variant="outline" size="sm">Customer</Button>
                </Link>
                <Link to="/business" className="hidden sm:block">
                  <Button variant="outline" size="sm">Business</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="hidden sm:flex">
                  Sign Out
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut} className="sm:hidden">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div> : <div className="flex items-center gap-2">
                <Link to="/pricing" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Pricing</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" size="sm">Get Started</Button>
                </Link>
              </div>}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connect with Local Businesses
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl">
                The ultimate platform for discovering local stores, cafés, and markets. 
                Get real-time offers and connect with businesses in your area.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to={user ? "/customer" : "/auth"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full" variant="hero">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  For Customers
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <Link to={user ? "/business" : "/auth"} className="w-full sm:w-auto">
                <Button size="lg" variant="location" className="w-full">
                  <Store className="h-4 w-4 md:h-5 md:w-5" />
                  For Businesses
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 md:h-4 md:w-4 text-accent fill-accent" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                <span>Real-time</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-strong">
              <img src={heroImage} alt="Market Connect App Preview" className="w-full h-auto" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-2xl blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => <div key={index} className="text-center space-y-1 md:space-y-2">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>)}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Why Choose Market Connect?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Everything you need to discover local businesses and grow your customer base.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return <div key={index} className="group">
                <div className="bg-card-gradient border border-border/50 rounded-xl p-6 h-full hover:shadow-strong transition-smooth group-hover:border-primary/20">
                  <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>;
        })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-card-gradient border border-border/50 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of customers and businesses already using Market Connect 
            to build stronger local communities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/customer" : "/auth"}>
              <Button size="lg" variant="hero" className="w-full sm:w-auto">
                Start Discovering
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
                <TrendingUp className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-semibold">Market Connect</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 Market Connect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;