import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Star, 
  Phone, 
  Clock, 
  Navigation,
  Coffee,
  ShoppingBag,
  Utensils,
  Smartphone
} from "lucide-react";

export const CustomerView = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for nearby businesses
  const nearbyBusinesses = [
    {
      id: 1,
      name: "Blue Ocean Café",
      category: "Coffee Shop",
      rating: 4.8,
      distance: "0.2 km",
      address: "123 Main Street",
      phone: "+1 (555) 0123",
      hours: "7:00 AM - 9:00 PM",
      offer: "20% off all drinks today!",
      icon: Coffee,
      image: "☕"
    },
    {
      id: 2,
      name: "TechZone Electronics",
      category: "Electronics",
      rating: 4.6,
      distance: "0.4 km",
      address: "456 Tech Avenue",
      phone: "+1 (555) 0456",
      hours: "9:00 AM - 8:00 PM",
      offer: "New iPhone accessories in stock",
      icon: Smartphone,
      image: "📱"
    },
    {
      id: 3,
      name: "Garden Fresh Market",
      category: "Grocery",
      rating: 4.9,
      distance: "0.6 km",
      address: "789 Green Road",
      phone: "+1 (555) 0789",
      hours: "6:00 AM - 10:00 PM",
      offer: "Fresh organic produce daily",
      icon: ShoppingBag,
      image: "🥬"
    },
    {
      id: 4,
      name: "Pasta Paradise",
      category: "Restaurant",
      rating: 4.7,
      distance: "0.8 km",
      address: "321 Food Court",
      phone: "+1 (555) 0321",
      hours: "11:00 AM - 11:00 PM",
      offer: "Happy hour 4-6 PM",
      icon: Utensils,
      image: "🍝"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Discover
            <span className="bg-hero-gradient bg-clip-text text-transparent ml-2">
              Nearby Businesses
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find amazing local stores, cafés, and markets around you. Get notified about special offers and promotions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for businesses, products, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-base shadow-soft"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6 bg-card-gradient border-2 border-primary/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Interactive Map
              </h2>
              
              {/* Mock Map Interface */}
              <div className="bg-muted/50 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
                <div className="text-center z-10">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg font-medium mb-2">Map Integration Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Interactive map with business locations and real-time navigation
                  </p>
                  <Button variant="location" className="mt-4">
                    <Navigation className="h-4 w-4" />
                    Enable Location
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Business List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Nearby Businesses
            </h2>
            
            {nearbyBusinesses.map((business) => {
              const IconComponent = business.icon;
              return (
                <Card key={business.id} className="p-4 hover:shadow-strong transition-smooth group cursor-pointer bg-card-gradient">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {business.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                          {business.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {business.distance}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          <span className="text-sm font-medium">{business.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{business.category}</span>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{business.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{business.hours}</span>
                        </div>
                      </div>

                      {business.offer && (
                        <div className="bg-accent/10 border border-accent/20 rounded-md p-2 mb-3">
                          <p className="text-xs text-accent font-medium">🎉 {business.offer}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-3 w-3" />
                          Call
                        </Button>
                        <Button size="sm" variant="default" className="flex-1">
                          <Navigation className="h-3 w-3" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};