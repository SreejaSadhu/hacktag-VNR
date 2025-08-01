import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AILoading } from "@/components/ui/LoadingSpinner";
import { CTAButton } from "@/components/ui/CTAButton";
import { 
  Sparkles, 
  Wand2, 
  Download, 
  Eye, 
  RefreshCw,
  Palette,
  Type,
  Layout
} from "lucide-react";

export default function GenerateWebsite() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("professional");

  const personas = [
    {
      id: "professional",
      name: "Professional",
      description: "Clean, corporate, and trustworthy",
      color: "bg-primary"
    },
    {
      id: "playful", 
      name: "Playful",
      description: "Fun, colorful, and energetic",
      color: "bg-secondary"
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple, elegant, and focused",
      color: "bg-accent"
    }
  ];

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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

      {!hasGenerated ? (
        /* Generation Form */
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
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>

            {/* AI Persona Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-medium">AI Persona</label>
              <div className="grid grid-cols-3 gap-3">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPersona === persona.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${persona.color} mb-2`} />
                    <div className="font-medium text-sm">{persona.name}</div>
                    <div className="text-xs text-muted-foreground">{persona.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <CTAButton 
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
              className="w-full h-12"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Website
                </>
              )}
            </CTAButton>
          </CardContent>
        </Card>
      ) : (
        /* Generated Preview */
        <div className="space-y-6">
          {/* Preview Header */}
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Sweet Dreams Bakery</h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Badge variant="secondary">Professional Style</Badge>
                    <span>Generated 2 minutes ago</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleRegenerate} disabled={isGenerating}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Website Preview */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-soft overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Website Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-[16/10] bg-gradient-hero rounded-lg mx-6 mb-6 flex items-center justify-center">
                    <div className="text-center space-y-4 text-foreground/70">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Sweet Dreams Bakery</h3>
                        <p className="text-lg">Artisanal breads & pastries</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customization Options */}
            <div className="space-y-4">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Palette className="w-5 h-5 mr-2" />
                    Template Remix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Palette className="w-4 h-4 mr-2" />
                    Shuffle Colors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Type className="w-4 h-4 mr-2" />
                    Change Fonts
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Layout className="w-4 h-4 mr-2" />
                    New Layout
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CTAButton className="w-full">
                    Save Website
                  </CTAButton>
                  <Button variant="outline" className="w-full">
                    Publish Live
                  </Button>
                  <Button variant="outline" className="w-full">
                    Edit in Builder
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <AILoading 
          text="Creating your perfect website..."
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        />
      )}
    </div>
  );
}