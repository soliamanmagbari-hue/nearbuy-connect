import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Settings, 
  BarChart3, 
  Users, 
  Bell,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Upload
} from "lucide-react";

export const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'offers' | 'analytics'>('overview');

  // Mock business data
  const businessStats = {
    totalViews: 2847,
    monthlyViews: 486,
    customerEngagement: 73,
    activeOffers: 3,
    rating: 4.6,
    reviews: 127
  };

  const recentActivities = [
    { action: "New customer viewed your profile", time: "2 minutes ago", type: "view" },
    { action: "Offer 'Summer Sale' was clicked 15 times", time: "1 hour ago", type: "offer" },
    { action: "Customer left a 5-star review", time: "3 hours ago", type: "review" },
    { action: "Profile was updated successfully", time: "1 day ago", type: "update" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                Business
                <span className="bg-hero-gradient bg-clip-text text-transparent ml-2">
                  Dashboard
                </span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your store presence and track customer engagement
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="location">
                <Plus className="h-4 w-4" />
                Add Offer
              </Button>
              <Button variant="hero">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-border/50">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'profile', label: 'Store Profile', icon: Store },
              { id: 'offers', label: 'Offers & Promotions', icon: Bell },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className="gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-card-gradient border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold text-primary">{businessStats.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6 bg-card-gradient border-2 border-secondary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-secondary">+{businessStats.monthlyViews}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
              </Card>

              <Card className="p-6 bg-card-gradient border-2 border-accent/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold text-accent">{businessStats.customerEngagement}%</p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </Card>

              <Card className="p-6 bg-card-gradient">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">{businessStats.rating}</p>
                      <Star className="h-5 w-5 fill-accent text-accent" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{businessStats.reviews} reviews</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6 bg-card-gradient">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'view' ? 'bg-primary' :
                      activity.type === 'offer' ? 'bg-accent' :
                      activity.type === 'review' ? 'bg-secondary' : 'bg-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Store Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="p-6 bg-card-gradient">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Store Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Name</label>
                    <Input placeholder="Enter your business name" defaultValue="Blue Ocean Café" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Input placeholder="e.g., Coffee Shop, Restaurant, Store" defaultValue="Coffee Shop" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number</label>
                    <Input placeholder="+1 (555) 0123" defaultValue="+1 (555) 0123" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Address</label>
                    <Input placeholder="123 Main Street, City, State" defaultValue="123 Main Street" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Hours</label>
                    <Input placeholder="e.g., 9:00 AM - 5:00 PM" defaultValue="7:00 AM - 9:00 PM" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea 
                      placeholder="Describe your business..."
                      className="min-h-24"
                      defaultValue="Cozy café serving premium coffee and fresh pastries in the heart of downtown."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Profile Image</label>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button variant="hero">
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <Card className="p-6 bg-card-gradient">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" />
                  Active Promotions
                </h3>
                <Button variant="location">
                  <Plus className="h-4 w-4" />
                  Create New Offer
                </Button>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "20% Off All Drinks", status: "Active", expires: "In 5 days", views: 156 },
                  { title: "Buy 2 Get 1 Free Pastries", status: "Active", expires: "In 12 days", views: 89 },
                  { title: "Happy Hour Special", status: "Scheduled", expires: "Starts tomorrow", views: 0 }
                ].map((offer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <h4 className="font-medium">{offer.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant={offer.status === 'Active' ? 'default' : 'secondary'}>
                          {offer.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{offer.expires}</span>
                        <span className="text-sm text-muted-foreground">• {offer.views} views</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card className="p-6 bg-card-gradient">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Analytics
              </h3>
              <div className="bg-muted/50 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">Analytics Dashboard</h4>
                  <p className="text-muted-foreground">
                    Detailed analytics and insights coming soon
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};