import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowRight, MapPin, Smartphone, Store, Users, Star, TrendingUp, Shield, Zap } from "lucide-react";
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
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Market Connect</span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? <div className="flex items-center gap-4">
                <Link to="/customer">
                  <Button variant="outline">Customer View</Button>
                </Link>
                <Link to="/business">
                  <Button variant="outline">Business View</Button>
                </Link>
                <Button variant="ghost" onClick={signOut}>
                  Sign Out
                </Button>
              </div> : <div className="flex items-center gap-4">
                <Link to="/pricing">
                  <Button variant="ghost">Pricing</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default">Get Started</Button>
                </Link>
              </div>}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Connect
                
                <br />
                with Local
                
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                The ultimate platform for discovering local stores, cafés, and markets. 
                Get real-time offers and connect with businesses in your area.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={user ? "/customer" : "/auth"}>
                <Button size="lg" className="w-full sm:w-auto" variant="hero">
                  <Users className="h-5 w-5" />
                  For Customers
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to={user ? "/business" : "/auth"}>
                <Button size="lg" variant="location" className="w-full sm:w-auto">
                  <Store className="h-5 w-5" />
                  For Businesses
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span>Real-time Updates</span>
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
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => <div key={index} className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-primary">
                {stat.number}
              </div>
              <div className="text-muted-foreground">
                {stat.label}
              </div>
            </div>)}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Why Choose Market Connect?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover local businesses and grow your customer base.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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