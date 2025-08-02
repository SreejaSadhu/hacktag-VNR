import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AILoading } from "@/components/ui/LoadingSpinner";

import { generateEmail, EmailGenerationResponse } from "@/lib/gemini";
import { 
  Mail, 
  Sparkles, 
  Send, 
  Calendar,
  Target
} from "lucide-react";

export default function EmailMarketing() {
  const [goal, setGoal] = useState("");
  const [emailType, setEmailType] = useState<'draft' | 'newsletter'>('draft');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailDescription, setEmailDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploadedEmails, setUploadedEmails] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);


  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateEmail({
        objective: goal.trim(),
        emailType: emailType
      });
      
      // Check if the result contains an error message
      if (result.subject.startsWith('❌')) {
        setError(result.description);

      } else {
        setEmailSubject(result.subject);
        setEmailContent(result.content);
        setEmailDescription(result.description);
        setHasGenerated(true);

      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate email";
      setError(errorMessage);

    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const fullEmail = `Subject: ${emailSubject}\n\n${emailContent}`;
    navigator.clipboard.writeText(fullEmail);

  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Check if it's an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // For now, we'll parse as CSV-like format
        // In a real implementation, you'd use the xlsx library
        const lines = text.split('\n');
        const emails: string[] = [];
        
        lines.forEach(line => {
          // Simple email extraction - look for email patterns
          const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
          const matches = line.match(emailRegex);
          if (matches) {
            emails.push(...matches);
          }
        });

        if (emails.length === 0) {

        } else {
          setUploadedEmails(emails);

        }
      } catch (error) {

      }
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">AI Email Marketing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <Target className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasGenerated ? (
        /* Email Generation Form */
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Define Your {emailType === 'draft' ? 'Email Draft' : 'Newsletter'} Goal
            </CardTitle>
            <CardDescription>
              Describe what you want to achieve with this {emailType === 'draft' ? 'email draft' : 'newsletter'}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="marketingGoal">
                {emailType === 'draft' ? 'Email Purpose' : 'Newsletter Content'}
              </Label>
              <Textarea
                id="marketingGoal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
                className="resize-none"
                placeholder={
                  emailType === 'draft' 
                    ? "e.g., I need to send a professional email to a client about project updates and next steps..."
                    : "e.g., I want to create a monthly newsletter for my bakery customers with recipes, tips, and special offers..."
                }
              />
              <p className="text-xs text-muted-foreground">
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailType">Email Type</Label>
              <Select value={emailType} onValueChange={(value: 'draft' | 'newsletter') => setEmailType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Email Draft</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the type of email you want to generate
              </p>
            </div>


            <Button 
              onClick={handleGenerate}
              disabled={!goal.trim() || isGenerating}
              className="w-full h-12 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating {emailType === 'draft' ? 'Email Draft' : 'Newsletter'}...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate {emailType === 'draft' ? 'Email Draft' : 'Newsletter'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Generated Email Preview */
        <div className="space-y-6">


          {/* Email Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Subject Line:</div>
                      <div className="text-foreground font-medium">{emailSubject}</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm">
                      <pre className="whitespace-pre-wrap text-foreground">{emailContent}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="space-y-4">

              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Email List</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload" className="text-sm font-medium">
                      Upload your .xlsx file
                    </Label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Choose File
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {uploadedEmails.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Found {uploadedEmails.length} emails
                      </div>
                      <div className="max-h-32 overflow-y-auto bg-muted/30 rounded-lg p-3">
                        <div className="text-xs font-mono space-y-1">
                          {uploadedEmails.slice(0, 10).map((email, index) => (
                            <div key={index} className="text-muted-foreground">
                              {email}
                            </div>
                          ))}
                          {uploadedEmails.length > 10 && (
                            <div className="text-muted-foreground">
                              ... and {uploadedEmails.length - 10} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-primary hover:opacity-90">
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Campaign
                  </Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <AILoading 
          text="Crafting your perfect marketing email..."
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        />
      )}
    </div>
  );
}