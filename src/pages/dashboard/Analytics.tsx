import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail, 
  Bot,
  Eye,
  MousePointer,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  Activity,
  Loader2
} from "lucide-react";
import { getCurrentUser, getAnalyticsData, logAnalyticsEvent } from "@/lib/supabase";

interface AnalyticsData {
  overviewStats: {
    title: string;
    value: string;
    change: string;
    changeType: "increase" | "decrease";
    icon: any;
    period: string;
    trend: number[];
  }[];
  websiteAnalytics: {
    website: string;
    views: string;
    visitors: string;
    bounceRate: string;
    avgTime: string;
    status: "live" | "draft" | "paused";
    realTimeViews: number;
    conversionRate: string;
    revenue: string;
  }[];
  topPages: {
    page: string;
    views: string;
    title: string;
    change: string;
    trend: "up" | "down" | "stable";
  }[];
  liveEvents: {
    id: string;
    type: "view" | "conversion" | "email_open" | "chat_session";
    message: string;
    time: string;
    value: string;
  }[];
  marketingMetrics: {
    emailOpenRate: number;
    emailClickRate: number;
    conversionRate: number;
    influencerReach: number;
    activePartnerships: number;
  };
  engagementMetrics: {
    chatbotSessions: number;
    avgSessionLength: string;
    messagesPerSession: number;
    satisfactionRate: number;
    bounceRate: number;
    pagesPerSession: number;
    sessionDuration: string;
    returnVisitors: number;
    monthlyGrowth: number;
    newUsers: number;
    engagementRate: number;
    conversionRate: number;
  };
}

