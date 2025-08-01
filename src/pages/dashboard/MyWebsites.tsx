import { useEffect, useState } from "react";
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
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { getStoredWebsites, deleteWebsite, StoredWebsite } from "@/utils/websiteStorage";

export default function MyWebsites() {
  const [websites, setWebsites] = useState<StoredWebsite[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setWebsites(getStoredWebsites());
  }, []);

  const handleDelete = (id: string) => {
    deleteWebsite(id);
    setWebsites(getStoredWebsites());
  };

  const handlePreview = (website: StoredWebsite) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${website.title}</title>
        <style>${website.css}</style>
      </head>
      <body>${website.html}</body>
      </html>
    `;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  // Optionally, implement edit and visit site as needed

  const filteredWebsites = websites.filter((website) =>
    website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    website.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredWebsites.map((website) => (
          <Card key={website.id} className="overflow-hidden hover-lift border-0 shadow-soft group">
            {/* Thumbnail */}
            <div className="aspect-[4/3] relative overflow-hidden border-b">
              <iframe
                srcDoc={`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>${website.css}</style>
      </head>
      <body>${website.html}</body>
      </html>`}
                title={website.title}
                className="w-full h-full absolute inset-0"
                sandbox=""
                loading="lazy"
                style={{ border: "none", pointerEvents: "none", background: "#fff" }}
              />
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-success text-success-foreground">
                  Saved
                </Badge>
              </div>
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* ...DropdownMenu as before... */}
              </div>
            </div>

            {/* Content */}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {website.title}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs">
                      {website.description}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Switch checked={true} />
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(website.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePreview(website)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive"
                    onClick={() => handleDelete(website.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no websites) */}
      {filteredWebsites.length === 0 && (
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