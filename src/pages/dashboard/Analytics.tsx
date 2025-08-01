import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Mail, 
  Bot,
  Eye,
  MousePointer,
  Clock,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function Analytics() {
  const overviewStats = [
    {
      title: "Total Views",
      value: "12,847",
      change: "+15.3%",
      changeType: "increase",
      icon: Eye,
      period: "vs last month"
    },
    {
      title: "Unique Visitors",
      value: "8,234",
      change: "+8.7%", 
      changeType: "increase",
      icon: Users,
      period: "vs last month"
    },
    {
      title: "Email Opens",
      value: "3,456",
      change: "+23.1%",
      changeType: "increase",
      icon: Mail,
      period: "vs last month"
    },
    {
      title: "Bot Interactions",
      value: "1,892",
      change: "-2.4%",
      changeType: "decrease",
      icon: Bot,
      period: "vs last month"
    }
  ];

  const websiteAnalytics = [
    {
      website: "Sweet Dreams Bakery",
      views: "8,234",
      visitors: "5,678",
      bounceRate: "34%",
      avgTime: "2m 45s",
      status: "live"
    },
    {
      website: "TechFlow Solutions",
      views: "2,456",
      visitors: "1,789",
      bounceRate: "45%",
      avgTime: "1m 32s",
      status: "draft"
    },
    {
      website: "Artisan Portfolio",
      views: "1,567",
      visitors: "1,234",
      bounceRate: "28%",
      avgTime: "3m 12s",
      status: "live"
    }
  ];

  const topPages = [
    { page: "/", views: "4,234", title: "Homepage" },
    { page: "/menu", views: "2,456", title: "Menu" },
    { page: "/about", views: "1,789", title: "About Us" },
    { page: "/contact", views: "1,234", title: "Contact" },
    { page: "/gallery", views: "987", title: "Gallery" }
  ];

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
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="websites" className="space-y-6">
        <TabsList>
          <TabsTrigger value="websites">Website Analytics</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Performance</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
        </TabsList>

        {/* Website Analytics */}
        <TabsContent value="websites" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Traffic Chart Placeholder */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Traffic Overview
                </CardTitle>
                <CardDescription>Website visits over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Interactive chart visualization</p>
                    <p className="text-sm">(Chart component would go here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-muted-foreground">{page.page}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{page.views}</div>
                        <div className="text-xs text-muted-foreground">views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Website Performance Table */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Website Performance</CardTitle>
              <CardDescription>Detailed analytics for each of your websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Website</th>
                      <th className="text-left p-3 font-medium">Views</th>
                      <th className="text-left p-3 font-medium">Visitors</th>
                      <th className="text-left p-3 font-medium">Bounce Rate</th>
                      <th className="text-left p-3 font-medium">Avg. Time</th>
                      <th className="text-left p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {websiteAnalytics.map((website, index) => (
                      <tr key={index} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">{website.website}</div>
                        </td>
                        <td className="p-3 font-medium">{website.views}</td>
                        <td className="p-3">{website.visitors}</td>
                        <td className="p-3">{website.bounceRate}</td>
                        <td className="p-3">{website.avgTime}</td>
                        <td className="p-3">
                          <Badge 
                            variant={website.status === "live" ? "default" : "secondary"}
                            className={website.status === "live" ? "bg-success" : ""}
                          >
                            {website.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Performance */}
        <TabsContent value="marketing" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">28.4%</div>
                    <div className="text-xs text-muted-foreground">Open Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">6.7%</div>
                    <div className="text-xs text-muted-foreground">Click Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2.3%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
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
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">Active Partnerships</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12.5K</div>
                    <div className="text-xs text-muted-foreground">Reach</div>
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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">1,892</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Avg. Session Length</span>
                    <span className="font-medium">3m 24s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Messages per Session</span>
                    <span className="font-medium">5.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfaction Rate</span>
                    <span className="font-medium text-success">92%</span>
                  </div>
                </div>
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
                  <div className="text-3xl font-bold">32%</div>
                  <div className="text-sm text-muted-foreground">Avg. Bounce Rate</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pages per Session</span>
                    <span className="font-medium">3.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session Duration</span>
                    <span className="font-medium">2m 45s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Visitors</span>
                    <span className="font-medium">68%</span>
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
                  <div className="text-3xl font-bold text-success">+24%</div>
                  <div className="text-sm text-muted-foreground">Monthly Growth</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>New Users</span>
                    <span className="font-medium text-success">+18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engagement Rate</span>
                    <span className="font-medium text-success">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-medium text-success">+8%</span>
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