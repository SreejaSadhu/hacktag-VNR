import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Download,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Star
} from "lucide-react";

export default function FeedbackAnalyzer() {
  const [feedback, setFeedback] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (feedback.trim()) {
      setHasAnalyzed(true);
    }
  };

  const sentimentData = {
    positive: 65,
    neutral: 25,
    negative: 10
  };

  const commonThemes = [
    {
      theme: "Food Quality",
      mentions: 34,
      sentiment: "positive",
      keywords: ["delicious", "fresh", "amazing", "quality"]
    },
    {
      theme: "Customer Service",
      mentions: 28,
      sentiment: "positive", 
      keywords: ["friendly", "helpful", "welcoming", "attentive"]
    },
    {
      theme: "Wait Times",
      mentions: 15,
      sentiment: "negative",
      keywords: ["slow", "waiting", "long", "delay"]
    },
    {
      theme: "Atmosphere",
      mentions: 22,
      sentiment: "positive",
      keywords: ["cozy", "warm", "comfortable", "inviting"]
    },
    {
      theme: "Pricing",
      mentions: 18,
      sentiment: "neutral",
      keywords: ["expensive", "value", "price", "cost"]
    }
  ];

  const suggestions = [
    {
      category: "Immediate Actions",
      items: [
        "Address wait time concerns by optimizing kitchen workflow",
        "Consider implementing a queue management system",
        "Train staff on faster order processing techniques"
      ]
    },
    {
      category: "Long-term Improvements",
      items: [
        "Leverage positive food quality feedback in marketing",
        "Highlight customer service excellence in testimonials",
        "Consider expanding seating to reduce wait times"
      ]
    },
    {
      category: "Marketing Opportunities",
      items: [
        "Create social media content around 'cozy atmosphere'",
        "Feature customer testimonials about food quality",
        "Share behind-the-scenes content about fresh ingredients"
      ]
    }
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "negative":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "border-success bg-success/5";
      case "negative":
        return "border-destructive bg-destructive/5";
      default:
        return "border-muted bg-muted/5";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Feedback Analyzer</h1>
        <p className="text-muted-foreground">
          Upload or paste customer reviews to get AI-powered insights and actionable recommendations.
        </p>
      </div>

      {!hasAnalyzed ? (
        /* Input Section */
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Add Customer Feedback
              </CardTitle>
              <CardDescription>
                Upload files or paste reviews, testimonials, and feedback to analyze.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <div className="font-medium mb-1">Upload Files</div>
                    <div className="text-sm text-muted-foreground">
                      CSV, TXT, or Excel files
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <div className="font-medium mb-1">Paste Text</div>
                    <div className="text-sm text-muted-foreground">
                      Copy and paste reviews directly
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Reviews</label>
                <Textarea
                  placeholder="Paste customer reviews, testimonials, or feedback here...

Example:
'The food was absolutely amazing! Fresh ingredients and great service. The wait was a bit long but totally worth it.'

'Love the cozy atmosphere and friendly staff. The prices are a bit high but the quality justifies it.'"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {feedback.length} characters
                </p>
              </div>

              <Button 
                onClick={handleAnalyze}
                disabled={!feedback.trim()}
                className="w-full h-12 bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Results Header */}
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Analysis Complete</h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>47 reviews analyzed</span>
                    <span>•</span>
                    <span>5 key themes identified</span>
                    <span>•</span>
                    <span>Generated 2 minutes ago</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export TXT
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sentiment Analysis */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Sentiment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 text-success mr-1" />
                        Positive
                      </span>
                      <span className="font-medium">{sentimentData.positive}%</span>
                    </div>
                    <Progress value={sentimentData.positive} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <Minus className="w-3 h-3 text-muted-foreground mr-1" />
                        Neutral
                      </span>
                      <span className="font-medium">{sentimentData.neutral}%</span>
                    </div>
                    <Progress value={sentimentData.neutral} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <TrendingDown className="w-3 h-3 text-destructive mr-1" />
                        Negative
                      </span>
                      <span className="font-medium">{sentimentData.negative}%</span>
                    </div>
                    <Progress value={sentimentData.negative} className="h-2" />
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">8.2/10</div>
                    <div className="text-sm text-muted-foreground">Overall Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Themes */}
            <Card className="lg:col-span-2 border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Common Themes
                </CardTitle>
                <CardDescription>
                  Most frequently mentioned topics in customer feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonThemes.map((theme, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getSentimentColor(theme.sentiment)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(theme.sentiment)}
                          <span className="font-medium">{theme.theme}</span>
                        </div>
                        <Badge variant="outline">{theme.mentions} mentions</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {theme.keywords.map((keyword, keyIndex) => (
                          <Badge key={keyIndex} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Actionable insights based on your feedback analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {suggestions.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-lg">{category.category}</h4>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                          <Star className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}