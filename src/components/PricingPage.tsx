import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Zap, 
  Crown,
  MapPin,
  TrendingUp,
  Users,
  Bell
} from "lucide-react";

interface PricingPageProps {
  onModeChange: (mode: 'business') => void;
}

export const PricingPage = ({ onModeChange }: PricingPageProps) => {
  const plans = [
    {
      name: "Basic",
      price: 29,
      description: "Perfect for small local businesses",
      icon: MapPin,
      gradient: "from-primary/20 to-primary/5",
      border: "border-primary/30",
      features: [
        "Store profile on the map",
        "Basic business information",
        "Customer contact details",
        "5 promotional offers per month",
        "Basic analytics dashboard",
        "Email support"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: 59,
      description: "Great for growing businesses",
      icon: TrendingUp,
      gradient: "from-secondary/20 to-secondary/5",
      border: "border-secondary/30",
      features: [
        "Everything in Basic",
        "Priority map placement",
        "Unlimited promotional offers",
        "Advanced analytics & insights",
        "Customer engagement tracking",
        "Social media integration",
        "Priority support"
      ],
      recommended: true
    },
    {
      name: "Premium",
      price: 99,
      description: "For established businesses",
      icon: Crown,
      gradient: "from-accent/20 to-accent/5",
      border: "border-accent/30",
      features: [
        "Everything in Professional",
        "Featured business badge",
        "Custom promotional campaigns",
        "Detailed customer demographics",
        "A/B testing for offers",
        "API access for integrations",
        "Dedicated account manager",
        "24/7 phone support"
      ],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Simple
            <span className="bg-hero-gradient bg-clip-text text-transparent ml-2">
              Pricing Plans
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. All plans include access to our platform 
            and the ability to connect with local customers in your area.
          </p>
          
          {/* Free for Customers Banner */}
          <div className="inline-flex items-center gap-3 bg-secondary/10 border border-secondary/30 rounded-full px-6 py-3">
            <Users className="h-5 w-5 text-secondary" />
            <span className="text-secondary font-medium">Always free for customers</span>
            <Badge variant="secondary">100% Free</Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative p-8 bg-gradient-to-br ${plan.gradient} border-2 ${plan.border} hover:shadow-strong transition-smooth ${
                  plan.recommended ? 'scale-105 shadow-strong' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground px-4 py-2">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    plan.name === 'Basic' ? 'bg-primary/10' :
                    plan.name === 'Professional' ? 'bg-secondary/10' : 'bg-accent/10'
                  }`}>
                    <IconComponent className={`h-8 w-8 ${
                      plan.name === 'Basic' ? 'text-primary' :
                      plan.name === 'Professional' ? 'text-secondary' : 'text-accent'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 mt-0.5 ${
                        plan.name === 'Basic' ? 'text-primary' :
                        plan.name === 'Professional' ? 'text-secondary' : 'text-accent'
                      }`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.recommended ? 'hero' : plan.name === 'Basic' ? 'default' : plan.name === 'Premium' ? 'location' : 'secondary'}
                  className="w-full"
                  size="lg"
                  onClick={() => onModeChange('business')}
                >
                  {plan.recommended ? 'Start Free Trial' : 'Get Started'}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose Market Connect?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Location-Based Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Customers find you automatically when they're nearby
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                <Bell className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold">Smart Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Push notifications when customers are near your store
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Business Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track customer engagement and optimize your presence
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-8 bg-card-gradient border-2 border-primary/20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Connect with Local Customers?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of local businesses already using Market Connect to grow their customer base.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => onModeChange('business')}>
                <Zap className="h-5 w-5" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};