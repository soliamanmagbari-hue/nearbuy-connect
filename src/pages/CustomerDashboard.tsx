import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Search, Star, Phone, Clock, Navigation, LogOut, Coffee, ShoppingBag, Utensils, Smartphone } from "lucide-react";
import { toast } from "sonner";
interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string | null;
  description: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  hours_monday: string | null;
  hours_tuesday: string | null;
  hours_wednesday: string | null;
  hours_thursday: string | null;
  hours_friday: string | null;
  hours_saturday: string | null;
  hours_sunday: string | null;
  subscription_status: string;
}
const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const {
    user,
    signOut
  } = useAuth();
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'coffee':
      case 'cafe':
        return Coffee;
      case 'restaurant':
      case 'food':
        return Utensils;
      case 'retail':
      case 'shopping':
        return ShoppingBag;
      case 'electronics':
        return Smartphone;
      default:
        return ShoppingBag;
    }
  };
  const getRandomEmoji = (category: string) => {
    const emojiMap: {
      [key: string]: string[];
    } = {
      'coffee': ['☕', '🫖', '🥐'],
      'cafe': ['☕', '🧁', '🍰'],
      'restaurant': ['🍽️', '🍕', '🍝', '🥗'],
      'food': ['🍎', '🥖', '🍇'],
      'retail': ['👕', '👗', '👠'],
      'shopping': ['🛍️', '🎁', '👜'],
      'electronics': ['📱', '💻', '🎧']
    };
    const emojis = emojiMap[category.toLowerCase()] || ['🏪', '🏬', '🏢'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };
  useEffect(() => {
    fetchBusinesses();
  }, []);
  const fetchBusinesses = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('businesses').select('*').eq('subscription_status', 'active');
      if (error) {
        toast.error("Error loading businesses");
        console.error(error);
      } else {
        setBusinesses(data || []);
      }
    } catch (error) {
      toast.error("Error loading businesses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const filteredBusinesses = businesses.filter(business => business.name.toLowerCase().includes(searchQuery.toLowerCase()) || business.category.toLowerCase().includes(searchQuery.toLowerCase()) || business.address.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleCall = (phone: string | null) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    } else {
      toast.error("Phone number not available");
    }
  };
  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationPermission('granted');
        toast.success("Location enabled! Distances updated.");
      },
      (error) => {
        setLocationPermission('denied');
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location access denied. Please enable location in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("An unknown error occurred while retrieving location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceText = (business: Business): string => {
    if (!userLocation || !business.latitude || !business.longitude) {
      return "Location needed";
    }
    const distance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      business.latitude, 
      business.longitude
    );
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Market Connect</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.user_metadata?.full_name || user?.email}!
            </span>
            <Link to="/business">
              <Button variant="outline">Business Dashboard</Button>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Discover
            
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find amazing local stores, cafés, and markets around you. Get notified about special offers and promotions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for businesses, products, or services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 h-12 text-base shadow-soft" />
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
                  <h3 className="text-lg font-medium mb-2">Real Map Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Interactive map with business locations and real-time navigation
                  </p>
                  <Button 
                    variant="location" 
                    className="mt-4" 
                    onClick={requestLocation}
                    disabled={locationPermission === 'granted'}
                  >
                    <Navigation className="h-4 w-4" />
                    {locationPermission === 'granted' ? 'Location Enabled' : 'Enable Location'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Business List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              {filteredBusinesses.length > 0 ? "Nearby Businesses" : "No Businesses Found"}
            </h2>
            
            {filteredBusinesses.length === 0 ? <Card className="p-6 text-center bg-card-gradient">
                <p className="text-muted-foreground">
                  {searchQuery ? "No businesses match your search criteria. Try a different search term." : "No active businesses found. Check back later for new listings!"}
                </p>
              </Card> : filteredBusinesses.map(business => {
            const IconComponent = getCategoryIcon(business.category);
            const emoji = getRandomEmoji(business.category);
            return <Card key={business.id} className="p-4 hover:shadow-strong transition-smooth group cursor-pointer bg-card-gradient">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl group-hover:scale-110 transition-transform">
                        {business.image_url ? <img src={business.image_url} alt={business.name} className="w-10 h-10 rounded-lg object-cover" /> : <span>{emoji}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                            {business.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {getDistanceText(business)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="text-sm font-medium">4.8</span>
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
                            <span>
                              {business.hours_monday || "Hours not specified"}
                            </span>
                          </div>
                        </div>

                        {business.description && <div className="bg-accent/10 border border-accent/20 rounded-md p-2 mb-3">
                            <p className="text-xs text-accent font-medium">🎉 {business.description}</p>
                          </div>}

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleCall(business.phone)}>
                            <Phone className="h-3 w-3" />
                            Call
                          </Button>
                          <Button size="sm" variant="default" className="flex-1" onClick={() => handleDirections(business.address)}>
                            <Navigation className="h-3 w-3" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>;
          })}
          </div>
        </div>
      </div>
    </div>;
};
export default CustomerDashboard;