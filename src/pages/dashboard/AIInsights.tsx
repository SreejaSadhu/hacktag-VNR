import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AILoading } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { generateInsights, type InsightResponse } from "@/lib/gemini";
import { 
  Lightbulb, 
  TrendingUp, 
  Search, 
  Users, 
  Target,
  BarChart3,
  Sparkles,
  Copy,
  RefreshCw
} from "lucide-react";

interface InsightData {
  competitors: string;
  seo: string;
  prosAndCons: string;
  marketRelevance: string;
  futureScore: string;
}

export default function AIInsights() {
  const [businessPrompt, setBusinessPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    if (!businessPrompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateInsights({
        businessDescription: businessPrompt.trim()
      });
      
      // Check if the result contains an error message
      if (result.competitors.startsWith('❌')) {
        setError(result.competitors);
        toast({
          title: "Generation Failed",
          description: result.competitors,
          variant: "destructive",
        });
      } else {
        setInsights(result);
        toast({
          title: "Insights Generated!",
          description: "Your business insights have been created successfully.",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate insights";
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

  const handleCopy = (content: string, title: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${title} copied to clipboard.`,
    });
  };

  const handleRegenerate = () => {
    handleGenerateInsights();
  };

  const handleClear = () => {
    setBusinessPrompt("");
    setInsights(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            AI Business Insights
          </h1>
          <p className="text-muted-foreground text-lg">
            Get comprehensive AI-powered insights about your business
          </p>
        </div>

        {!insights ? (
          /* Input Form */
          <Card className="border-0 shadow-soft max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Lightbulb className="w-6 h-6 mr-3 text-primary" />
                Describe Your Business
              </CardTitle>
              <CardDescription>
                Provide details about your business, industry, and goals to generate comprehensive insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessPrompt" className="text-lg font-medium">
                  Business Description
                </Label>
                <Textarea
                  id="businessPrompt"
                  value={businessPrompt}
                  onChange={(e) => setBusinessPrompt(e.target.value)}
                  rows={6}
                  className="resize-none text-lg"
                  placeholder="Describe your business, industry, target market, products/services, and what insights you're looking for..."
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about your business model, market, and challenges for better insights
                </p>
              </div>

              <Button 
                onClick={handleGenerateInsights}
                disabled={!businessPrompt.trim() || isGenerating}
                className="w-full h-14 bg-gradient-primary hover:opacity-90 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Generate AI Insights
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Insights Display */
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Business Insights</h2>
                <p className="text-muted-foreground">AI-powered analysis of your business</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleRegenerate} disabled={isGenerating}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </div>

            {/* Insights Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Competitors */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Competitors Analysis
                  </CardTitle>
                  <CardDescription>
                    Key competitors and market positioning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground">{insights.competitors}</pre>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(insights.competitors, "Competitors Analysis")}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* SEO */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2 text-green-600" />
                    SEO Insights
                  </CardTitle>
                  <CardDescription>
                    Search engine optimization opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground">{insights.seo}</pre>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(insights.seo, "SEO Insights")}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pros and Cons */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                    Pros & Cons
                  </CardTitle>
                  <CardDescription>
                    Strengths and areas for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground">{insights.prosAndCons}</pre>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(insights.prosAndCons, "Pros & Cons")}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Market Relevance */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Market Relevance
                  </CardTitle>
                  <CardDescription>
                    Market fit and demand analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground">{insights.marketRelevance}</pre>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(insights.marketRelevance, "Market Relevance")}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Future Score */}
              <Card className="border-0 shadow-soft lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
                    Future Score & Predictions
                  </CardTitle>
                  <CardDescription>
                    Growth potential and future outlook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-foreground">{insights.futureScore}</pre>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(insights.futureScore, "Future Score")}
                      className="w-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Predictions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isGenerating && (
          <AILoading 
            text="Analyzing your business and generating insights..."
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          />
        )}
      </div>
    </div>
  );
} 