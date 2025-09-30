import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Store,
  TrendingUp,
  Users,
  Eye,
  Phone,
  DollarSign
} from "lucide-react";

interface AnalyticsCardsProps {
  businessId: string;
}

interface AnalyticsData {
  totalViews: number;
  monthlyViews: number;
  weeklyViews: number;
  totalCalls: number;
  weeklyGrowth: number;
  activeOffers: number;
}

export const AnalyticsCards = ({ businessId }: AnalyticsCardsProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    monthlyViews: 0,
    weeklyViews: 0,
    totalCalls: 0,
    weeklyGrowth: 0,
    activeOffers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [businessId]);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Get total views
      const { data: totalViewsData } = await supabase
        .from('business_analytics')
        .select('id')
        .eq('business_id', businessId)
        .eq('event_type', 'view');

      // Get monthly views
      const { data: monthlyViewsData } = await supabase
        .from('business_analytics')
        .select('id')
        .eq('business_id', businessId)
        .eq('event_type', 'view')
        .gte('created_at', oneMonthAgo.toISOString());

      // Get weekly views
      const { data: weeklyViewsData } = await supabase
        .from('business_analytics')
        .select('id')
        .eq('business_id', businessId)
        .eq('event_type', 'view')
        .gte('created_at', oneWeekAgo.toISOString());

      // Get previous week views for growth calculation
      const { data: previousWeekViewsData } = await supabase
        .from('business_analytics')
        .select('id')
        .eq('business_id', businessId)
        .eq('event_type', 'view')
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', oneWeekAgo.toISOString());

      // Get total calls
      const { data: totalCallsData } = await supabase
        .from('business_analytics')
        .select('id')
        .eq('business_id', businessId)
        .eq('event_type', 'call');

      // Get active offers count
      const { data: activeOffersData } = await supabase
        .from('offers')
        .select('id')
        .eq('business_id', businessId)
        .eq('is_active', true);

      const totalViews = totalViewsData?.length || 0;
      const monthlyViews = monthlyViewsData?.length || 0;
      const weeklyViews = weeklyViewsData?.length || 0;
      const previousWeekViews = previousWeekViewsData?.length || 0;
      const totalCalls = totalCallsData?.length || 0;
      const activeOffers = activeOffersData?.length || 0;

      // Calculate weekly growth percentage
      const weeklyGrowth = previousWeekViews > 0 
        ? ((weeklyViews - previousWeekViews) / previousWeekViews) * 100 
        : weeklyViews > 0 ? 100 : 0;

      setAnalytics({
        totalViews,
        monthlyViews,
        weeklyViews,
        totalCalls,
        weeklyGrowth,
        activeOffers
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card-gradient animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">All time business views</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.monthlyViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Calls</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalCalls.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{analytics.weeklyGrowth > 0 ? '+' : ''}{analytics.weeklyGrowth.toFixed(1)}% this week</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card-gradient">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.activeOffers}</div>
          <p className="text-xs text-muted-foreground">Currently running</p>
        </CardContent>
      </Card>
    </div>
  );
};