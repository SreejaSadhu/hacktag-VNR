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
import * as XLSX from 'xlsx';
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<any[]>([]);
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

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON for easier processing
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const emails: string[] = [];
        const previewData: any[] = [];
        
        // Process each row
        jsonData.forEach((row: any, index: number) => {
          if (Array.isArray(row)) {
            // Look for emails in each cell
            row.forEach((cell: any) => {
              if (typeof cell === 'string') {
                const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
                const matches = cell.match(emailRegex);
                if (matches) {
                  emails.push(...matches);
                }
              }
            });
            
            // Create preview data (first 5 rows)
            if (index < 5) {
              previewData.push(row);
            }
          }
        });

        setUploadedEmails(emails);
        setFilePreview(previewData);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
      }
      setIsUploading(false);
    };

    reader.readAsArrayBuffer(file);
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
                 <div className="bg-muted/30 rounded-lg p-6 text-sm">
                   <div className="whitespace-pre-wrap text-foreground font-sans leading-relaxed">{emailContent}</div>
                 </div>
               </div>
             </CardContent>
           </Card>

           {/* Upload Email List Section */}
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
               
               {uploadedFile && (
                 <div className="space-y-3">
                   <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                       <Mail className="w-4 h-4 text-green-600" />
                     </div>
                     <div className="flex-1">
                       <div className="text-sm font-medium text-green-800">
                         {uploadedFile.name}
                       </div>
                       <div className="text-xs text-green-600">
                         {(uploadedFile.size / 1024).toFixed(1)} KB
                       </div>
                     </div>
                   </div>
                   
                                       {uploadedEmails.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Extracted Emails
                        </div>
                        <div className="max-h-48 overflow-y-auto bg-muted/30 rounded-lg p-3">
                          <div className="text-xs font-sans space-y-1">
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
                 </div>
               )}
             </CardContent>
           </Card>
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