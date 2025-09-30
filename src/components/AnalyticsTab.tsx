import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3,
  Eye,
  Phone,
  Calendar,
  TrendingUp,
  Users
} from "lucide-react";

interface AnalyticsTabProps {
  businessId: string;
}

interface DailyStats {
  date: string;
  views: number;
  calls: number;
}

interface RecentActivity {
  id: string;
  event_type: string;
  created_at: string;
  event_data: any;
}

export const AnalyticsTab = ({ businessId }: AnalyticsTabProps) => {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [businessId]);

  const fetchAnalyticsData = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Fetch daily stats for the last 7 days
      const { data: analyticsData } = await supabase
        .from('business_analytics')
        .select('event_type, created_at')
        .eq('business_id', businessId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      // Process daily stats
      const statsMap = new Map<string, { views: number; calls: number }>();
      
      // Initialize last 7 days with zero values
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        statsMap.set(dateKey, { views: 0, calls: 0 });
      }

      // Count events by day
      analyticsData?.forEach(event => {
        const dateKey = event.created_at.split('T')[0];
        const stats = statsMap.get(dateKey);
        if (stats) {
          if (event.event_type === 'view') {
            stats.views++;
          } else if (event.event_type === 'call') {
            stats.calls++;
          }
        }
      });

      const dailyStatsArray = Array.from(statsMap.entries()).map(([date, stats]) => ({
        date,
        views: stats.views,
        calls: stats.calls
      }));

      setDailyStats(dailyStatsArray);

      // Fetch recent activity
      const { data: recentActivityData } = await supabase
        .from('business_analytics')
        .select('id, event_type, created_at, event_data')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(recentActivityData || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDescription = (event: RecentActivity) => {
    switch (event.event_type) {
      case 'view':
        return 'Customer viewed your business profile';
      case 'call':
        return 'Customer called your business';
      case 'offer_click':
        return `Customer clicked on offer: ${event.event_data?.offer_title || 'Unknown offer'}`;
      case 'profile_view':
        return 'Customer viewed your detailed profile';
      default:
        return `Unknown activity: ${event.event_type}`;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'view':
      case 'profile_view':
        return <Eye className="h-4 w-4 text-primary" />;
      case 'call':
        return <Phone className="h-4 w-4 text-secondary" />;
      case 'offer_click':
        return <TrendingUp className="h-4 w-4 text-accent" />;
      default:
        return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card-gradient">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted/50 rounded w-1/3"></div>
              <div className="h-64 bg-muted/50 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalViews = dailyStats.reduce((sum, day) => sum + day.views, 0);
  const totalCalls = dailyStats.reduce((sum, day) => sum + day.calls, 0);
  const maxViews = Math.max(...dailyStats.map(day => day.views), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views This Week</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls This Week</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">Customer inquiries</p>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity.length}</div>
            <p className="text-xs text-muted-foreground">Recent interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Chart */}
      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Daily Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyStats.map((day, index) => (
              <div key={day.date} className="flex items-center gap-4">
                <div className="w-20 text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-primary" />
                    <div className="flex-1 bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.views / maxViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{day.views}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-secondary" />
                    <div className="flex-1 bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.calls / maxViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{day.calls}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Activity will appear here as customers interact with your business.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="mt-0.5">
                    {getEventIcon(activity.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{formatEventDescription(activity)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};