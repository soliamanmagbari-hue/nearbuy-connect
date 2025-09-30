import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Tag, 
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const offerSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().trim().max(500, "Description too long").optional(),
  discount_type: z.enum(["percentage", "amount"]),
  discount_percentage: z.number().min(1).max(100).optional(),
  discount_amount: z.number().min(0.01).optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  discount_amount: number | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

interface OffersManagementProps {
  businessId?: string;
}

export const OffersManagement = ({ businessId }: OffersManagementProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      discount_type: "percentage",
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (businessId) {
      fetchOffers();
    }
  }, [businessId]);

  const fetchOffers = async () => {
    if (!businessId) return;

    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Error loading offers");
        console.error(error);
      } else {
        setOffers(data || []);
      }
    } catch (error) {
      toast.error("Error loading offers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: OfferFormData) => {
    if (!businessId) {
      toast.error("Business ID is required");
      return;
    }

    setSaving(true);
    try {
      const offerData = {
        business_id: businessId,
        title: data.title,
        description: data.description || null,
        discount_percentage: data.discount_type === 'percentage' ? data.discount_percentage : null,
        discount_amount: data.discount_type === 'amount' ? data.discount_amount : null,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
        is_active: true,
      };

      let result;
      if (editingOffer) {
        result = await supabase
          .from('offers')
          .update(offerData)
          .eq('id', editingOffer.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('offers')
          .insert([offerData])
          .select()
          .single();
      }

      if (result.error) {
        toast.error("Error saving offer");
        console.error(result.error);
      } else {
        toast.success(editingOffer ? "Offer updated successfully!" : "Offer created successfully!");
        setIsDialogOpen(false);
        setEditingOffer(null);
        form.reset();
        fetchOffers();
      }
    } catch (error) {
      toast.error("Error saving offer");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    form.reset({
      title: offer.title,
      description: offer.description || "",
      discount_type: offer.discount_percentage ? "percentage" : "amount",
      discount_percentage: offer.discount_percentage || undefined,
      discount_amount: offer.discount_amount || undefined,
      start_date: offer.start_date.split('T')[0],
      end_date: offer.end_date ? offer.end_date.split('T')[0] : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) {
        toast.error("Error deleting offer");
        console.error(error);
      } else {
        toast.success("Offer deleted successfully!");
        fetchOffers();
      }
    } catch (error) {
      toast.error("Error deleting offer");
      console.error(error);
    }
  };

  const toggleOfferStatus = async (offer: Offer) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: !offer.is_active })
        .eq('id', offer.id);

      if (error) {
        toast.error("Error updating offer status");
        console.error(error);
      } else {
        toast.success(`Offer ${!offer.is_active ? 'activated' : 'deactivated'} successfully!`);
        fetchOffers();
      }
    } catch (error) {
      toast.error("Error updating offer status");
      console.error(error);
    }
  };

  const formatDiscount = (offer: Offer) => {
    if (offer.discount_percentage) {
      return `${offer.discount_percentage}% OFF`;
    } else if (offer.discount_amount) {
      return `$${offer.discount_amount} OFF`;
    }
    return "Special Offer";
  };

  const isOfferActive = (offer: Offer) => {
    if (!offer.is_active) return false;
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = offer.end_date ? new Date(offer.end_date) : null;
    
    return now >= startDate && (!endDate || now <= endDate);
  };

  const getOfferStatus = (offer: Offer) => {
    if (!offer.is_active) return { status: "Inactive", variant: "secondary" as const };
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = offer.end_date ? new Date(offer.end_date) : null;
    
    if (now < startDate) return { status: "Scheduled", variant: "outline" as const };
    if (endDate && now > endDate) return { status: "Expired", variant: "destructive" as const };
    return { status: "Active", variant: "default" as const };
  };

  if (!businessId) {
    return (
      <Card className="bg-card-gradient">
        <CardContent className="text-center py-8">
          <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Business Profile Required</h3>
          <p className="text-muted-foreground">
            Please complete your business profile first to create offers
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {offers.filter(offer => isOfferActive(offer)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {offers.filter(offer => !isOfferActive(offer) && offer.is_active).length} scheduled
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{offers.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {offers.length > 0 
                ? Math.round(offers.reduce((acc, offer) => acc + (offer.discount_percentage || 0), 0) / offers.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average discount</p>
          </CardContent>
        </Card>
      </div>

      {/* Offers Management */}
      <Card className="bg-card-gradient">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Offers & Promotions</CardTitle>
              <CardDescription>
                Create and manage special offers to attract more customers
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingOffer(null);
                  form.reset({
                    title: "",
                    description: "",
                    discount_type: "percentage",
                    start_date: new Date().toISOString().split('T')[0],
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingOffer 
                      ? 'Update your promotional offer details'
                      : 'Create a new promotional offer to attract customers'
                    }
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Offer Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 20% Off All Items" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the offer details..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage Off</SelectItem>
                              <SelectItem value="amount">Fixed Amount Off</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("discount_type") === "percentage" && (
                      <FormField
                        control={form.control}
                        name="discount_percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Percentage</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 20"
                                min="1"
                                max="100"
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch("discount_type") === "amount" && (
                      <FormField
                        control={form.control}
                        name="discount_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Amount ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 10.00"
                                min="0.01"
                                step="0.01"
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value) || undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : editingOffer ? "Update Offer" : "Create Offer"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No offers yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first offer to start attracting customers
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => {
                const { status, variant } = getOfferStatus(offer);
                return (
                  <div key={offer.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{offer.title}</h4>
                        <Badge variant={variant}>{status}</Badge>
                        <span className="text-sm font-medium text-accent">
                          {formatDiscount(offer)}
                        </span>
                      </div>
                      {offer.description && (
                        <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Starts: {new Date(offer.start_date).toLocaleDateString()}
                        </span>
                        {offer.end_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Ends: {new Date(offer.end_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleOfferStatus(offer)}
                      >
                        {offer.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(offer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(offer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};