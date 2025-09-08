
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  Instagram, 
  Twitter, 
  Youtube,
  Star,
  MapPin,
  Users2,
  TrendingUp
} from "lucide-react";

interface Influencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement: number;
  category: string;
  location: string;
  price: number;
  rating: number;
  description: string;
  avatar: string;
}

export default function InfluencerMatch() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate mock influencer data
    const mockInfluencers: Influencer[] = [
      {
        id: "1",
        name: "Sarah Johnson",
        platform: "Instagram",
        followers: 125000,
        engagement: 4.2,
        category: "Lifestyle",
        location: "Los Angeles, CA",
        price: 2500,
        rating: 4.8,
        description: "Lifestyle and fashion influencer with authentic content and high engagement.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "2",
        name: "Mike Chen",
        platform: "YouTube",
        followers: 850000,
        engagement: 3.8,
        category: "Tech",
        location: "San Francisco, CA",
        price: 5000,
        rating: 4.6,
        description: "Tech reviewer and gadget enthusiast with detailed product analysis.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "3",
        name: "Emma Davis",
        platform: "TikTok",
        followers: 2200000,
        engagement: 5.1,
        category: "Beauty",
        location: "New York, NY",
        price: 3500,
        rating: 4.9,
        description: "Beauty and makeup tutorials with viral content and trendsetting style.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "4",
        name: "Alex Rodriguez",
        platform: "Instagram",
        followers: 89000,
        engagement: 4.5,
        category: "Fitness",
        location: "Miami, FL",
        price: 1800,
        rating: 4.7,
        description: "Fitness coach and nutrition expert with transformation success stories.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "5",
        name: "Lisa Wang",
        platform: "YouTube",
        followers: 450000,
        engagement: 4.0,
        category: "Food",
        location: "Chicago, IL",
        price: 3200,
        rating: 4.5,
        description: "Food blogger and recipe creator with delicious cooking tutorials.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "6",
        name: "David Kim",
        platform: "TikTok",
        followers: 1800000,
        engagement: 4.8,
        category: "Comedy",
        location: "Austin, TX",
        price: 2800,
        rating: 4.9,
        description: "Comedy content creator with relatable humor and viral skits.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      }
    ];

    setInfluencers(mockInfluencers);
    setFilteredInfluencers(mockInfluencers);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Filter influencers based on search and filters
    let filtered = influencers;

    if (searchTerm) {
      filtered = filtered.filter(influencer =>
        influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        influencer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPlatform !== "all") {
      filtered = filtered.filter(influencer => influencer.platform === selectedPlatform);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(influencer => influencer.category === selectedCategory);
    }

    setFilteredInfluencers(filtered);
  }, [searchTerm, selectedPlatform, selectedCategory, influencers]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram className="w-4 h-4" />;
      case "YouTube":
        return <Youtube className="w-4 h-4" />;
      case "TikTok":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading influencers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Influencer Match</h1>
          <p className="text-muted-foreground">Find the perfect influencers for your brand</p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Selected
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search influencers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="All platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Results</Label>
              <div className="text-2xl font-bold">{filteredInfluencers.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Influencers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInfluencers.map((influencer) => (
          <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={influencer.avatar}
                    alt={influencer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{influencer.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {getPlatformIcon(influencer.platform)}
                      <span>{influencer.platform}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{influencer.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{influencer.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">{formatFollowers(influencer.followers)}</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="font-medium">{influencer.engagement}%</p>
                  <p className="text-muted-foreground">Engagement</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{influencer.location}</span>
                </div>
                <Badge variant="secondary">{influencer.category}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">${influencer.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">per post</p>
                </div>
                <Button size="sm">
                  <MessageSquare className="mr-2 h-3 w-3" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInfluencers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No influencers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more influencers.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}