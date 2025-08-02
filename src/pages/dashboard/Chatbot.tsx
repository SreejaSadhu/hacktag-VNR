import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Send, 
  User, 
  Clock,
  Bookmark,
  Plus,
  Sparkles,
  MessageSquare,
  Zap,
  Loader2
} from "lucide-react";
import { geminiService, ChatMessage } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/supabase";


export default function Chatbot() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI business assistant powered by Gemini. I can help you with website copy, marketing ideas, business strategies, and more. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const savedPrompts = [
    "Suggest a tagline for my bakery",
    "Write product descriptions for my online store",
    "Create social media captions for my restaurant",
    "Generate blog post ideas for my business",
    "Help me write an About Us page"
  ];

  const chatHistory = [
    {
      id: 1,
      title: "Bakery Marketing Strategy",
      lastMessage: "Great ideas for increasing weekend foot traffic!",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "Website Copy Review",
      lastMessage: "Your homepage copy looks much more engaging now.",
      timestamp: "1 day ago"
    },
    {
      id: 3,
      title: "Social Media Planning",
      lastMessage: "Here's a month's worth of content ideas.",
      timestamp: "3 days ago"
    }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Load user context when component mounts
  useEffect(() => {
    const loadUserContext = async () => {
      try {
        const { user, error } = await getCurrentUser();
        if (user && !error) {
          console.log('🔄 Loading user context for chatbot...');
          await geminiService.setUserContext(user.id);
          console.log('✅ User context loaded successfully');
        }
      } catch (error) {
        console.error('❌ Error loading user context:', error);
      }
    };

    loadUserContext();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get AI response from Gemini
      const aiResponse = await geminiService.sendMessage(inputMessage);
      
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        type: "bot",
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);

      
      // Add error message
      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        type: "bot",
        content: "I apologize, but I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    geminiService.startNewChat();
    setMessages([
      {
        id: 1,
        type: "bot",
        content: "Hello! I'm your AI business assistant powered by Gemini. I can help you with website copy, marketing ideas, business strategies, and more. What would you like to work on today?",
        timestamp: new Date()
      }
    ]);

  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        {/* New Chat */}
        <Button 
          className="w-full bg-gradient-primary hover:opacity-90"
          onClick={handleNewChat}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>

        {/* Saved Prompts */}
        <Card className="border-0 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Bookmark className="w-4 h-4 mr-2" />
              Quick Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full h-auto p-2 text-left justify-start text-sm"
                onClick={() => handlePromptClick(prompt)}
              >
                <Zap className="w-3 h-3 mr-2 text-primary" />
                {prompt}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chat History */}
        <Card className="border-0 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Recent Chats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="font-medium text-sm line-clamp-1">{chat.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {chat.lastMessage}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{chat.timestamp}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 border-0 shadow-soft flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Business Assistant</CardTitle>
                <CardDescription className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2" />
                  Powered by Gemini AI
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    {message.type === "bot" ? (
                      <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about your business..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3" />
              <span>Powered by Gemini AI • Always here to help your business grow</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}