export default function Analytics() {
  const [isLive, setIsLive] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const liveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [data, setData] = useState<AnalyticsData>({
    overviewStats: [],
    websiteAnalytics: [],
    topPages: [],
    liveEvents: [],
    marketingMetrics: {
      emailOpenRate: 0,
      emailClickRate: 0,
      conversionRate: 0,
      influencerReach: 0,
      activePartnerships: 0
    },
    engagementMetrics: {
      chatbotSessions: 0,
      avgSessionLength: "0m 0s",
      messagesPerSession: 0,
      satisfactionRate: 0,
      bounceRate: 0,
      pagesPerSession: 0,
      sessionDuration: "0m 0s",
      returnVisitors: 0,
      monthlyGrowth: 0,
      newUsers: 0,
      engagementRate: 0,
      conversionRate: 0
    }
  });

  // Get current user and fetch data
  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        setIsLoading(true);
        const { user, error } = await getCurrentUser();
        
        if (error || !user) {
          console.error('Error getting current user:', error);
          return;
        }

        setCurrentUser(user);
        await fetchAnalyticsData(user.id, selectedPeriod);
      } catch (error) {
        console.error('Error fetching user and data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  // Fetch analytics data when period changes
  useEffect(() => {
    if (currentUser) {
      fetchAnalyticsData(currentUser.id, selectedPeriod);
    }
  }, [selectedPeriod, currentUser]);

  const fetchAnalyticsData = async (userId: string, period: string) => {
    try {
      const { data: analyticsData, error } = await getAnalyticsData(userId, period);
      
      if (error) {
        console.error('Error fetching analytics data:', error);
        return;
      }

      if (!analyticsData) return;

      const { websites, analytics, emailCampaigns } = analyticsData;

      // Calculate overview stats from real data
      const totalViews = analytics.filter(e => e.event_type === 'page_view').length;
      const uniqueVisitors = new Set(analytics.filter(e => e.event_type === 'page_view').map(e => e.session_id)).size;
      const emailOpens = analytics.filter(e => e.event_type === 'email_open').length;
      const botInteractions = analytics.filter(e => e.event_type === 'chat_session').length;

      // Calculate website analytics from real data
      const websiteAnalytics = websites.map(website => {
        const websiteAnalytics = analytics.filter(e => e.website_id === website.id);
        const views = websiteAnalytics.filter(e => e.event_type === 'page_view').length;
        const uniqueVisitors = new Set(websiteAnalytics.filter(e => e.event_type === 'page_view').map(e => e.session_id)).size;
        
        return {
          website: website.title || website.business_name || 'Untitled Website',
          views: views.toString(),
          visitors: uniqueVisitors.toString(),
          bounceRate: "34%", // Mock for now
          avgTime: "2m 45s", // Mock for now
          status: website.is_published ? "live" : "draft" as "live" | "draft" | "paused",
          realTimeViews: 0,
          conversionRate: "4.2%", // Mock for now
          revenue: "$0" // Mock for now
        };
      });

      // Calculate top pages from analytics
      const pageViews = analytics.filter(e => e.event_type === 'page_view');
      const pageCounts = pageViews.reduce((acc, event) => {
        const page = event.page_url || '/';
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topPages = Object.entries(pageCounts)
        .sort(([,a], [,b]) => Number(b) - Number(a))
        .slice(0, 5)
        .map(([page, views]) => ({
          page,
          views: views.toString(),
          title: page === '/' ? 'Homepage' : page.split('/').pop() || 'Page',
          change: "+12%", // Mock for now
          trend: "up" as "up" | "down" | "stable"
        }));

      // Calculate marketing metrics from email campaigns
      const totalEmails = emailCampaigns.length;
      const totalOpens = emailCampaigns.reduce((sum, campaign) => sum + (campaign.open_count || 0), 0);
      const totalClicks = emailCampaigns.reduce((sum, campaign) => sum + (campaign.click_count || 0), 0);
      const emailOpenRate = totalEmails > 0 ? (totalOpens / totalEmails) * 100 : 0;
      const emailClickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;

      // Calculate engagement metrics
      const chatSessions = analytics.filter(e => e.event_type === 'chat_session').length;
      const totalSessions = new Set(analytics.map(e => e.session_id)).size;
      const avgSessionLength = totalSessions > 0 ? "3m 24s" : "0m 0s"; // Mock for now

      setData({
        overviewStats: [
    {
      title: "Total Views",
            value: totalViews.toString(),
      change: "+15.3%",
      changeType: "increase",
      icon: Eye,
            period: "vs last month",
            trend: [1200, 1350, 1420, 1380, 1560, 1620, 1580, 1720, 1840, 1920, 2010, 2180]
    },
    {
      title: "Unique Visitors",
            value: uniqueVisitors.toString(),
      change: "+8.7%", 
      changeType: "increase",
      icon: Users,
            period: "vs last month",
            trend: [800, 850, 920, 880, 950, 1020, 980, 1050, 1120, 1180, 1240, 1320]
    },
    {
      title: "Email Opens",
            value: emailOpens.toString(),
      change: "+23.1%",
      changeType: "increase",
      icon: Mail,
            period: "vs last month",
            trend: [300, 320, 350, 380, 420, 450, 480, 520, 560, 600, 640, 680]
    },
    {
      title: "Bot Interactions",
            value: botInteractions.toString(),
      change: "-2.4%",
      changeType: "decrease",
      icon: Bot,
            period: "vs last month",
            trend: [200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420]
          }
        ],
        websiteAnalytics,
        topPages,
        liveEvents: [],
        marketingMetrics: {
          emailOpenRate,
          emailClickRate,
          conversionRate: 2.3,
          influencerReach: 12500,
          activePartnerships: 3
        },
        engagementMetrics: {
          chatbotSessions: chatSessions,
          avgSessionLength,
          messagesPerSession: 5,
          satisfactionRate: 85,
          bounceRate: 34,
          pagesPerSession: 2.5,
          sessionDuration: "3m 24s",
          returnVisitors: Math.floor(uniqueVisitors * 0.3),
          monthlyGrowth: 15,
          newUsers: uniqueVisitors,
          engagementRate: 65,
          conversionRate: 2.3
        }
      });
    } catch (error) {
      console.error('Error processing analytics data:', error);
    }
  };

  // Real-time clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Live data simulation
  useEffect(() => {
    if (!isLive) {
      if (liveIntervalRef.current) {
        clearInterval(liveIntervalRef.current);
        liveIntervalRef.current = null;
      }
      return;
    }

    liveIntervalRef.current = setInterval(() => {
      setData(prevData => {
        // Simulate real-time view updates
        const updatedWebsiteAnalytics = prevData.websiteAnalytics.map(site => ({
          ...site,
          realTimeViews: site.status === "live" ? 
            site.realTimeViews + Math.floor(Math.random() * 3) : site.realTimeViews
        }));

        // Simulate live events
        const eventTypes = ["view", "conversion", "email_open", "chat_session"];
        const newEvent = {
          id: Date.now().toString(),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)] as any,
          message: generateEventMessage(),
          time: new Date().toLocaleTimeString(),
          value: generateEventValue()
        };

        const updatedLiveEvents = [newEvent, ...prevData.liveEvents.slice(0, 9)];

        // Update overview stats with small random changes
        const updatedOverviewStats = prevData.overviewStats.map(stat => ({
          ...stat,
          value: updateStatValue(stat.value, stat.changeType)
        }));

        return {
          ...prevData,
          websiteAnalytics: updatedWebsiteAnalytics,
          liveEvents: updatedLiveEvents,
          overviewStats: updatedOverviewStats
        };
      });
    }, 3000);

    return () => {
      if (liveIntervalRef.current) {
        clearInterval(liveIntervalRef.current);
      }
    };
  }, [isLive]);

  const generateEventMessage = () => {
    const messages = [
      "New visitor on website",
      "Email opened: Campaign",
      "Chat session started with AI assistant",
      "Conversion: Page to checkout",
      "Return visitor on website",
      "Email campaign: Open rate achieved",
      "Influencer post generated reach",
      "New lead captured from form",
      "Page viewed for 3+ minutes",
      "Mobile user engaged with chatbot"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const generateEventValue = () => {
    const values = ["+1 view", "+$45 revenue", "+1 email open", "+1 chat session", "+1 conversion"];
    return values[Math.floor(Math.random() * values.length)];
  };

  const updateStatValue = (currentValue: string, changeType: "increase" | "decrease") => {
    const numericValue = parseInt(currentValue.replace(/,/g, ""));
    const change = Math.floor(Math.random() * 5) + 1;
    const newValue = changeType === "increase" ? numericValue + change : numericValue - change;
    return newValue.toLocaleString();
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track performance across all your websites and marketing campaigns.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          <Button 
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2"
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isLive ? "Live" : "Paused"}</span>
          </Button>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>



      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.overviewStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-soft hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-sm">
                {stat.changeType === "increase" ? (
                  <ArrowUpRight className="w-3 h-3 text-success mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-destructive mr-1" />
                )}
                <span className={stat.changeType === "increase" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">{stat.period}</span>
              </div>
              {/* Mini trend chart */}
              <div className="flex items-center space-x-1 mt-2">
                {stat.trend.slice(-6).map((value, i) => (
                  <div
                    key={i}
                    className="w-1 bg-muted-foreground/20 rounded-full"
                    style={{ height: `${(value / Math.max(...stat.trend)) * 20}px` }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="marketing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marketing">Marketing Performance</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
        </TabsList>



        {/* Marketing Performance */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Campaigns
                  {isLive && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{data.marketingMetrics.emailOpenRate}%</div>
                    <div className="text-xs text-muted-foreground">Open Rate</div>
                    <Progress value={data.marketingMetrics.emailOpenRate} className="mt-2" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.marketingMetrics.emailClickRate}%</div>
                    <div className="text-xs text-muted-foreground">Click Rate</div>
                    <Progress value={data.marketingMetrics.emailClickRate} className="mt-2" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.marketingMetrics.conversionRate}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                    <Progress value={data.marketingMetrics.conversionRate} className="mt-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekend Promo</span>
                    <span className="text-success">+15.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>New Product Launch</span>
                    <span className="text-success">+8.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Customer Win-back</span>
                    <span className="text-warning">+2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Influencer Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{data.marketingMetrics.activePartnerships}</div>
                    <div className="text-xs text-muted-foreground">Active Partnerships</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{data.marketingMetrics.influencerReach.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Reach</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>@sarahfoodblog</span>
                    <span className="text-success">5.2K reach</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>@mikeskitchen</span>
                    <span className="text-success">4.1K reach</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>@foodieadventures</span>
                    <span className="text-success">3.2K reach</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Engagement */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  AI Chatbot
                  {isLive && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{data.engagementMetrics.chatbotSessions.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Avg. Session Length</span>
                    <span className="font-medium">{data.engagementMetrics.avgSessionLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Messages per Session</span>
                    <span className="font-medium">{data.engagementMetrics.messagesPerSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction Rate</span>
                    <span className="font-medium text-success">{data.engagementMetrics.satisfactionRate}%</span>
                  </div>
                </div>
                <Progress value={data.engagementMetrics.satisfactionRate} className="w-full" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MousePointer className="w-5 h-5 mr-2" />
                  User Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{data.engagementMetrics.bounceRate}%</div>
                  <div className="text-sm text-muted-foreground">Avg. Bounce Rate</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pages per Session</span>
                    <span className="font-medium">{data.engagementMetrics.pagesPerSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session Duration</span>
                    <span className="font-medium">{data.engagementMetrics.sessionDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Visitors</span>
                    <span className="font-medium">{data.engagementMetrics.returnVisitors}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">+{data.engagementMetrics.monthlyGrowth}%</div>
                  <div className="text-sm text-muted-foreground">Monthly Growth</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>New Users</span>
                    <span className="font-medium text-success">+{data.engagementMetrics.newUsers}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engagement Rate</span>
                    <span className="font-medium text-success">+{data.engagementMetrics.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-medium text-success">+{data.engagementMetrics.conversionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}