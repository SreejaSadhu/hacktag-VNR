import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActivityFeed from "@/components/activity/ActivityFeed";
import ProgressTracker from "@/components/progress/ProgressTracker";
import { 
  Activity, 
  Trophy, 
  Bell, 
  MessageCircle,
  Zap,
  TrendingUp,
  Users,
  Globe
} from "lucide-react";

export default function RealTimeFeatures() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Real-Time Features
        </h1>
        <p className="text-muted-foreground text-lg">
          Experience the power of live, interactive features that keep you engaged
        </p>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-soft hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Live Chat</CardTitle>
                <CardDescription>Real-time customer support</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with support agents instantly. Get help when you need it most.
            </p>
            <Badge variant="secondary" className="mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Online Now
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-secondary flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Smart Notifications</CardTitle>
                <CardDescription>Real-time alerts & updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get instant notifications about important events and updates.
            </p>
            <Badge variant="secondary" className="mt-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
              Active
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Live Activity</CardTitle>
                <CardDescription>Real-time activity feed</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See what's happening across the platform in real-time.
            </p>
            <Badge variant="secondary" className="mt-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
                <CardDescription>Achievements & milestones</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your progress and unlock achievements in real-time.
            </p>
            <Badge variant="secondary" className="mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Updating
            </Badge>
          </CardContent>
        </Card>
      </div>

      

      {/* Feature Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Why Real-Time Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div>
                <h4 className="font-medium">Instant Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Get immediate responses and see results in real-time
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
              <div>
                <h4 className="font-medium">Enhanced Engagement</h4>
                <p className="text-sm text-muted-foreground">
                  Stay connected and engaged with live updates and notifications
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
              </div>
              <div>
                <h4 className="font-medium">Better User Experience</h4>
                <p className="text-sm text-muted-foreground">
                  Enjoy a more interactive and responsive platform experience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <span className="text-lg font-bold text-blue-600">1,247</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Websites Created</span>
              </div>
              <span className="text-lg font-bold text-green-600">89</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Chat Sessions</span>
              </div>
              <span className="text-lg font-bold text-purple-600">456</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="border-0 shadow-soft bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Experience the Power of Real-Time</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our real-time features keep you connected, informed, and engaged. 
            Experience the difference that live updates and instant feedback can make.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" className="bg-gradient-primary">
              <Zap className="w-4 h-4 mr-2" />
              Explore Features
            </Button>
            <Button variant="outline" size="lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 