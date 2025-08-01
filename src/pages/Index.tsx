import { Navbar } from "@/components/layout/Navbar";
import { CTAButton } from "@/components/ui/CTAButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Zap, 
  Globe, 
  Users, 
  BarChart3, 
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Sparkles,
      title: "AI Website Generation",
      description: "Describe your business in one sentence and watch AI create a stunning website instantly."
    },
    {
      icon: Users,
      title: "Influencer Matching",
      description: "Connect with the perfect influencers for your brand with our AI-powered matching system."
    },
    {
      icon: Mail,
      title: "Smart Email Marketing",
      description: "Generate compelling marketing emails that convert using advanced AI copywriting."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Get deep insights into your website performance and user behavior."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Describe",
      description: "Tell us about your business in a simple sentence."
    },
    {
      number: "02", 
      title: "Generate",
      description: "Our AI creates a beautiful, custom website for you."
    },
    {
      number: "03",
      title: "Publish",
      description: "Launch your website with one click and start growing."
    }
  ];

  const templates = [
    {
      name: "Modern Bakery",
      category: "Food & Beverage",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center"
    },
    {
      name: "Tech Startup",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center"
    },
    {
      name: "Creative Portfolio",
      category: "Design",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center"
    },
    {
      name: "Local Restaurant",
      category: "Food & Beverage", 
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Bakery Owner",
      content: "Boostly helped me create a stunning website for my bakery in minutes. Sales increased by 40% in the first month!",
      rating: 5
    },
    {
      name: "Mark Rodriguez",
      role: "Tech Founder",
      content: "The AI-generated website was better than anything I could have designed myself. Simply incredible.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Creative Director",
      content: "I've tried many website builders, but Boostly's AI is on another level. It truly understands your vision.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="landing" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="container relative z-10 px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20" variant="outline">
              ✨ New: AI-Powered Website Builder
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-fade-in-up">
            Say it. Boostly builds it.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Describe your business and watch AI create a stunning, professional website in seconds. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <CTAButton size="lg" className="text-lg px-8 py-4">
                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
              </CTAButton>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to launch your professional website
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful AI features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, grow, and scale your online presence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift border-0 shadow-soft">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Template Previews */}
      <section id="templates" className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Beautiful templates</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-generated designs tailored to your industry and style preferences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <Card key={index} className="overflow-hidden hover-lift border-0 shadow-soft">
                <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${template.image})` }} />
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{template.category}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Influencer Match Explainer */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Find your perfect influencer match</h2>
                <p className="text-xl text-muted-foreground mb-6">
                  Our AI analyzes your brand values, target audience, and goals to connect you with influencers who truly align with your vision.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3" />
                    <span>Smart compatibility scoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3" />
                    <span>Audience analysis and insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3" />
                    <span>Campaign performance prediction</span>
                  </li>
                </ul>
                <CTAButton>
                  Explore Influencer Match
                </CTAButton>
              </div>
              <div className="lg:order-first">
                <div 
                  className="aspect-square rounded-2xl bg-cover bg-center" 
                  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop&crop=center)` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by creators</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their Boostly experience
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto relative">
            <Card className="border-0 shadow-medium">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                  <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                </div>
              </CardContent>
            </Card>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to build your dream website?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who have already launched their websites with Boostly.
          </p>
          <CTAButton size="lg" className="text-lg px-8 py-4">
            Start Building for Free <ArrowRight className="ml-2 w-5 h-5" />
          </CTAButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Boostly</span>
              </div>
              <p className="text-muted-foreground">
                Build beautiful websites with the power of AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 Boostly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
