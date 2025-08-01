import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  ExternalLink,
  Star,
  MapPin,
  Instagram,
  Youtube,
  Twitter
} from "lucide-react";

export default function InfluencerMatch() {
  const [activeTab, setActiveTab] = useState("brand");

  const influencerResults = [
    {
      id: 1,
      name: "Sarah Food Blog",
      handle: "@sarahfoodblog",
      avatar: "/api/placeholder/60/60",
      followers: "45.2K",
      engagement: "8.4%",
      niche: "Food & Cooking",
      location: "San Francisco, CA",
      matchScore: 95,
      platforms: ["instagram", "youtube"],
      bio: "Sharing delicious recipes and food adventures! 🍕 Passionate about sustainable cooking and local ingredients.",
      tags: ["Food", "Recipes", "Sustainable", "Local"]
    },
    {
      id: 2,
      name: "Mike's Kitchen",
      handle: "@mikeskitchen",
      avatar: "/api/placeholder/60/60", 
      followers: "28.7K",
      engagement: "6.8%",
      niche: "Food & Lifestyle",
      location: "Portland, OR",
      matchScore: 87,
      platforms: ["instagram", "twitter"],
      bio: "Home cook sharing simple, delicious meals. Father of 2, food lover, weekend baker.",
      tags: ["HomeCooking", "Simple", "Family", "Baking"]
    },
    {
      id: 3,
      name: "Foodie Adventures",
      handle: "@foodieadventures",
      avatar: "/api/placeholder/60/60",
      followers: "62.1K", 
      engagement: "9.2%",
      niche: "Food & Travel",
      location: "Los Angeles, CA",
      matchScore: 82,
      platforms: ["instagram", "youtube", "twitter"],
      bio: "Exploring the world one bite at a time 🌎 Food photographer and travel enthusiast.",
      tags: ["Travel", "Photography", "Foodie", "Adventure"]
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Influencer Match</h1>
        <p className="text-muted-foreground">
          Connect with influencers who align perfectly with your brand values and audience.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brand">Brand Matching</TabsTrigger>
          <TabsTrigger value="influencer">Influencer Enrollment</TabsTrigger>
        </TabsList>

        {/* Brand Matching Tab */}
        <TabsContent value="brand" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Brand Form */}
            <Card className="lg:col-span-1 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Find Your Match
                </CardTitle>
                <CardDescription>
                  Tell us about your brand to find perfect influencer partners.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandGoals">Campaign Goals</Label>
                  <Textarea
                    id="brandGoals"
                    placeholder="e.g., Increase brand awareness for our new bakery, reach food enthusiasts in local area..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Food lovers, 25-45, health-conscious"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandTone">Brand Tone</Label>
                  <Input
                    id="brandTone"
                    placeholder="e.g., Warm, authentic, community-focused"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $500-1000 per post"
                  />
                </div>
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Find Matches
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {influencerResults.length} Perfect Matches Found
                </h3>
                <Button variant="outline" size="sm">
                  Filter Results
                </Button>
              </div>

              {influencerResults.map((influencer) => (
                <Card key={influencer.id} className="border-0 shadow-soft hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={influencer.avatar} />
                        <AvatarFallback>{influencer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-lg">{influencer.name}</h4>
                              <span className="text-muted-foreground">{influencer.handle}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {influencer.location}
                              </span>
                              <Badge variant="outline">{influencer.niche}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getMatchColor(influencer.matchScore)}`}>
                              {influencer.matchScore}%
                            </div>
                            <div className="text-xs text-muted-foreground">Match Score</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">{influencer.bio}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1 text-primary" />
                              <span className="font-medium">{influencer.followers}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1 text-destructive" />
                              <span className="font-medium">{influencer.engagement}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {influencer.platforms.map((platform) => (
                                <div key={platform} className="text-muted-foreground">
                                  {getPlatformIcon(platform)}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Profile
                            </Button>
                            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                              Connect
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {influencer.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Influencer Enrollment Tab */}
        <TabsContent value="influencer" className="space-y-6">
          <Card className="max-w-2xl mx-auto border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Join as an Influencer
              </CardTitle>
              <CardDescription>
                Connect with brands that align with your values and audience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="influencerName">Full Name</Label>
                  <Input id="influencerName" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handle">Social Handle</Label>
                  <Input id="handle" placeholder="@yourusername" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="niche">Content Niche</Label>
                <Input id="niche" placeholder="e.g., Food, Travel, Lifestyle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="values">Brand Values</Label>
                <Textarea
                  id="values"
                  placeholder="What values are important to you? What brands do you want to work with?"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="followers">Follower Count</Label>
                  <Input id="followers" placeholder="e.g., 10K" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell brands about yourself and your content..."
                  rows={3}
                />
              </div>
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Join Influencer Network
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}