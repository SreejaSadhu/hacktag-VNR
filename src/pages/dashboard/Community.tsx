import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Search,
  Filter,
  TrendingUp,
  Users,
  Sparkles,
  Eye,
  Plus,
  Bookmark
} from "lucide-react";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");

  const communityPosts = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/api/placeholder/40/40",
        title: "Bakery Owner"
      },
      business: "Sweet Dreams Bakery",
      category: "Food & Beverage",
      journey: "From zero to 500+ customers in 3 months using AI-generated website and targeted email campaigns.",
      actions: [
        "Generated modern bakery website",
        "Created 12 email marketing campaigns", 
        "Connected with 3 local food influencers",
        "Implemented customer feedback system"
      ],
      results: {
        websiteViews: "8.2K",
        emailOpens: "34%",
        customerGrowth: "+300%"
      },
      likes: 47,
      comments: 12,
      shares: 8,
      isBookmarked: true,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      user: {
        name: "Mike Rodriguez",
        avatar: "/api/placeholder/40/40",
        title: "Tech Entrepreneur"
      },
      business: "TechFlow Solutions",
      category: "Technology",
      journey: "Launched MVP website and found first 10 beta customers through AI-powered marketing tools.",
      actions: [
        "Built tech startup landing page",
        "Set up lead generation funnels",
        "Created product demo videos",
        "Launched beta user program"
      ],
      results: {
        signups: "156",
        conversionRate: "12%",
        betaUsers: "10"
      },
      likes: 32,
      comments: 8,
      shares: 15,
      isBookmarked: false,
      timeAgo: "1 day ago"
    },
    {
      id: 3,
      user: {
        name: "Emily Watson",
        avatar: "/api/placeholder/40/40",
        title: "Creative Director"
      },
      business: "Artisan Portfolio",
      category: "Design",
      journey: "Transformed my creative work into a thriving freelance business with professional online presence.",
      actions: [
        "Created stunning portfolio website",
        "Optimized for search engines",
        "Built client testimonial system",
        "Automated project inquiry process"
      ],
      results: {
        clientInquiries: "+250%",
        projectValue: "+$15K",
        organicTraffic: "+180%"
      },
      likes: 73,
      comments: 19,
      shares: 11,
      isBookmarked: true,
      timeAgo: "3 days ago"
    }
  ];

  const trendingTopics = [
    { tag: "AI Website Generation", posts: 156 },
    { tag: "Email Marketing", posts: 89 },
    { tag: "Local Business Growth", posts: 67 },
    { tag: "Influencer Partnerships", posts: 45 },
    { tag: "Customer Feedback", posts: 34 }
  ];

  const featuredMembers = [
    {
      name: "Alex Thompson",
      title: "Restaurant Chain Owner",
      achievement: "Scaled to 5 locations using Boostly",
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Lisa Park",
      title: "E-commerce Founder", 
      achievement: "Generated $100K revenue in first year",
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "David Kim",
      title: "Consultant",
      achievement: "Helped 50+ businesses grow online",
      avatar: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Discover success stories and connect with fellow entrepreneurs.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Share Your Journey
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search success stories, businesses, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {communityPosts.map((post) => (
            <Card key={post.id} className="border-0 shadow-soft hover-lift">
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{post.user.name}</h3>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{post.user.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {post.isBookmarked ? (
                          <Bookmark className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Business Title */}
                <div>
                  <h4 className="text-lg font-semibold">{post.business}</h4>
                  <p className="text-muted-foreground">{post.journey}</p>
                </div>

                {/* Actions Taken */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-primary" />
                    Actions Taken
                  </h5>
                  <ul className="space-y-1">
                    {post.actions.map((action, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Results */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-hero rounded-lg">
                  {Object.entries(post.results).map(([key, value], index) => (
                    <div key={index} className="text-center">
                      <div className="font-bold text-lg">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-secondary">
                      <Share className="w-4 h-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Stories
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 cursor-pointer transition-colors">
                  <div>
                    <div className="font-medium text-sm">#{topic.tag}</div>
                    <div className="text-xs text-muted-foreground">{topic.posts} posts</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Featured Members */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2" />
                Featured Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.title}</div>
                    <div className="text-xs text-primary">{member.achievement}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Community Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">2,847</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold">1,234</div>
                  <div className="text-muted-foreground">Success Stories</div>
                </div>
                <div>
                  <div className="font-bold">567</div>
                  <div className="text-muted-foreground">Businesses Launched</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}