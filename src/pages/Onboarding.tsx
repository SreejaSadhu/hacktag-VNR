import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Building2, Target, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  businessName: string;
  topOfferings: string[];
  businessType: string;
  userGoal: string;
  brandTone: 'friendly' | 'professional' | 'bold' | 'minimal';
}

const businessTypes = [
  "Café & Restaurant",
  "Retail Store",
  "Design Agency",
  "Tech Startup",
  "Consulting",
  "Healthcare",
  "Fitness & Wellness",
  "Education",
  "Real Estate",
  "Beauty & Salon",
  "Other"
];

const userGoals = [
  "Create a professional website",
  "Generate leads and sales",
  "Automate customer support",
  "Build brand awareness",
  "Showcase portfolio/work",
  "Sell products online"
];

const brandTones = [
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'professional', label: 'Professional', description: 'Trustworthy and reliable' },
  { value: 'bold', label: 'Bold', description: 'Confident and energetic' },
  { value: 'minimal', label: 'Minimal', description: 'Clean and simple' }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: '',
    topOfferings: ['', '', ''],
    businessType: '',
    userGoal: '',
    brandTone: 'professional'
  });
  const [newOffering, setNewOffering] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalSteps = 3;

  const updateOnboardingData = (field: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const addOffering = () => {
    if (newOffering.trim() && onboardingData.topOfferings.length < 5) {
      updateOnboardingData('topOfferings', [...onboardingData.topOfferings, newOffering.trim()]);
      setNewOffering('');
    }
  };

  const removeOffering = (index: number) => {
    const updatedOfferings = onboardingData.topOfferings.filter((_, i) => i !== index);
    updateOnboardingData('topOfferings', updatedOfferings);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store onboarding data in localStorage for demo
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      
      toast({
        title: "Onboarding Complete!",
        description: "Your business profile has been saved successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your business profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.businessName.trim() !== '';
      case 2:
        return onboardingData.topOfferings.some(offering => offering.trim() !== '') && 
               onboardingData.businessType !== '';
      case 3:
        return onboardingData.userGoal !== '';
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Building2 className="w-12 h-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Tell us about your business</h3>
        <p className="text-muted-foreground">Let's start with the basics</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="e.g., Sweet Dreams Bakery"
            value={onboardingData.businessName}
            onChange={(e) => updateOnboardingData('businessName', e.target.value)}
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Business Type *</Label>
          <Select value={onboardingData.businessType} onValueChange={(value) => updateOnboardingData('businessType', value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Target className="w-12 h-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">What do you offer?</h3>
        <p className="text-muted-foreground">List your top products or services</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Top Offerings *</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Custom Cakes"
              value={newOffering}
              onChange={(e) => setNewOffering(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addOffering()}
              className="h-11"
            />
            <Button 
              type="button" 
              onClick={addOffering}
              disabled={!newOffering.trim() || onboardingData.topOfferings.length >= 5}
              className="h-11"
            >
              Add
            </Button>
          </div>
        </div>
        
        {onboardingData.topOfferings.length > 0 && (
          <div className="space-y-2">
            <Label>Your Offerings</Label>
            <div className="flex flex-wrap gap-2">
              {onboardingData.topOfferings.map((offering, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {offering}
                  <button
                    type="button"
                    onClick={() => removeOffering(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Palette className="w-12 h-12 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">What's your main goal?</h3>
        <p className="text-muted-foreground">Help us personalize your experience</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Primary Goal *</Label>
          <Select value={onboardingData.userGoal} onValueChange={(value) => updateOnboardingData('userGoal', value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select your main goal" />
            </SelectTrigger>
            <SelectContent>
              {userGoals.map((goal) => (
                <SelectItem key={goal} value={goal}>{goal}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Brand Tone</Label>
          <div className="grid grid-cols-2 gap-3">
            {brandTones.map((tone) => (
              <div
                key={tone.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  onboardingData.brandTone === tone.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => updateOnboardingData('brandTone', tone.value)}
              >
                <div className="font-medium">{tone.label}</div>
                <div className="text-sm text-muted-foreground">{tone.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-large border-0">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription>Help us personalize your AI experience</CardDescription>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderCurrentStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="bg-gradient-primary hover:opacity-90"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 