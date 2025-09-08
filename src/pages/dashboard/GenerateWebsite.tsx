import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2, Download, Eye, AlertCircle, Code, Laptop, Image, Globe, Search, Plus, Trash2, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { generateWebsite, generateImage, WebsiteGenerationResponse, ImageGenerationResponse } from "@/lib/gemini";

import { saveWebsite, getStoredWebsites, deleteWebsite, StoredWebsite } from "@/utils/websiteStorage";
import { v4 as uuidv4 } from "uuid";

export default function GenerateWebsite() {
  // Website generation state
  const [description, setDescription] = useState("");
  const [isGeneratingWebsite, setIsGeneratingWebsite] = useState(false);
  const [hasGeneratedWebsite, setHasGeneratedWebsite] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<WebsiteGenerationResponse | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("preview");
  
  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<ImageGenerationResponse[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // My Websites state
  const [websites, setWebsites] = useState<StoredWebsite[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setWebsites(getStoredWebsites());
    
    // Load last generated website from localStorage
    const lastGeneratedWebsite = localStorage.getItem('lastGeneratedWebsite');
    if (lastGeneratedWebsite) {
      try {
        const parsed = JSON.parse(lastGeneratedWebsite);
        setGeneratedWebsite(parsed);
        setHasGeneratedWebsite(true);
        setActiveTab("preview");
      } catch (error) {
        console.error('Error loading last generated website:', error);
        localStorage.removeItem('lastGeneratedWebsite');
      }
    }
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

  const handlePreviewGenerated = () => {
    if (!generatedWebsite) return;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${generatedWebsite.title}</title>
    <style>
        ${generatedWebsite.css}
    </style>
</head>
<body>
    ${generatedWebsite.html}
</body>
</html>
    `;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  const filteredWebsites = websites.filter((website) =>
    website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    website.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateWebsite = async () => {
    if (!description.trim()) return;
    setIsGeneratingWebsite(true);
    setWebsiteError(null);

    try {
      const result = await generateWebsite({
        description: description.trim(),
        persona: "professional" // Default to professional
      });

      // Check for error responses
      if (
        result.title === 'API Key Error' ||
        result.title === 'Generation Error' ||
        result.title === 'Invalid Response' ||
        result.title === 'Incomplete Response'
      ) {
        setWebsiteError(result.description);

      } else {
        setGeneratedWebsite(result);
        setHasGeneratedWebsite(true);
        setActiveTab("preview");

        // Save to localStorage for persistence
        localStorage.setItem('lastGeneratedWebsite', JSON.stringify(result));

        // Save to localStorage
        saveWebsite({
          id: uuidv4(),
          title: result.title,
          html: result.html,
          css: result.css,
          description: result.description,
          createdAt: new Date().toISOString(),
        });
        
        // Refresh websites list
        setWebsites(getStoredWebsites());
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate website";
      setWebsiteError(errorMessage);

    } finally {
      setIsGeneratingWebsite(false);
    }
  };

  const handleDownload = () => {
    if (!generatedWebsite) return;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${generatedWebsite.title}</title>
    <style>
        ${generatedWebsite.css}
    </style>
</head>
<body>
    ${generatedWebsite.html}
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedWebsite.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearGeneratedWebsite = () => {
    setGeneratedWebsite(null);
    setHasGeneratedWebsite(false);
    setWebsiteError(null);
    localStorage.removeItem('lastGeneratedWebsite');
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      // Map the selected size to the appropriate Gemini API size
      const getGeminiSize = (selectedSize: string) => {
        const sizeMap: Record<string, '1024x1024' | '1024x1792' | '1792x1024'> = {
          '1024x1024': '1024x1024',
          '1080x1080': '1024x1024',
          '1080x1350': '1024x1792',
          '1200x630': '1792x1024',
          '1200x675': '1792x1024',
          '1080x1920': '1024x1792',
          '1500x500': '1792x1024',
          '851x315': '1792x1024',
          '1200x628': '1792x1024',
          '1584x396': '1792x1024',
          '1024x1792': '1024x1792',
          '1792x1024': '1792x1024',
        };
        return sizeMap[selectedSize] || '1024x1024';
      };

      const result = await generateImage({
        prompt: imagePrompt.trim(),
        style: "realistic", // Default to realistic
        size: "1024x1024", // Default to 1024x1024
        quality: "standard" // Default to standard
      });

      setGeneratedImages(prev => [result, ...prev]);
      setImagePrompt('');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate image";
      setImageError(errorMessage);

    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Generate Content</h1>
        
      </div>

      {/* Error Display */}
      {websiteError && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{websiteError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {imageError && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{imageError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="website" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="website" className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4" />
            <span>Generate Website</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center space-x-2">
            <Image className="w-4 h-4" />
            <span>Generate Image</span>
          </TabsTrigger>
          <TabsTrigger value="my-websites" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>My Websites</span>
          </TabsTrigger>
        </TabsList>

        {/* Website Generation Tab */}
        <TabsContent value="website" className="space-y-6">
                    {!hasGeneratedWebsite ? (
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 className="w-5 h-5 mr-2" />
              Tell us about your business
            </CardTitle>
                
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Description</label>
              <Textarea
                placeholder="e.g., I run a cozy bakery in downtown Portland that specializes in organic sourdough bread and artisanal pastries. We focus on local ingredients and have a warm, community-focused atmosphere..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <Button
                  onClick={handleGenerateWebsite}
                  disabled={!description.trim() || isGeneratingWebsite}
              className="w-full h-12"
              size="lg"
            >
                  {isGeneratingWebsite ? (
                <>
                  <span>Generating...</span>
                  <Sparkles className="w-5 h-5 ml-2 animate-spin" />
                </>
              ) : (
                "Generate Website"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Website Info */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
              <CardTitle className="text-lg">{generatedWebsite?.title || "Generated Website"}</CardTitle>
              <CardDescription>
                {generatedWebsite?.description}
              </CardDescription>
                    </div>
              <div className="flex space-x-2">
                      <Button variant="outline" onClick={handlePreviewGenerated}>
                  <Eye className="w-4 h-4 mr-2" />
                        Open in New Tab
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                      <Button variant="outline" onClick={handleClearGeneratedWebsite}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                      <Button variant="outline" onClick={() => setHasGeneratedWebsite(false)}>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate New
                      </Button>
                    </div>
              </div>
                </CardHeader>
          </Card>

              {/* Website Preview & Code Tabs */}
          <Card className="border-0 shadow-soft">
                <CardHeader className="pb-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview" className="flex items-center space-x-2">
                        <Laptop className="w-4 h-4" />
                        <span>Preview</span>
                      </TabsTrigger>
                      <TabsTrigger value="code" className="flex items-center space-x-2">
                        <Code className="w-4 h-4" />
                        <span>Code</span>
                      </TabsTrigger>
                    </TabsList>
                  
                    <TabsContent value="preview" className="mt-4 border rounded-md overflow-hidden">
                      <div className="w-full bg-white">
                        <iframe
                          srcDoc={`
                            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>${generatedWebsite?.title || "Generated Website"}</title>
                              <style>
                                ${generatedWebsite?.css || ""}
                              </style>
                            </head>
                            <body>
                              ${generatedWebsite?.html || "<div>No preview available yet</div>"}
                            </body>
                            </html>
                          `}
                          title="Website Preview"
                          className="w-full h-[600px] border-0"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="code" className="mt-4">
                      <div className="space-y-6">
                        <div>
                <h4 className="text-sm font-medium mb-2">HTML Structure</h4>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {generatedWebsite?.html || "No HTML generated yet"}
                  </pre>
                </div>
              </div>
                        <div>
                <h4 className="text-sm font-medium mb-2">CSS Styles</h4>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {generatedWebsite?.css || "No CSS generated yet"}
                  </pre>
                </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Image Generation Tab */}
        <TabsContent value="image" className="space-y-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Generate AI Images
              </CardTitle>
              
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Description</label>
                <Textarea
                  placeholder="e.g., A futuristic cityscape with flying cars and neon lights, cyberpunk style"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleGenerateImage}
                disabled={!imagePrompt.trim() || isGeneratingImage}
                className="w-full h-12"
                size="lg"
              >
                {isGeneratingImage ? (
                  <>
                    <span>Generating...</span>
                    <Sparkles className="w-5 h-5 ml-2 animate-spin" />
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Images Gallery */}
          {generatedImages.length > 0 && (
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Generated Images</CardTitle>
                <CardDescription>
                  Your AI-generated images will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedImages.map((image, index) => (
                    <div key={index} className="group relative">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={image.imageUrl}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            onClick={() => handleDownloadImage(image.imageUrl, image.prompt)}
                            size="sm"
                            variant="secondary"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium truncate">{image.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* My Websites Tab */}
        <TabsContent value="my-websites" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}