import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AILoading } from "@/components/ui/LoadingSpinner";
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Send, 
  Calendar,
  Eye,
  RefreshCw,
  Target,
  TrendingUp
} from "lucide-react";

export default function EmailMarketing() {
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [emailContent, setEmailContent] = useState("");

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated email content
    setEmailContent(`Subject: 🥐 Fresh Baked Goodness Awaits You at Sweet Dreams Bakery!

Hi [First Name],

Hope your week is off to a sweet start! ✨

We've been busy in the kitchen creating something special just for you. This weekend, we're launching our new "Artisan Weekend Collection" featuring:

🥖 Handcrafted sourdough with organic grains
🧁 Seasonal fruit tarts made with local berries  
🍞 Warm cinnamon swirl brioche (limited quantity!)

As one of our valued community members, you get first access before we open to the public on Saturday.

**Your Exclusive Early Bird Offer:**
- 15% off any item from the new collection
- Free coffee with any pastry purchase
- Valid Friday 8am-12pm only

The aroma alone will transport you to pastry heaven! Our baker Sarah has been perfecting these recipes for months, and we can't wait for you to taste the difference that passion and local ingredients make.

Ready to treat yourself? 

[CLAIM YOUR EARLY ACCESS OFFER]

See you soon for some delicious moments!

Warmly,
The Sweet Dreams Team

P.S. Follow us on Instagram @sweetdreamsbakery for behind-the-scenes baking magic! 

---
Sweet Dreams Bakery | 123 Main Street | Portland, OR
Unsubscribe | Update Preferences`);
    
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailContent);
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
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">AI Email Marketing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate compelling marketing emails that convert using advanced AI copywriting.
        </p>
      </div>

      {!hasGenerated ? (
        /* Email Generation Form */
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Define Your Marketing Goal
            </CardTitle>
            <CardDescription>
              Describe what you want to achieve with this email campaign.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="marketingGoal">Campaign Objective</Label>
              <Textarea
                id="marketingGoal"
                placeholder="e.g., Promote our new weekend bakery collection, drive foot traffic this Friday with early bird access, increase weekend sales by 25%..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Be specific about your goals, target audience, and desired actions.
              </p>
            </div>

            {/* Quick Goal Templates */}
            <div className="space-y-3">
              <Label>Quick Templates</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Promote new product launch with limited-time discount",
                  "Re-engage inactive customers with special offer",
                  "Drive traffic to weekend event or sale",
                  "Build customer loyalty with exclusive member perks"
                ].map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 text-left justify-start"
                    onClick={() => setGoal(template)}
                  >
                    <div className="text-sm">{template}</div>
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={!goal.trim() || isGenerating}
              className="w-full h-12 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Email...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Marketing Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Generated Email Preview */
        <div className="space-y-6">
          {/* Email Header */}
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Marketing Email Generated</h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Badge variant="secondary">Promotional</Badge>
                    <span>Generated 2 minutes ago</span>
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      High conversion potential
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleRegenerate} disabled={isGenerating}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <div className="bg-muted/30 rounded-lg p-6 font-mono text-sm">
                    <pre className="whitespace-pre-wrap text-foreground">{emailContent}</pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions & Stats */}
            <div className="space-y-4">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Prediction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Open Rate</span>
                      <span className="font-medium text-success">28-35%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Click Rate</span>
                      <span className="font-medium text-primary">5-8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium text-warning">2-4%</span>
                    </div>
                  </div>
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
                  <Button variant="outline" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Send between 10-11 AM for best open rates</li>
                    <li>• Test subject lines with A/B testing</li>
                    <li>• Include clear call-to-action buttons</li>
                    <li>• Personalize with recipient names</li>
                  </ul>
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