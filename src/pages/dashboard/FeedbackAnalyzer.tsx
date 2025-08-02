import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  Star,
  Loader2,
  X,
  File,
  AlertCircle
} from "lucide-react";
import { geminiService } from "@/lib/gemini";


interface FeedbackAnalysis {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    overallRating: number;
  };
  themes: Array<{
    theme: string;
    mentions: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
  }>;
  suggestions: Array<{
    category: string;
    items: string[];
  }>;
  summary: string;
}

export default function FeedbackAnalyzer() {
  const [feedback, setFeedback] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'text/plain' || 
      file.type === 'text/csv' || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.csv')
    );
    
    if (validFiles.length !== files.length) {
      
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const analyzeFeedback = async () => {
    if (uploadedFiles.length === 0) {

      return;
    }

    setIsAnalyzing(true);
    setHasAnalyzed(false);

    try {
      // Combine feedback from uploaded files
      let allFeedback = '';
      
      for (const file of uploadedFiles) {
        try {
          const fileContent = await readFileContent(file);
          allFeedback += '\n\n' + fileContent;
        } catch (error) {
          console.error(`Error reading file ${file.name}:`, error);
  
        }
      }

      // Create analysis prompt for Gemini
      const analysisPrompt = `
Analyze the following customer feedback and provide a comprehensive analysis in JSON format. The feedback is:

${allFeedback}

Please provide analysis in this exact JSON format (no markdown formatting, just pure JSON):
{
  "sentiment": {
    "positive": <percentage>,
    "neutral": <percentage>, 
    "negative": <percentage>,
    "overallRating": <rating out of 10>
  },
  "themes": [
    {
      "theme": "<theme name>",
      "mentions": <number of mentions>,
      "sentiment": "<positive|negative|neutral>",
      "keywords": ["<keyword1>", "<keyword2>", ...]
    }
  ],
  "suggestions": [
    {
      "category": "<category name>",
      "items": ["<suggestion1>", "<suggestion2>", ...]
    }
  ],
  "summary": "<brief summary of the analysis>"
}

Focus on:
- Sentiment analysis (positive, neutral, negative percentages)
- Common themes and topics mentioned
- Actionable business recommendations
- Overall customer satisfaction rating
- Key improvement areas

Be specific and provide practical, actionable insights for a business owner. Return ONLY the JSON object, no markdown formatting or additional text.
`;

      const aiResponse = await geminiService.sendMessage(analysisPrompt);
      
      // Extract JSON from the response (handle markdown code blocks)
      let jsonString = aiResponse.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      // Try to find JSON object in the response
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      // Parse the JSON response
      const analysisData = JSON.parse(jsonString);
      setAnalysis(analysisData);
      setHasAnalyzed(true);
      
      
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  const exportAnalysis = (format: 'pdf' | 'txt') => {
    if (!analysis) return;
    
    let content = '';
    if (format === 'txt') {
      content = `Feedback Analysis Report
Generated: ${new Date().toLocaleString()}

SUMMARY:
${analysis.summary}

SENTIMENT ANALYSIS:
- Positive: ${analysis.sentiment.positive}%
- Neutral: ${analysis.sentiment.neutral}%
- Negative: ${analysis.sentiment.negative}%
- Overall Rating: ${analysis.sentiment.overallRating}/10

THEMES:
${analysis.themes.map(theme => 
  `- ${theme.theme} (${theme.mentions} mentions, ${theme.sentiment})
  Keywords: ${theme.keywords.join(', ')}`
).join('\n')}

RECOMMENDATIONS:
${analysis.suggestions.map(category => 
  `${category.category}:
  ${category.items.map(item => `- ${item}`).join('\n  ')}`
).join('\n\n')}`;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-analysis-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Feedback Analyzer</h1>
        <p className="text-muted-foreground">
          Upload customer review files to get AI-powered insights and actionable recommendations.
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
              
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Options */}
              <div className="grid md:grid-cols-1 gap-4">
                <Card 
                  className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CardContent className="p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <div className="font-medium mb-1">Upload Files</div>
                    <div className="text-sm text-muted-foreground">
                      CSV, TXT files supported
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Uploaded Files</label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <File className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}



              <Button 
                onClick={analyzeFeedback}
                disabled={uploadedFiles.length === 0 || isAnalyzing}
                className="w-full h-12 bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Feedback
                  </>
                )}
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
                    <span>{uploadedFiles.reduce((acc, file) => acc + file.size, 0)} characters analyzed</span>
                    <span>•</span>
                    <span>{analysis?.themes.length || 0} key themes identified</span>
                    <span>•</span>
                    <span>Generated just now</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => exportAnalysis('txt')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export TXT
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setHasAnalyzed(false);
                      setAnalysis(null);
                      setUploadedFiles([]);
                    }}
                  >
                    New Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {analysis && (
            <>
              {/* Summary */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{analysis.summary}</p>
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
                          <span className="font-medium">{analysis.sentiment.positive}%</span>
                        </div>
                        <Progress value={analysis.sentiment.positive} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <Minus className="w-3 h-3 text-muted-foreground mr-1" />
                            Neutral
                          </span>
                          <span className="font-medium">{analysis.sentiment.neutral}%</span>
                        </div>
                        <Progress value={analysis.sentiment.neutral} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center">
                            <TrendingDown className="w-3 h-3 text-destructive mr-1" />
                            Negative
                          </span>
                          <span className="font-medium">{analysis.sentiment.negative}%</span>
                        </div>
                        <Progress value={analysis.sentiment.negative} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">{analysis.sentiment.overallRating}/10</div>
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
                      {analysis.themes.map((theme, index) => (
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
                    {analysis.suggestions.map((category, index) => (
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
            </>
          )}
        </div>
      )}
    </div>
  );
}