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
  Target,
  Upload,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

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
    toast({
      title: "Copied!",
      description: "Email content copied to clipboard.",
    });
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
      setError("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setUploadedFile(file);
    
    // Temporarily disable Excel processing until xlsx is properly installed
    setError("Excel file upload is temporarily disabled. Please enter email addresses manually.");
    setIsUploading(false);
  };

  const handleManualEmailAdd = () => {
    const email = prompt("Enter email address:");
    if (email && email.includes('@')) {
      setUploadedEmails(prev => [...prev, email]);
      toast({
        title: "Email added",
        description: `${email} has been added to your list.`,
      });
    }
  };

  const removeEmail = (index: number) => {
    setUploadedEmails(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Marketing</h1>
          <p className="text-muted-foreground">Create engaging email campaigns with AI</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Campaign
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email Generation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Email Content
              </CardTitle>
              <CardDescription>
                Describe your goal and let AI create compelling email content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">What's your email goal?</Label>
                <Textarea
                  id="goal"
                  placeholder="e.g., Promote our new product launch, Welcome new customers, Share company updates..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !goal.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <AILoading className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Email */}
          {hasGenerated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Email</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleRegenerate}>
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      Copy
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{emailDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <div className="p-3 bg-muted rounded-lg font-medium">
                    {emailSubject}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Content</Label>
                  <div className="p-3 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                    {emailContent}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Email List Management */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email List
              </CardTitle>
              <CardDescription>
                Manage your email subscribers and upload contact lists
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label>Upload Contact List</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload Excel file (.xlsx, .xls) with email addresses
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Manual Add */}
              <div className="space-y-2">
                <Label>Add Email Manually</Label>
                <div className="flex space-x-2">
                  <Input placeholder="Enter email address" disabled />
                  <Button variant="outline" onClick={handleManualEmailAdd}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Email List */}
              <div className="space-y-2">
                <Label>Current List ({uploadedEmails.length} emails)</Label>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {uploadedEmails.map((email, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmail(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {uploadedEmails.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No emails added yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Campaign Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{uploadedEmails.length}</div>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">Sent Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}