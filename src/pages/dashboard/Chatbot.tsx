import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw,
  MessageSquare,
  Brain,
  Zap
} from "lucide-react";
import { GeminiService, ChatMessage } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const [userContext, setUserContext] = useState<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Gemini service
    const service = new GeminiService();
    setGeminiService(service);

    // Get user context from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    
    if (user.id && onboardingData.businessName) {
      setUserContext({ user, onboardingData });
      service.setUserContext(user.id);
    }

    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Hello! I'm your AI business assistant. I can help you with marketing strategies, website copy, business growth ideas, and much more. What can I help you with today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !geminiService || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(inputMessage);
      
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    if (geminiService) {
      geminiService.startNewChat();
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          content: "Hello! I'm your AI business assistant. I can help you with marketing strategies, website copy, business growth ideas, and much more. What can I help you with today?",
          timestamp: new Date()
        }
      ]);
    }
  };

  const suggestedQuestions = [
    "How can I improve my website's conversion rate?",
    "What marketing strategies work best for my business type?",
    "Can you help me write compelling product descriptions?",
    "What should I include in my email newsletter?",
    "How can I optimize my business for local SEO?"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Business Assistant</h1>
          <p className="text-muted-foreground">Get personalized business advice and marketing help</p>
        </div>
        <Button onClick={startNewChat} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Business Assistant</CardTitle>
                  <CardDescription>
                    {userContext ? `Personalized for ${userContext.onboardingData.businessName}` : 'General business advice'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'bot' && (
                            <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.type === 'user' && (
                            <User className="w-4 h-4 mt-1 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your business..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* User Context */}
          {userContext && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  Your Business
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">{userContext.onboardingData.businessName}</p>
                  <p className="text-xs text-muted-foreground">{userContext.onboardingData.businessType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Brand Tone</p>
                  <Badge variant="secondary">{userContext.onboardingData.brandTone}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Goal</p>
                  <p className="text-sm">{userContext.onboardingData.userGoal}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggested Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Quick Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2"
                    onClick={() => setInputMessage(question)}
                  >
                    <MessageSquare className="mr-2 h-3 w-3" />
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                What I Can Help With
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Marketing strategies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Website copy & content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Business growth ideas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Email marketing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>SEO optimization</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}