import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2, Download, Eye, AlertCircle, Code, Laptop, Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWebsite, generateImage, WebsiteGenerationResponse, ImageGenerationResponse } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { saveWebsite } from "@/utils/websiteStorage";
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
  const [imageStyle, setImageStyle] = useState("realistic");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageQuality, setImageQuality] = useState("standard");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<ImageGenerationResponse[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const { toast } = useToast();

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
        toast({
          title: "Generation Failed",
          description: result.description,
          variant: "destructive",
        });
      } else {
        setGeneratedWebsite(result);
        setHasGeneratedWebsite(true);
        setActiveTab("preview");
        toast({
          title: "Website Generated!",
          description: "Your website has been created successfully.",
        });

        // Save to localStorage
        saveWebsite({
          id: uuidv4(),
          title: result.title,
          html: result.html,
          css: result.css,
          description: result.description,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate website";
      setWebsiteError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
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

    toast({
      title: "Downloaded!",
      description: "Your website has been downloaded successfully.",
    });
  };

  const handlePreview = () => {
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

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const result = await generateImage({
        prompt: imagePrompt.trim(),
        style: imageStyle,
        size: imageSize as '1024x1024' | '1024x1792' | '1792x1024',
        quality: imageQuality as 'standard' | 'hd'
      });

      setGeneratedImages(prev => [result, ...prev]);
      setImagePrompt('');
      toast({
        title: "Image Generated!",
        description: "Your image has been created successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate image";
      setImageError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
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

    toast({
      title: "Downloaded!",
      description: "Your image has been downloaded successfully.",
    });
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
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create stunning websites and images with AI-powered generation.
        </p>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="website" className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4" />
            <span>Generate Website</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center space-x-2">
            <Image className="w-4 h-4" />
            <span>Generate Image</span>
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
                <CardDescription>
                  The more details you provide, the better your website will be.
                </CardDescription>
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
                      <Button variant="outline" onClick={handlePreview}>
                        <Eye className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                      <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
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
              <CardDescription>
                Describe what you want to see and let AI create stunning images for you.
              </CardDescription>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <Select value={imageStyle} onValueChange={setImageStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="digital-art">Digital Art</SelectItem>
                      <SelectItem value="oil-painting">Oil Painting</SelectItem>
                      <SelectItem value="sketch">Sketch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Size</label>
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                      <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                      <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality</label>
                  <Select value={imageQuality} onValueChange={setImageQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hd">HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                        <p className="text-xs text-muted-foreground">
                          Style: {image.style} | Size: {image.size} | Quality: {image.quality}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}