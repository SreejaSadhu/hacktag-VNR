import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Palette,
  Upload,
  HardDrive,
  Zap,
  Crown
} from "lucide-react";

export default function Settings() {
  const [selectedTheme, setSelectedTheme] = useState("pastel");

  const themes = [
    {
      id: "pastel",
      name: "Pastel",
      description: "Soft and calming colors",
      colors: ["#E8D5E8", "#D5E8E8", "#E8E8D5"]
    },
    {
      id: "mint",
      name: "Mint",
      description: "Fresh green tones",
      colors: ["#B8E6B8", "#98E4E4", "#B8E6E6"]
    },
    {
      id: "maroon",
      name: "Maroon", 
      description: "Rich and sophisticated",
      colors: ["#D2B8B8", "#B8A0A0", "#A08888"]
    }
  ];

  const planFeatures = {
    free: [
      "3 websites",
      "Basic templates",
      "5GB storage",
      "Email support"
    ],
    pro: [
      "Unlimited websites",
      "Premium templates",
      "50GB storage",
      "Priority support",
      "Advanced analytics",
      "Custom domains"
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and subscription settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Sweet Dreams Bakery" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="Passionate baker and entrepreneur" />
              </div>
              <Button className="bg-gradient-primary hover:opacity-90">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          {/* Current Plan */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">Free Plan</h3>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">$0</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Usage */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="w-5 h-5 mr-2" />
                Storage Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Used Storage</span>
                  <span>2.4 GB of 5 GB</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Websites</div>
                  <div className="text-muted-foreground">1.8 GB</div>
                </div>
                <div>
                  <div className="font-medium">Images</div>
                  <div className="text-muted-foreground">0.4 GB</div>
                </div>
                <div>
                  <div className="font-medium">Other</div>
                  <div className="text-muted-foreground">0.2 GB</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  title: "Email Notifications",
                  description: "Receive updates about your websites and campaigns",
                  enabled: true
                },
                {
                  title: "Marketing Updates",
                  description: "Get tips and insights to grow your business",
                  enabled: true
                },
                {
                  title: "Website Analytics",
                  description: "Weekly reports on your website performance",
                  enabled: false
                },
                {
                  title: "Community Updates",
                  description: "Notifications about new community posts and features",
                  enabled: true
                },
                {
                  title: "Security Alerts",
                  description: "Important security and account notifications",
                  enabled: true
                }
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.description}</div>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Theme Selection
              </CardTitle>
              <CardDescription>
                Choose your preferred color scheme for the interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTheme === theme.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className="flex space-x-2 mb-3">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-sm text-muted-foreground">{theme.description}</div>
                  </div>
                ))}
              </div>
              <Button className="bg-gradient-primary hover:opacity-90">
                Apply Theme
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button variant="outline">
                Update Password
              </Button>

              <div className="pt-6 border-t">
                <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">Enable 2FA</div>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="pt-6 border-t">
                <h4 className="font-medium mb-4">Account Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Download Account Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}