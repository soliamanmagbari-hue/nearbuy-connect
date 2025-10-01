import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { MapPin, ArrowLeft, Check, Star, TrendingUp, Zap, LogOut } from "lucide-react";
const PricingPage = () => {
  const {
    user,
    signOut
  } = useAuth();
  const plans = [{
    name: "Basic",
    price: "$2.99",
    period: "/month",
    description: "Perfect for small local businesses getting started",
    features: ["Business profile listing", "Basic location visibility", "Customer contact info", "Basic hours & description", "Mobile app presence", "Email support"],
    popular: false,
    cta: "Start Basic Plan"
  }, {
    name: "Professional",
    price: "$9.99",
    period: "/month",
    description: "Ideal for growing businesses wanting more visibility",
    features: ["Everything in Basic", "Enhanced profile with photos", "Priority in search results", "Customer review management", "Basic analytics dashboard", "Social media integration", "Phone support"],
    popular: true,
    cta: "Start Professional Plan"
  }, {
    name: "Premium",
    price: "$49.99",
    period: "/month",
    description: "For established businesses maximizing their reach",
    features: ["Everything in Professional", "Featured business placement", "Advanced analytics & insights", "Custom promotional campaigns", "Priority customer support", "API access for integrations", "Dedicated account manager"],
    popular: false,
    cta: "Start Premium Plan"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold">Market Connect</span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            {user ? <>
                <span className="text-xs md:text-sm text-muted-foreground hidden lg:block">
                  Welcome, {user?.user_metadata?.full_name || user?.email}!
                </span>
                <Link to="/customer" className="hidden sm:block">
                  <Button variant="outline" size="sm">Customer</Button>
                </Link>
                <Link to="/business" className="hidden sm:block">
                  <Button variant="outline" size="sm">Business</Button>
                </Link>
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline ml-2">Sign Out</span>
                </Button>
              </> : <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <ThemeToggle />
              </>}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Choose the perfect plan for your business. Start connecting with local customers today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            <span>No setup fees</span>
            <span>•</span>
            <Check className="h-4 w-4 text-green-500" />
            <span>Cancel anytime</span>
            <span>•</span>
            <Check className="h-4 w-4 text-green-500" />
            <span>30-day free trial</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto mb-8 md:mb-12 lg:mb-16">
          {plans.map((plan, index) => <Card key={index} className={`relative bg-card-gradient border-border/50 hover:shadow-strong transition-smooth ${plan.popular ? 'border-primary/50 scale-105' : ''}`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-hero-gradient text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>}
              
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>)}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "hero" : "outline"} onClick={() => {
              if (user) {
                // Redirect to business dashboard for subscription setup
                window.location.href = "/business";
              } else {
                // Redirect to auth page
                window.location.href = "/auth";
              }
            }}>
                  {plan.cta}
                  {plan.popular && <Zap className="h-4 w-4 ml-2" />}
                </Button>
              </CardFooter>
            </Card>)}
        </div>

        {/* Features Comparison */}
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold">Why Businesses Choose Market Connect</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Increase Visibility</h3>
              <p className="text-muted-foreground">
                Get discovered by local customers actively searching for businesses like yours.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Engagement</h3>
              <p className="text-muted-foreground">
                Connect with customers instantly through push notifications and location-based alerts.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Build Reputation</h3>
              <p className="text-muted-foreground">
                Showcase your business with photos, reviews, and detailed information that builds trust.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-card-gradient border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of local businesses already growing their customer base with Market Connect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? "/business" : "/auth"}>
                <Button size="lg" variant="hero" className="w-full sm:w-auto">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50 mt-16">
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
export default PricingPage;