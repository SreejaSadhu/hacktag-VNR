import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Globe, 
  Filter,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export default function MyWebsites() {
  const [searchQuery, setSearchQuery] = useState("");

  const websites = [
    {
      id: 1,
      name: "Sweet Dreams Bakery",
      thumbnail: "/api/placeholder/300/200",
      status: "published",
      category: "Food & Beverage",
      createdAt: "2024-01-15",
      visits: "1,234",
      isLive: true
    },
    {
      id: 2,
      name: "TechFlow Solutions",
      thumbnail: "/api/placeholder/300/200", 
      status: "draft",
      category: "Technology",
      createdAt: "2024-01-18",
      visits: "0",
      isLive: false
    },
    {
      id: 3,
      name: "Artisan Portfolio",
      thumbnail: "/api/placeholder/300/200",
      status: "published",
      category: "Portfolio",
      createdAt: "2024-01-20",
      visits: "567",
      isLive: true
    },
    {
      id: 4,
      name: "Mountain View Restaurant",
      thumbnail: "/api/placeholder/300/200",
      status: "published",
      category: "Food & Beverage", 
      createdAt: "2024-01-22",
      visits: "891",
      isLive: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-success text-success-foreground";
      case "draft":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Websites</h1>
          <p className="text-muted-foreground">Manage and edit your AI-generated websites</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Generate New Site
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search websites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Websites Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((website) => (
          <Card key={website.id} className="overflow-hidden hover-lift border-0 shadow-soft group">
            {/* Thumbnail */}
            <div className="aspect-[4/3] bg-gradient-secondary relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge className={getStatusColor(website.status)}>
                  {website.status}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content */}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {website.name}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs">
                      {website.category}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Switch checked={website.isLive} />
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visits</span>
                  <span className="font-medium">{website.visits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{website.createdAt}</span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no websites) */}
      {websites.length === 0 && (
        <Card className="border-0 shadow-soft">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No websites yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first AI-generated website to get started.
            </p>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Generate Your First Website
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}