import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, LogOut, Store, TrendingUp, Users, DollarSign, BarChart3, Settings, Tag, Clock, Phone, Mail, Globe, Save } from "lucide-react";
import { OffersManagement } from "@/components/OffersManagement";
import { AnalyticsCards } from "@/components/AnalyticsCards";
import { AnalyticsTab } from "@/components/AnalyticsTab";
import { PaymentModal } from "@/components/PaymentModal";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
const businessSchema = z.object({
  name: z.string().trim().min(2, "Business name must be at least 2 characters").max(100, "Name too long"),
  description: z.string().trim().max(500, "Description too long").optional(),
  category: z.string().min(1, "Please select a category"),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(200, "Address too long"),
  phone: z.string().trim().max(20, "Phone number too long").optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long").optional().or(z.literal("")),
  website: z.string().trim().url("Invalid website URL").max(255, "Website URL too long").optional().or(z.literal("")),
  hours_monday: z.string().trim().max(50, "Hours too long").optional().or(z.literal("")),
  hours_tuesday: z.string().trim().max(50, "Hours too long").optional().or(z.literal("")),
  hours_wednesday: z.string().trim().max(50, "Hours too long").optional().or(z.literal("")),
  hours_thursday: z.string().trim().max(50, "Hours too long").optional().or(z.literal("")),
  hours_friday: z.string().trim().max(50, "Hours too long").optional().or(z.literal("")),
  hours_saturday: z.string().trim().max(50, "Hours too long").optional().or(z.literal("")),
  hours_sunday: z.string().trim().max(50, "Hours too long").optional().or(z.literal(""))
});
type BusinessFormData = z.infer<typeof businessSchema>;
interface Business {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  hours_monday: string | null;
  hours_tuesday: string | null;
  hours_wednesday: string | null;
  hours_thursday: string | null;
  hours_friday: string | null;
  hours_saturday: string | null;
  hours_sunday: string | null;
  subscription_status: string;
  subscription_plan: string;
}
const BusinessDashboard = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      hours_monday: "",
      hours_tuesday: "",
      hours_wednesday: "",
      hours_thursday: "",
      hours_friday: "",
      hours_saturday: "",
      hours_sunday: ""
    }
  });
  const categories = ["Restaurant", "Cafe", "Retail", "Electronics", "Grocery", "Health & Beauty", "Services", "Fashion", "Automotive", "Other"];
  useEffect(() => {
    fetchBusiness();
  }, [user]);
  const fetchBusiness = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('businesses').select('*').eq('user_id', user.id).maybeSingle();
      if (error && error.code !== 'PGRST116') {
        toast.error("Error loading business data");
        console.error(error);
      } else if (data) {
        setBusiness(data);
        // Populate form with existing data
        form.reset({
          name: data.name || "",
          description: data.description || "",
          category: data.category || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          hours_monday: data.hours_monday || "",
          hours_tuesday: data.hours_tuesday || "",
          hours_wednesday: data.hours_wednesday || "",
          hours_thursday: data.hours_thursday || "",
          hours_friday: data.hours_friday || "",
          hours_saturday: data.hours_saturday || "",
          hours_sunday: data.hours_sunday || ""
        });
      }
    } catch (error) {
      toast.error("Error loading business data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data: BusinessFormData) => {
    if (!user) return;
    setSaving(true);
    try {
      const businessData = {
        user_id: user.id,
        name: data.name,
        description: data.description || null,
        category: data.category,
        address: data.address,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        hours_monday: data.hours_monday || null,
        hours_tuesday: data.hours_tuesday || null,
        hours_wednesday: data.hours_wednesday || null,
        hours_thursday: data.hours_thursday || null,
        hours_friday: data.hours_friday || null,
        hours_saturday: data.hours_saturday || null,
        hours_sunday: data.hours_sunday || null
      };
      let result;
      if (business) {
        // Update existing business
        result = await supabase.from('businesses').update(businessData).eq('id', business.id).select().single();
      } else {
        // Show payment modal for new business
        setShowPaymentModal(true);
        setSaving(false);
        return;
      }
      if (result.error) {
        toast.error("Error saving business information");
        console.error(result.error);
      } else {
        setBusiness(result.data);
        toast.success("Business information saved successfully!");
      }
    } catch (error) {
      toast.error("Error saving business information");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  const handlePaymentSuccess = async () => {
    if (!user) return;
    const formData = form.getValues();
    const businessData = {
      user_id: user.id,
      name: formData.name,
      description: formData.description || null,
      category: formData.category,
      address: formData.address,
      phone: formData.phone || null,
      email: formData.email || null,
      website: formData.website || null,
      hours_monday: formData.hours_monday || null,
      hours_tuesday: formData.hours_tuesday || null,
      hours_wednesday: formData.hours_wednesday || null,
      hours_thursday: formData.hours_thursday || null,
      hours_friday: formData.hours_friday || null,
      hours_saturday: formData.hours_saturday || null,
      hours_sunday: formData.hours_sunday || null,
      subscription_status: 'active',
      subscription_plan: 'business'
    };
    try {
      const result = await supabase.from('businesses').insert([businessData]).select().single();
      if (result.error) {
        toast.error("Error creating business profile");
        console.error(result.error);
      } else {
        setBusiness(result.data);
        toast.success("Business profile created successfully!");
      }
    } catch (error) {
      toast.error("Error creating business profile");
      console.error(error);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl font-bold">Market Connect</span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs md:text-sm text-muted-foreground hidden md:block">
              Welcome, {user?.user_metadata?.full_name || user?.email}!
            </span>
            <Link to="/customer" className="hidden sm:block">
              <Button variant="outline" size="sm">Customer</Button>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
            Business Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your business profile, track performance, and grow your customer base.
          </p>
        </div>

        {/* Business Profile Required Check */}
        {!business ? <Card className="bg-destructive/10 border-destructive/20 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <div>
                  <h3 className="font-semibold text-destructive">Business Profile Required</h3>
                  <p className="text-sm text-muted-foreground">Please complete your business profile in the Business Profile tab to access all features.</p>
                </div>
              </div>
            </CardContent>
          </Card> : (/* Stats Cards */
      <AnalyticsCards businessId={business.id} />)}

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 gap-1">
            <TabsTrigger value="profile" className="text-xs md:text-sm flex-col md:flex-row gap-1 md:gap-2 py-2">
              <Settings className="h-4 w-4 md:h-4 md:w-4" />
              <span className="text-[10px] md:text-sm">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-xs md:text-sm flex-col md:flex-row gap-1 md:gap-2 py-2">
              <Tag className="h-4 w-4 md:h-4 md:w-4" />
              <span className="text-[10px] md:text-sm">Offers</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm flex-col md:flex-row gap-1 md:gap-2 py-2">
              <BarChart3 className="h-4 w-4 md:h-4 md:w-4" />
              <span className="text-[10px] md:text-sm">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="text-xs md:text-sm flex-col md:flex-row gap-1 md:gap-2 py-2">
              <DollarSign className="h-4 w-4 md:h-4 md:w-4" />
              <span className="text-[10px] md:text-sm">Plan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-card-gradient">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Update your business details to help customers find and connect with you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Business Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="category" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map(category => <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>} />
                    </div>

                    <FormField control={form.control} name="description" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your business, services, or special offers..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <FormField control={form.control} name="address" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street, City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField control={form.control} name="phone" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="email" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@business.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="website" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://yourbusiness.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Business Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => <FormField key={day} control={form.control} name={`hours_${day}` as keyof BusinessFormData} render={({
                        field
                      }) => <FormItem>
                                <FormLabel className="capitalize">{day}</FormLabel>
                                <FormControl>
                                  <Input placeholder="9:00 AM - 5:00 PM" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />)}
                      </div>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full md:w-auto">
                      {saving ? "Saving..." : "Save Business Profile"}
                      <Save className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers">
            {!business ? <Card className="bg-card-gradient">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Business Profile Required</h4>
                    <p className="text-muted-foreground">
                      Please complete your business profile first to manage offers.
                    </p>
                  </div>
                </CardContent>
              </Card> : <OffersManagement businessId={business.id} />}
          </TabsContent>

          <TabsContent value="analytics">
            {!business ? <Card className="bg-card-gradient">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Business Profile Required</h4>
                    <p className="text-muted-foreground">
                      Please complete your business profile first to view analytics.
                    </p>
                  </div>
                </CardContent>
              </Card> : <AnalyticsTab businessId={business.id} />}
          </TabsContent>

          <TabsContent value="subscription">
            <Card className="bg-card-gradient">
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  Manage your Market Connect subscription and billing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {business?.subscription_status === 'active' ? <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-medium text-green-900 dark:text-green-100">
                      ✅ Your subscription is active
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Plan: {business.subscription_plan} • Your business is visible to customers
                    </p>
                  </div> : <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h3 className="font-medium text-yellow-900 dark:text-yellow-100">
                      ⚠️ Subscription Required
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Activate your subscription to make your business visible to customers
                    </p>
                    <Button className="mt-3" onClick={() => setShowPaymentModal(true)} variant="hero">
                      Pay $49 to Activate
                    </Button>
                  </div>}
                
                <div className="pt-4">
                  <Link to="/pricing">
                    <Button variant="outline">
                      View Pricing Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Modal */}
        <PaymentModal open={showPaymentModal} onOpenChange={setShowPaymentModal} onPaymentSuccess={handlePaymentSuccess} />
      </div>
    </div>;
};
export default BusinessDashboard;