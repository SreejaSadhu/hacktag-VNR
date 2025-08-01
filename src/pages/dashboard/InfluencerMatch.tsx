
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  ExternalLink,
  Star,
  MapPin,
  Instagram,
  Youtube,

  Twitter,
} from "lucide-react";

type Influencer = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  engagement: string;
  niche: string;
  location: string;
  match_score: number;
  platforms: string; // comma-separated
  bio: string;
  tags: string; // comma-separated
  profile_url: string;
};

export default function InfluencerMatch() {
  const [activeTab, setActiveTab] = useState("brand");
  const [influencerResults, setInfluencerResults] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Brand form state
  const [brandForm, setBrandForm] = useState({
    campaignGoals: "",
    targetAudience: "",
    brandTone: "",
    budget: "",
  });

  // Influencer signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    handle: "",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=" + Math.random(), // placeholder
    followers: "",
    engagement: "",
    niche: "",
    location: "",
    match_score: 80,
    platforms: "",
    bio: "",
    tags: "",
    profile_url: "",
  });

  // Fetch all influencers on mount (for initial display)
  useEffect(() => {
    fetchAllInfluencers();
  }, []);

  const fetchAllInfluencers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("influencers").select("*");
    if (error) setError(error.message);
    else setInfluencerResults(data || []);
    setLoading(false);
  };

  // Handle brand form changes
  const handleBrandFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setBrandForm((prev) => ({ ...prev, [id]: value }));
  };

  // Find matches based on brand form
  const handleFindMatches = async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from("influencers").select("*");

    // Example: filter by niche (targetAudience) and bio (brandTone)
    if (brandForm.targetAudience) {
      query = query.ilike("niche", `%${brandForm.targetAudience}%`);
    }
    if (brandForm.brandTone) {
      query = query.ilike("bio", `%${brandForm.brandTone}%`);
    }

    const { data, error } = await query;
    if (error) setError(error.message);
    else setInfluencerResults(data || []);
    setLoading(false);
  };

  // Handle influencer signup form changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle influencer signup form submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formToSend = {
      ...signupForm,
      platforms: signupForm.platforms,
      tags: signupForm.tags,
    };
    const { error } = await supabase.from("influencers").insert([formToSend]);
    if (error) {
      setError(error.message);
    } else {
      alert("Thank you for joining the influencer network!");
      fetchAllInfluencers();
      setSignupForm({
        name: "",
        handle: "",
        avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=" + Math.random(),
        followers: "",
        engagement: "",
        niche: "",
        location: "",
        match_score: 80,
        platforms: "",
        bio: "",
        tags: "",
        profile_url: "",
      });
      setActiveTab("brand");
    }
    setLoading(false);
  };


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
                  Description
                </CardTitle>
                
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">

                  <Label htmlFor="campaignGoals">Campaign Goals</Label>
                  <Textarea
                    id="campaignGoals"
                    value={brandForm.campaignGoals}
                    onChange={handleBrandFormChange}

                    placeholder="e.g., Increase brand awareness for our new bakery, reach food enthusiasts in local area..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={brandForm.targetAudience}
                    onChange={handleBrandFormChange}

                    placeholder="e.g., Food lovers, 25-45, health-conscious"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandTone">Brand Tone</Label>
                  <Input
                    id="brandTone"
                    value={brandForm.brandTone}
                    onChange={handleBrandFormChange}

                    placeholder="e.g., Warm, authentic, community-focused"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"

                    value={brandForm.budget}
                    onChange={handleBrandFormChange}
                    placeholder="e.g., $500-1000 per post"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={handleFindMatches}
                  disabled={loading}
                >
                  {loading ? "Finding..." : "Find Matches"}
                </Button>
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={fetchAllInfluencers}
                  disabled={loading}
                >
                  Show All Influencers

                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {influencerResults.length} Perfect Matches Found
                </h3>

                <Button variant="outline" size="sm" disabled>
                  Filter Results
                </Button>
              </div>
              {loading && <p>Loading influencers...</p>}
              {error && <p className="text-destructive">{error}</p>}

              {influencerResults.map((influencer) => (
                <Card key={influencer.id} className="border-0 shadow-soft hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={influencer.avatar} />

                        <AvatarFallback>
                          {influencer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
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

                            <div className={`text-2xl font-bold ${getMatchColor(influencer.match_score)}`}>
                              {influencer.match_score}%

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
                              {influencer.platforms.split(",").map((platform) => (
                                <div key={platform} className="text-muted-foreground">
                                  {getPlatformIcon(platform.trim())}

                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">

                            <Button
                              size="sm"
                              className="bg-gradient-primary hover:opacity-90"
                              onClick={() => {
                                if (influencer.profile_url) {
                                  window.open(influencer.profile_url, "_blank", "noopener,noreferrer");
                                }
                              }}
                            >

                              Connect
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {influencer.tags.split(",").map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag.trim()}

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

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={signupForm.name}
                      onChange={handleSignupChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="handle">Social Handle</Label>
                    <Input
                      id="handle"
                      name="handle"
                      value={signupForm.handle}
                      onChange={handleSignupChange}
                      placeholder="@yourusername"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niche">Content Niche</Label>
                  <Input
                    id="niche"
                    name="niche"
                    value={signupForm.niche}
                    onChange={handleSignupChange}
                    placeholder="e.g., Food, Travel, Lifestyle"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={signupForm.bio}
                    onChange={handleSignupChange}
                    placeholder="Tell brands about yourself and your content..."
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="followers">Follower Count</Label>
                    <Input
                      id="followers"
                      name="followers"
                      value={signupForm.followers}
                      onChange={handleSignupChange}
                      placeholder="e.g., 10K"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engagement">Engagement Rate</Label>
                    <Input
                      id="engagement"
                      name="engagement"
                      value={signupForm.engagement}
                      onChange={handleSignupChange}
                      placeholder="e.g., 8.4%"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={signupForm.location}
                      onChange={handleSignupChange}
                      placeholder="City, State"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile_url">Profile URL</Label>
                    <Input
                      id="profile_url"
                      name="profile_url"
                      value={signupForm.profile_url}
                      onChange={handleSignupChange}
                      placeholder="https://instagram.com/yourprofile"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platforms">Platforms (comma separated)</Label>
                  <Input
                    id="platforms"
                    name="platforms"
                    value={signupForm.platforms}
                    onChange={handleSignupChange}
                    placeholder="instagram, youtube, twitter"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={signupForm.tags}
                    onChange={handleSignupChange}
                    placeholder="Food, Recipes, Sustainable"
                  />
                </div>
                <Button className="w-full bg-gradient-primary hover:opacity-90" type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Join Influencer Network"}
                </Button>
                {error && <p className="text-destructive">{error}</p>}
              </form>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}