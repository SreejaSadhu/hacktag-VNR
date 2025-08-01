import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Wand2, Download, Eye, AlertCircle, Code } from "lucide-react";
import { generateWebsite, WebsiteGenerationResponse } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { saveWebsite } from "@/utils/websiteStorage";
import { v4 as uuidv4 } from "uuid";

export default function GenerateWebsite() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<WebsiteGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("code");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setError(null);

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
        setError(result.description);
        toast({
          title: "Generation Failed",
          description: result.description,
          variant: "destructive",
        });
      } else {
        setGeneratedWebsite(result);
        setHasGenerated(true);
        setActiveTab("code");
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
      setError(errorMessage);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Generate Your Website</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Describe your business and let AI create a stunning website tailored to your needs.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasGenerated ? (
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
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
              className="w-full h-12"
              size="lg"
            >
              {isGenerating ? (
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
              <CardTitle className="text-lg">{generatedWebsite?.title || "Generated Website"}</CardTitle>
              <CardDescription>
                {generatedWebsite?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Website Code */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Generated Website Code</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <h4 className="text-sm font-medium mb-2">HTML Structure</h4>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {generatedWebsite?.html || "No HTML generated yet"}
                  </pre>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-sm font-medium mb-2">CSS Styles</h4>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {generatedWebsite?.css || "No CSS generated yet"}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}