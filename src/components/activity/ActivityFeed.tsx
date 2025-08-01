import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Users, 
  Globe, 
  Sparkles, 
  Mail, 
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Share2,
  Download,
  Upload,
  Settings,
  Zap
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'website' | 'email' | 'chat' | 'insight' | 'system' | 'social';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar: string;
  };
  metadata?: {
    views?: number;
    likes?: number;
    shares?: number;
    downloads?: number;
  };
  status?: 'completed' | 'in-progress' | 'failed';
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time activity feed
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const shouldAddActivity = Math.random() < 0.4; // 40% chance every interval
      
      if (shouldAddActivity) {
        const activityTypes = [
          {
            type: 'website' as const,
            title: 'New website created',
            description: 'TechStart Pro website was generated successfully',
            icon: Globe
          },
          {
            type: 'email' as const,
            title: 'Email campaign sent',
            description: 'Marketing campaign reached 1,247 subscribers',
            icon: Mail
          },
          {
            type: 'chat' as const,
            title: 'Customer support chat',
            description: 'Sarah helped resolve a technical issue',
            icon: MessageSquare
          },
          {
            type: 'insight' as const,
            title: 'AI insights generated',
            description: 'Business analysis completed for startup',
            icon: Sparkles
          },
          {
            type: 'social' as const,
            title: 'Social media post',
            description: 'New post shared on LinkedIn',
            icon: Share2
          },
          {
            type: 'system' as const,
            title: 'System update',
            description: 'New features deployed successfully',
            icon: Zap
          }
        ];

        const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        const newActivity: ActivityItem = {
          id: `activity_${Date.now()}`,
          type: randomActivity.type,
          title: randomActivity.title,
          description: randomActivity.description,
          timestamp: new Date(),
          user: {
            name: ['Sarah Johnson', 'Mike Chen', 'Alex Rivera', 'Emma Wilson'][Math.floor(Math.random() * 4)],
            avatar: `/avatars/user${Math.floor(Math.random() * 4) + 1}.jpg`
          },
          metadata: {
            views: Math.floor(Math.random() * 1000) + 50,
            likes: Math.floor(Math.random() * 100) + 5,
            shares: Math.floor(Math.random() * 50) + 2,
            downloads: Math.floor(Math.random() * 200) + 10
          },
          status: ['completed', 'in-progress'][Math.floor(Math.random() * 2)] as 'completed' | 'in-progress'
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep only last 20
      }
    }, 5000); // Add activity every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'website':
        return <Globe className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-green-500" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'insight':
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      case 'social':
        return <Share2 className="h-4 w-4 text-pink-500" />;
      case 'system':
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="border-0 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Live Activity Feed</CardTitle>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? 'Pause' : 'Resume'} Live
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Activity will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-foreground">
                              {activity.title}
                            </p>
                            {activity.status && (
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                          
                          {/* User info */}
                          {activity.user && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={activity.user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {activity.user.name}
                              </span>
                            </div>
                          )}

                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="flex items-center space-x-4 mt-2">
                              {activity.metadata.views && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  <span>{activity.metadata.views}</span>
                                </div>
                              )}
                              {activity.metadata.likes && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Heart className="h-3 w-3" />
                                  <span>{activity.metadata.likes}</span>
                                </div>
                              )}
                              {activity.metadata.shares && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Share2 className="h-3 w-3" />
                                  <span>{activity.metadata.shares}</span>
                                </div>
                              )}
                              {activity.metadata.downloads && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Download className="h-3 w-3" />
                                  <span>{activity.metadata.downloads}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 