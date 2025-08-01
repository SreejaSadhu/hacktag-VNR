import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import ActivityFeed from "@/components/activity/ActivityFeed";
import ProgressTracker from "@/components/progress/ProgressTracker";
import { 
  Globe, 
  HardDrive, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Clock,
  Users,
  Zap
} from "lucide-react";

export default function Dashboard() {

  const navigate = useNavigate();

  const stats = [
    {
      title: "Sites Created",
      value: "12",
      change: "+3 this month",
      icon: Globe,
      color: "text-primary"
    },
    {
      title: "Storage Used", 
      value: "2.4 GB",
      change: "of 10 GB",
      icon: HardDrive,
      color: "text-warning"
    },
    {
      title: "Emails Sent",
      value: "1,284",
      change: "+127 this week",
      icon: Mail,
      color: "text-success"
    },
    {
      title: "Chatbot Sessions",
      value: "456",
      change: "+12% this month",
      icon: MessageSquare,
      color: "text-secondary"
    }
  ];

  const recentActivity = [
    {
      type: "website",
      title: "Created 'Sweet Dreams Bakery' website",
      time: "2 hours ago",
      icon: Globe
    },
    {
      type: "email",
      title: "Sent promotional email campaign",
      time: "5 hours ago", 
      icon: Mail
    },
    {
      type: "influencer",
      title: "Matched with @foodie_blogger",
      time: "1 day ago",
      icon: Users
    },
    {
      type: "analytics",
      title: "Monthly analytics report generated",
      time: "2 days ago",
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-gradient-secondary text-secondary-foreground">
            <Sparkles className="w-3 h-3 mr-1" />
            Pro Plan
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-lift border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Get started with these popular features</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/20"

              onClick={() => navigate('/dashboard/generate')}

            >
              <Sparkles className="w-6 h-6 text-primary" />
              <span>Generate Website</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-secondary/20 hover:border-secondary"

              onClick={() => navigate('/dashboard/influencer')}

            >
              <Users className="w-6 h-6 text-secondary" />
              <span>Find Influencers</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-accent/20 hover:border-accent"

              onClick={() => navigate('/dashboard/email')}

            >
              <Mail className="w-6 h-6 text-accent" />
              <span>Email Campaign</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-success/20 hover:border-success"
     onClick={() => navigate('/dashboard/analytics')}

            >
              <TrendingUp className="w-6 h-6 text-success" />
              <span>View Analytics</span>
            </Button>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Your usage this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Websites Created</span>
                <span>3/5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Storage Used</span>
                <span>2.4/10 GB</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Email Campaigns</span>
                <span>8/25</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>
            <Button className="w-full mt-4" variant="outline">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Activity Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <ProgressTracker />
      </div>
    </div>
  );
}