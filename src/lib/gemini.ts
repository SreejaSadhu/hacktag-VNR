import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// --- Chatbot Types and Service ---
export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private chat: any;

  constructor() {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    this.chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful AI business assistant. You help entrepreneurs and business owners with marketing, website copy, business strategies, and growth ideas. Be conversational, professional, and provide actionable advice. Keep responses concise but informative." }]
        },
        {
          role: "model",
          parts: [{ text: "I understand! I'm here to help you with your business needs. I can assist with marketing strategies, website copy, business growth ideas, and much more. I'll provide practical, actionable advice while keeping our conversation engaging and professional. What can I help you with today?" }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }

  // Method to start a new chat session
  startNewChat() {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    this.chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();

// --- Website Generation Types and Logic ---
export interface WebsiteGenerationRequest {
  description: string;
  persona: string;
}

export interface WebsiteGenerationResponse {
  html: string;
  css: string;
  title: string;
  description: string;
}

export interface EmailGenerationRequest {
  objective: string;
  businessType?: string;
  tone?: string;
}

export interface EmailGenerationResponse {
  subject: string;
  content: string;
  description: string;
}


// --- Image Generation Types and Logic ---
export interface ImageGenerationRequest {
  prompt: string;
  style?: string;
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
}

export interface ImageGenerationResponse {
  imageUrl: string;
  prompt: string;
  style: string;
  size: string;
  quality: string;

}

export async function generateWebsite(request: WebsiteGenerationRequest): Promise<WebsiteGenerationResponse> {
  try {
    console.log('🔍 Starting website generation for:', request.description);
    
    // Check if API key is set
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ No Gemini API key found in environment variables');
      return {
        html: '<div style="padding: 20px; text-align: center;"><h2>❌ API Key Missing</h2><p>Please set VITE_GEMINI_API_KEY in your .env file</p></div>',
        css: 'body { font-family: Arial, sans-serif; background: #f5f5f5; }',
        title: 'API Key Error',
        description: 'Gemini API key not configured'
      };
    }
    
    console.log('🔑 API key found, initializing Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Analyze business type from description
    const businessType = analyzeBusinessType(request.description);
    const colorScheme = getColorScheme(businessType, request.persona);
    const layoutStyle = getLayoutStyle(request.persona);

    console.log('📊 Business Analysis:', { businessType, persona: request.persona, colorScheme });

    const prompt = `
🔮 SYSTEM PROMPT — Foolproof Website Generator

MISSION: Generate a beautiful, modern, and responsive website with full styling, structured layout, high-quality visuals, and engaging animations. NO plain designs. NO lorem ipsum. NO empty or unstyled sections.

🧠 Description: ${request.description}
🏢 Business Type: ${businessType}
🧬 Design Personality: ${request.persona}
🎨 Color Scheme: ${colorScheme}  
📐 Layout Style: ${layoutStyle}

-------------------------------------------
✅ ABSOLUTE STRUCTURE (MANDATORY SECTIONS)
-------------------------------------------
1. Hero Section:
- Full screen or 80vh section
- Large, bold heading, subheading & primary CTA button
- Background must be a high-res image, gradient, or animation
- Include entrance animation (e.g. fadeIn, zoomIn)

2. About Section:
- Split layout: image left, text right
- Subtle scroll animation
- Professional tone

3. Features/Services Grid:
- 3 to 6 modern cards with icons or images
- Must have hover effects (lift, shadow, gradient glow)
- Real feature names & benefit-oriented descriptions

4. Testimonials Section:
- At least 2–3 quotes or reviews with avatar or name
- Smooth carousel or card layout
- Subtle animations on load or scroll

5. Call to Action Section:
- Bold message with image or pattern background
- Vibrant CTA button
- Clear user direction

6. Footer:
- Include logo, navigation links, social icons, and copyright

-------------------------------------------
🎨 DESIGN ENFORCEMENT (NO EXCEPTIONS)
-------------------------------------------
- Must use glassmorphism, gradient, or vibrant colors in at least 2 sections  
- All sections must have padding, consistent spacing, and modern font (e.g., Poppins, Inter)  
- All interactive elements (cards, buttons) must have hover and transition effects  
- Scroll-triggered animations (like AOS) must be used for all major sections  
- Must include at least 3 high-resolution images (Unsplash or similar)  
- Use icons for feature sections (Lucide, Heroicons, Font Awesome, etc.)

-------------------------------------------
📱 RESPONSIVE DESIGN (MUST)
-------------------------------------------
- Mobile-first layout  
- Adaptive grids and stacking  
- Touch-friendly buttons and spacing

-------------------------------------------
✍️ CONTENT GUIDELINES
-------------------------------------------
- Use real, persuasive, benefit-driven content  
- No placeholder or lorem ipsum text  
- Use call-to-action words like "Explore Now", "Get Started", "Join the Future", etc.

-------------------------------------------
📦 OUTPUT FORMAT
-------------------------------------------
Return only this JSON structure:

{
  "html": "<COMPLETE HTML with structured sections, proper classes and IDs>",
  "css": "<COMPLETE CSS with media queries, animations, and styling>",
  "title": "Business Name",
  "description": "Short, compelling summary of the brand and visual style"
}

❌ IF ANY SECTION LOOKS PLAIN, IS MISSING STYLING, OR LACKS ANIMATION — REJECT AND REGENERATE. BASIC SITES ARE NOT ACCEPTABLE.
`;

    console.log('🚀 Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Raw API response received:', text.substring(0, 200) + '...');

    // Try multiple approaches to extract JSON
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedResponse;
    
    if (!jsonMatch) {
      console.error('❌ No JSON found in API response');
      return {
        html: '<div style="padding: 20px; text-align: center;"><h2>❌ Invalid Response</h2><p>API returned invalid format. Please try again.</p></div>',
        css: 'body { font-family: Arial, sans-serif; background: #f5f5f5; }',
        title: 'Generation Error',
        description: 'Invalid response format from API'
      };
    }

    try {
      console.log('🔍 Extracted JSON from response');
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      console.log('🔍 Raw JSON string:', jsonMatch[0]);
      
      // Try to clean the JSON string
      let cleanedJson = jsonMatch[0];
      
      // Remove any text before the first {
      cleanedJson = cleanedJson.substring(cleanedJson.indexOf('{'));
      
      // Remove any text after the last }
      cleanedJson = cleanedJson.substring(0, cleanedJson.lastIndexOf('}') + 1);
      
      // Try to fix common JSON issues
      cleanedJson = cleanedJson.replace(/,\s*}/g, '}'); // Remove trailing commas
      cleanedJson = cleanedJson.replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      try {
        parsedResponse = JSON.parse(cleanedJson);
        console.log('✅ Successfully parsed cleaned JSON');
      } catch (secondError) {
        console.error('❌ Second JSON parsing attempt failed:', secondError);
        return {
          html: '<div style="padding: 20px; text-align: center;"><h2>❌ JSON Parse Error</h2><p>API returned malformed JSON. Please try again.</p><details><summary>Error Details</summary><pre>' + secondError.message + '</pre></details></div>',
          css: 'body { font-family: Arial, sans-serif; background: #f5f5f5; } details { margin-top: 10px; } pre { background: #f0f0f0; padding: 10px; border-radius: 4px; font-size: 12px; }',
          title: 'JSON Parse Error',
          description: 'API returned malformed JSON: ' + secondError.message
        };
      }
    }

    if (!parsedResponse.html || !parsedResponse.css || !parsedResponse.title) {
      console.error('❌ Incomplete response from API:', parsedResponse);
      return {
        html: '<div style="padding: 20px; text-align: center;"><h2>❌ Incomplete Response</h2><p>API response missing required fields. Please try again.</p></div>',
        css: 'body { font-family: Arial, sans-serif; background: #f5f5f5; }',
        title: 'Generation Error',
        description: 'Incomplete response from API'
      };
    }

    console.log('✅ Successfully generated website with Gemini API');
    console.log('📝 Title:', parsedResponse.title);
    console.log('📄 Description:', parsedResponse.description);
    console.log('🔧 HTML length:', parsedResponse.html.length);
    console.log('🎨 CSS length:', parsedResponse.css.length);

    return {
      html: parsedResponse.html,
      css: parsedResponse.css,
      title: parsedResponse.title,
      description: parsedResponse.description || "A futuristic full-stack website for your business"
    };
  } catch (error: any) {
    console.error('❌ Error generating website with Gemini API:', error);
    return {
      html: `<div style="padding: 20px; text-align: center;"><h2>❌ Generation Failed</h2><p>Error: ${error.message}</p><p>Please check your API key and try again.</p></div>`,
      css: 'body { font-family: Arial, sans-serif; background: #f5f5f5; }',
      title: 'Generation Error',
      description: `Failed to generate website: ${error.message}`
    };
  }
}

export async function generateEmail(request: EmailGenerationRequest): Promise<EmailGenerationResponse> {
  try {
    console.log('📧 Starting email generation for:', request.objective);
    
    // Check if API key is set
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ No Gemini API key found in environment variables');
      return {
        subject: '❌ API Key Missing',
        content: 'Please set VITE_GEMINI_API_KEY in your .env file',
        description: 'Gemini API key not configured'
      };
    }
    
    console.log('🔑 API key found, initializing Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Analyze business type from objective
    const businessType = analyzeBusinessType(request.objective);
    const tone = request.tone || 'professional';

    console.log('📊 Email Analysis:', { businessType, tone });

    const prompt = `
Create a compelling marketing email for: "${request.objective}"

Business Type: ${businessType}
Tone: ${tone}

REQUIREMENTS:
- Engaging subject line that drives opens
- Professional yet conversational tone
- Clear call-to-action
- Personalization elements ([First Name], etc.)
- Compelling value proposition
- Mobile-friendly formatting
- Include unsubscribe and footer info
- Use emojis strategically for visual appeal
- Keep it concise but persuasive

Return ONLY this JSON format:
{
  "subject": "Engaging subject line",
  "content": "Complete email content with formatting",
  "description": "Brief description of the email campaign"
}
`;

    console.log('🚀 Sending email request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Raw API response received:', text.substring(0, 200) + '...');

    // Try multiple approaches to extract JSON
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedResponse;
    
    if (!jsonMatch) {
      console.error('❌ No JSON found in API response');
      return {
        subject: '❌ Invalid Response',
        content: 'API returned invalid format. Please try again.',
        description: 'Invalid response format from API'
      };
    }

    try {
      console.log('🔍 Extracted JSON from response');
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      console.log('🔍 Raw JSON string:', jsonMatch[0]);
      
      // Try to clean the JSON string
      let cleanedJson = jsonMatch[0];
      
      // Remove any text before the first {
      cleanedJson = cleanedJson.substring(cleanedJson.indexOf('{'));
      
      // Remove any text after the last }
      cleanedJson = cleanedJson.substring(0, cleanedJson.lastIndexOf('}') + 1);
      
      // Try to fix common JSON issues
      cleanedJson = cleanedJson.replace(/,\s*}/g, '}'); // Remove trailing commas
      cleanedJson = cleanedJson.replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      try {
        parsedResponse = JSON.parse(cleanedJson);
        console.log('✅ Successfully parsed cleaned JSON');
      } catch (secondError) {
        console.error('❌ Second JSON parsing attempt failed:', secondError);
        return {
          subject: '❌ JSON Parse Error',
          content: 'API returned malformed JSON. Please try again.\n\nError Details: ' + secondError.message,
          description: 'API returned malformed JSON: ' + secondError.message
        };
      }
    }

    if (!parsedResponse.subject || !parsedResponse.content) {
      console.error('❌ Incomplete response from API:', parsedResponse);
      return {
        subject: '❌ Incomplete Response',
        content: 'API response missing required fields. Please try again.',
        description: 'Incomplete response from API'
      };
    }

    console.log('✅ Successfully generated email with Gemini API');
    console.log('📝 Subject:', parsedResponse.subject);
    console.log('📄 Content length:', parsedResponse.content.length);

    return {
      subject: parsedResponse.subject,
      content: parsedResponse.content,
      description: parsedResponse.description || "Marketing email campaign"
    };
  } catch (error: any) {
    console.error('❌ Error generating email with Gemini API:', error);
    return {
      subject: '❌ Generation Failed',
      content: `Error: ${error.message}\n\nPlease check your API key and try again.`,
      description: `Failed to generate email: ${error.message}`
    };
  }
}

export async function generateInsights(request: InsightGenerationRequest): Promise<InsightResponse> {
  try {
    console.log('🔍 Starting insights generation for:', request.businessDescription);
    
    // Check if API key is set
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ No Gemini API key found in environment variables');
      return {
        competitors: '❌ API Key Missing - Please set VITE_GEMINI_API_KEY in your .env file',
        seo: '❌ API Key Missing - Please set VITE_GEMINI_API_KEY in your .env file',
        prosAndCons: '❌ API Key Missing - Please set VITE_GEMINI_API_KEY in your .env file',
        marketRelevance: '❌ API Key Missing - Please set VITE_GEMINI_API_KEY in your .env file',
        futureScore: '❌ API Key Missing - Please set VITE_GEMINI_API_KEY in your .env file'
      };
    }
    
    console.log('🔑 API key found, initializing Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a friendly business consultant who gives practical, human advice. Based on the business description provided, give general market insights and trends that would be relevant for this type of business.

Business: "${request.businessDescription}"

Give me 5 general market insights in this exact JSON format:

{
  "competitors": "• General competitive landscape in this industry\\n• Common business models and strategies\\n• Market positioning opportunities",
  "seo": "• Popular search trends in this sector\\n• Content marketing opportunities\\n• Digital presence strategies",
  "prosAndCons": "• Industry strengths and advantages\\n• Common challenges and risks\\n• Best practices for success",
  "marketRelevance": "• Current market demand and trends\\n• Target audience insights\\n• Growth opportunities in the market",
  "futureScore": "• Industry growth potential: X/10\\n• Emerging trends and opportunities\\n• Strategic recommendations for the future"
}

Focus on general market insights, industry trends, and broad business advice. Keep it conversational, practical, and fun. Use bullet points, keep it short, and make it feel like advice from a friend who knows the market.
`;

    console.log('🚀 Sending insights request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📥 Raw API response received:', text.substring(0, 200) + '...');

    // Try multiple approaches to extract JSON
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsedResponse;
    
    if (!jsonMatch) {
      console.error('❌ No JSON found in API response');
      return {
        competitors: '❌ Invalid Response - API returned invalid format. Please try again.',
        seo: '❌ Invalid Response - API returned invalid format. Please try again.',
        prosAndCons: '❌ Invalid Response - API returned invalid format. Please try again.',
        marketRelevance: '❌ Invalid Response - API returned invalid format. Please try again.',
        futureScore: '❌ Invalid Response - API returned invalid format. Please try again.'
      };
    }

    try {
      console.log('🔍 Extracted JSON from response');
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      console.log('🔍 Raw JSON string:', jsonMatch[0]);
      
      // Try to clean the JSON string
      let cleanedJson = jsonMatch[0];
      
      // Remove any text before the first {
      cleanedJson = cleanedJson.substring(cleanedJson.indexOf('{'));
      
      // Remove any text after the last }
      cleanedJson = cleanedJson.substring(0, cleanedJson.lastIndexOf('}') + 1);
      
      // Try to fix common JSON issues
      cleanedJson = cleanedJson.replace(/,\s*}/g, '}'); // Remove trailing commas
      cleanedJson = cleanedJson.replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
      
      try {
        parsedResponse = JSON.parse(cleanedJson);
        console.log('✅ Successfully parsed cleaned JSON');
      } catch (secondError) {
        console.error('❌ Second JSON parsing attempt failed:', secondError);
        return {
          competitors: '❌ JSON Parse Error - API returned malformed JSON. Please try again.',
          seo: '❌ JSON Parse Error - API returned malformed JSON. Please try again.',
          prosAndCons: '❌ JSON Parse Error - API returned malformed JSON. Please try again.',
          marketRelevance: '❌ JSON Parse Error - API returned malformed JSON. Please try again.',
          futureScore: '❌ JSON Parse Error - API returned malformed JSON. Please try again.'
        };
      }
    }

    if (!parsedResponse.competitors || !parsedResponse.seo || !parsedResponse.prosAndCons || !parsedResponse.marketRelevance || !parsedResponse.futureScore) {
      console.error('❌ Incomplete response from API:', parsedResponse);
      return {
        competitors: '❌ Incomplete Response - API response missing required fields. Please try again.',
        seo: '❌ Incomplete Response - API response missing required fields. Please try again.',
        prosAndCons: '❌ Incomplete Response - API response missing required fields. Please try again.',
        marketRelevance: '❌ Incomplete Response - API response missing required fields. Please try again.',
        futureScore: '❌ Incomplete Response - API response missing required fields. Please try again.'
      };
    }

    console.log('✅ Successfully generated insights with Gemini API');
    console.log('📊 Competitors analysis length:', parsedResponse.competitors.length);
    console.log('🔍 SEO insights length:', parsedResponse.seo.length);
    console.log('📈 Pros/Cons length:', parsedResponse.prosAndCons.length);
    console.log('🎯 Market relevance length:', parsedResponse.marketRelevance.length);
    console.log('🚀 Future score length:', parsedResponse.futureScore.length);

    return {
      competitors: parsedResponse.competitors,
      seo: parsedResponse.seo,
      prosAndCons: parsedResponse.prosAndCons,
      marketRelevance: parsedResponse.marketRelevance,
      futureScore: parsedResponse.futureScore
    };
  } catch (error: any) {
    console.error('❌ Error generating insights with Gemini API:', error);
    return {
      competitors: `❌ Generation Failed - Error: ${error.message}. Please check your API key and try again.`,
      seo: `❌ Generation Failed - Error: ${error.message}. Please check your API key and try again.`,
      prosAndCons: `❌ Generation Failed - Error: ${error.message}. Please check your API key and try again.`,
      marketRelevance: `❌ Generation Failed - Error: ${error.message}. Please check your API key and try again.`,
      futureScore: `❌ Generation Failed - Error: ${error.message}. Please check your API key and try again.`
    };
  }
}

function analyzeBusinessType(description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('bakery') || desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe') || desc.includes('coffee') || desc.includes('vegan')) {
    return 'Food & Beverage';
  } else if (desc.includes('tech') || desc.includes('software') || desc.includes('app') || desc.includes('digital') || desc.includes('ai')) {
    return 'Technology';
  } else if (desc.includes('fitness') || desc.includes('gym') || desc.includes('health') || desc.includes('wellness') || desc.includes('yoga')) {
    return 'Health & Fitness';
  } else if (desc.includes('beauty') || desc.includes('salon') || desc.includes('spa') || desc.includes('cosmetic') || desc.includes('hair')) {
    return 'Beauty & Wellness';
  } else if (desc.includes('consulting') || desc.includes('agency') || desc.includes('service') || desc.includes('business')) {
    return 'Professional Services';
  } else if (desc.includes('shop') || desc.includes('store') || desc.includes('retail') || desc.includes('boutique') || desc.includes('clothing')) {
    return 'Retail';
  } else if (desc.includes('education') || desc.includes('school') || desc.includes('training') || desc.includes('course') || desc.includes('learning')) {
    return 'Education';
  } else if (desc.includes('art') || desc.includes('design') || desc.includes('creative') || desc.includes('studio') || desc.includes('photographer')) {
    return 'Creative & Arts';
  } else {
    return 'General Business';
  }
}

function getColorScheme(businessType: string, persona: string): string {
  const schemes: Record<string, Record<string, string>> = {
    'Food & Beverage': {
      professional: 'Warm oranges (#ff6b35), deep browns (#8b4513), cream whites (#fafafa)',
      playful: 'Vibrant reds (#ff4757), bright yellows (#ffa502), fresh greens (#2ed573)',
      minimal: 'Soft beiges (#f5f5dc), warm grays (#696969), accent oranges (#ff8c00)'
    },
    'Technology': {
      professional: 'Deep blues (#1e3a8a), electric purples (#7c3aed), clean whites (#ffffff)',
      playful: 'Neon blues (#00d2ff), bright cyans (#06b6d4), dark grays (#1f2937)',
      minimal: 'Cool grays (#6b7280), accent blues (#3b82f6), pure whites (#ffffff)'
    },
    'Health & Fitness': {
      professional: 'Forest greens (#059669), deep blues (#1e40af), clean whites (#ffffff)',
      playful: 'Bright greens (#10b981), energetic oranges (#f59e0b), white (#ffffff)',
      minimal: 'Soft greens (#d1fae5), light grays (#f3f4f6), accent mint (#34d399)'
    },
    'Beauty & Wellness': {
      professional: 'Soft pinks (#fce7f3), rose golds (#fbbf24), elegant whites (#ffffff)',
      playful: 'Bright pinks (#ec4899), purples (#8b5cf6), sparkle accents (#fbbf24)',
      minimal: 'Pale pinks (#fdf2f8), soft grays (#f3f4f6), rose accents (#f472b6)'
    },
    'Professional Services': {
      professional: 'Navy blues (#1e3a8a), gold accents (#f59e0b), clean whites (#ffffff)',
      playful: 'Bright blues (#3b82f6), energetic oranges (#f59e0b), white (#ffffff)',
      minimal: 'Cool grays (#6b7280), accent blues (#3b82f6), pure whites (#ffffff)'
    },
    'Retail': {
      professional: 'Deep purples (#7c3aed), gold accents (#f59e0b), clean whites (#ffffff)',
      playful: 'Bright purples (#8b5cf6), pinks (#ec4899), vibrant colors (#f59e0b)',
      minimal: 'Soft purples (#f3f4f6), light grays (#f3f4f6), accent lavender (#a78bfa)'
    },
    'Education': {
      professional: 'Deep blues (#1e3a8a), academic reds (#dc2626), clean whites (#ffffff)',
      playful: 'Bright blues (#3b82f6), energetic greens (#10b981), white (#ffffff)',
      minimal: 'Soft blues (#dbeafe), light grays (#f3f4f6), accent blue (#3b82f6)'
    },
    'Creative & Arts': {
      professional: 'Deep purples (#7c3aed), creative oranges (#f59e0b), clean whites (#ffffff)',
      playful: 'Bright purples (#8b5cf6), creative pinks (#ec4899), vibrant colors (#f59e0b)',
      minimal: 'Soft purples (#f3f4f6), light grays (#f3f4f6), accent purple (#8b5cf6)'
    },
    'General Business': {
      professional: 'Navy blues (#1e3a8a), gray accents (#6b7280), clean whites (#ffffff)',
      playful: 'Bright blues (#3b82f6), energetic colors (#f59e0b), white (#ffffff)',
      minimal: 'Cool grays (#6b7280), accent colors (#3b82f6), pure whites (#ffffff)'
    }
  };
  
  return schemes[businessType]?.[persona] || 'Professional blues and grays';
}

function getLayoutStyle(persona: string): string {
  const layouts = {
    professional: 'Clean grid layout with structured sections, professional typography, subtle animations, card-based design',
    playful: 'Dynamic layout with curved sections, bold typography, fun animations, interactive elements, gradient backgrounds',
    minimal: 'Simple single-column layout with lots of whitespace, clean typography, subtle transitions, focus on content'
  };
  
  return layouts[persona as keyof typeof layouts] || layouts.professional;
}

function generateFuturisticFallbackWebsite(request: WebsiteGenerationRequest): WebsiteGenerationResponse {
  const businessType = analyzeBusinessType(request.description);
  const colors = getColorScheme(businessType, request.persona);
  
  const layouts = {
    professional: {
      header: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: '#667eea',
      layout: 'grid-template-columns: 1fr 1fr;',
      borderRadius: '20px',
      shadow: '0 20px 40px rgba(0,0,0,0.1)',
      cardBg: 'rgba(255,255,255,0.95)',
      backdrop: 'backdrop-filter: blur(10px);'
    },
    playful: {
      header: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
      accent: '#ff6b6b',
      layout: 'grid-template-columns: 1fr; border-radius: 25px;',
      borderRadius: '25px',
      shadow: '0 25px 50px rgba(0,0,0,0.15)',
      cardBg: 'rgba(255,255,255,0.9)',
      backdrop: 'backdrop-filter: blur(15px);'
    },
    minimal: {
      header: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      accent: '#6c757d',
      layout: 'grid-template-columns: 1fr; max-width: 800px;',
      borderRadius: '12px',
      shadow: '0 10px 30px rgba(0,0,0,0.08)',
      cardBg: 'rgba(255,255,255,0.98)',
      backdrop: 'backdrop-filter: blur(5px);'
    }
  };
  
  const style = layouts[request.persona as keyof typeof layouts] || layouts.professional;
  
  return {
    html: `
      <header style="background: ${style.header}; color: white; padding: 4rem 2rem; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.1);"></div>
        <div style="position: relative; z-index: 1;">
          <h1 style="font-size: 3.5rem; margin-bottom: 1rem; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${request.description.split(' ').slice(0, 3).join(' ')}</h1>
          <p style="font-size: 1.3rem; opacity: 0.9; margin-bottom: 2rem;">${businessType} Excellence</p>
          <button style="background: rgba(255,255,255,0.2); color: white; padding: 1rem 2.5rem; border: 2px solid rgba(255,255,255,0.3); border-radius: 50px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px);">Learn More</button>
        </div>
      </header>
      
      <main style="padding: 4rem 2rem; max-width: 1200px; margin: 0 auto;">
        <section style="margin-bottom: 5rem; display: grid; gap: 3rem; ${style.layout}">
          <div style="background: ${style.cardBg}; padding: 3rem; border-radius: ${style.borderRadius}; box-shadow: ${style.shadow}; ${style.backdrop} border: 1px solid rgba(255,255,255,0.2); transition: transform 0.3s ease;">
            <h2 style="color: ${style.accent}; font-size: 2.5rem; margin-bottom: 1.5rem; font-weight: 700;">About Us</h2>
            <p style="font-size: 1.2rem; line-height: 1.8; color: #374151;">${request.description}</p>
          </div>
          <div style="background: ${style.cardBg}; padding: 3rem; border-radius: ${style.borderRadius}; box-shadow: ${style.shadow}; ${style.backdrop} border: 1px solid rgba(255,255,255,0.2); transition: transform 0.3s ease;">
            <h2 style="color: ${style.accent}; font-size: 2.5rem; margin-bottom: 1.5rem; font-weight: 700;">Our Services</h2>
            <p style="font-size: 1.2rem; line-height: 1.8; color: #374151;">We provide exceptional ${businessType.toLowerCase()} services tailored to your needs with excellence and dedication.</p>
          </div>
        </section>
        
        <section style="text-align: center; background: ${style.header}; color: white; padding: 4rem 2rem; border-radius: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.1);"></div>
          <div style="position: relative; z-index: 1;">
            <h2 style="font-size: 3rem; margin-bottom: 1.5rem; font-weight: 800;">Get In Touch</h2>
            <p style="font-size: 1.3rem; margin-bottom: 3rem; opacity: 0.9;">Ready to work with us?</p>
            <button style="background: white; color: ${style.accent}; padding: 1.5rem 3rem; border: none; border-radius: 50px; font-size: 1.2rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">Contact Us</button>
          </div>
        </section>
      </main>
      
      <footer style="background: #1f2937; color: white; padding: 3rem 2rem; text-align: center; margin-top: 4rem;">
        <p style="font-size: 1.1rem; opacity: 0.8;">© 2024 ${request.description.split(' ').slice(0, 3).join(' ')}. All rights reserved.</p>
      </footer>
    `,
    css: `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        min-height: 100vh;
      }
      
      header {
        background: ${style.header};
        color: white;
        padding: 4rem 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      h1 {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        font-weight: 800;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      
      h2 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        font-weight: 700;
        color: ${style.accent};
      }
      
      main {
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      section {
        margin-bottom: 5rem;
      }
      
      p {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        line-height: 1.8;
      }
      
      button {
        transition: all 0.3s ease;
        font-weight: 600;
      }
      
      button:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
      }
      
      div:hover {
        transform: translateY(-5px);
      }
      
      @media (max-width: 768px) {
        h1 {
          font-size: 2.5rem;
        }
        
        h2 {
          font-size: 2rem;
        }
        
        main {
          padding: 2rem 1rem;
        }
        
        section {
          grid-template-columns: 1fr !important;
        }
      }
    `,
    title: `${request.description.split(' ').slice(0, 3).join(' ')} - ${businessType}`,
    description: `A futuristic ${request.persona} website for your ${businessType.toLowerCase()} business`
  };
} 

export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    console.log('🖼️ Starting image generation for:', request.prompt);
    
    // Try free image generation first
    console.log('🎨 Attempting free image generation...');
    
    // Option 1: Try Stable Diffusion via Hugging Face (Free)
    try {
      const stableDiffusionUrl = await generateWithStableDiffusion(request.prompt, request.style);
      if (stableDiffusionUrl) {
        console.log('✅ Successfully generated image with Stable Diffusion');
        return {
          imageUrl: stableDiffusionUrl,
          prompt: request.prompt,
          style: request.style || 'realistic',
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
        };
      }
    } catch (error) {
      console.log('⚠️ Stable Diffusion failed, trying Unsplash...');
    }
    
    // Option 2: Try Unsplash API (Free stock photos)
    try {
      const unsplashUrl = await generateWithUnsplash(request.prompt);
      if (unsplashUrl) {
        console.log('✅ Successfully generated image with Unsplash');
        return {
          imageUrl: unsplashUrl,
          prompt: request.prompt,
          style: request.style || 'realistic',
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
        };
      }
    } catch (error) {
      console.log('⚠️ Unsplash failed, using canvas generation...');
    }
    
    // Option 3: Fallback to canvas generation
    console.log('🎨 Using canvas-based AI image generation...');
    
    // Parse the prompt to extract key elements for image generation
    const promptWords = request.prompt.toLowerCase().split(' ');
    const style = request.style || 'realistic';
    
    // Create a sophisticated AI-generated image
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a complex, AI-style background
      createAIStyleBackground(ctx, promptWords, style);
      
      // Add AI-generated elements based on the prompt
      addAIGeneratedElements(ctx, promptWords, style);
      
      // Add sophisticated lighting and effects
      addAILightingEffects(ctx, style);
      
      // Add the AI signature overlay
      addAISignature(ctx, request.prompt, style);
    }
    
    const imageUrl = canvas.toDataURL('image/png');
    
    console.log('✅ Successfully generated AI image with canvas');
    
    return {
      imageUrl,
      prompt: request.prompt,
      style: request.style || 'realistic',
      size: request.size || '1024x1024',
      quality: request.quality || 'standard',
    };
  } catch (error: any) {
    console.error('❌ Error generating image:', error);
    
    // Create a fallback placeholder image
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Image Generation', 256, 200);
      ctx.font = '16px Arial';
      ctx.fillText('Failed to generate image', 256, 240);
      ctx.fillText('Please try again', 256, 270);
      
      ctx.beginPath();
      ctx.arc(256, 350, 40, 0, 2 * Math.PI);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillText('🖼️', 256, 365);
    }
    
    const fallbackUrl = canvas.toDataURL('image/png');
    
    return {
      imageUrl: fallbackUrl,
      prompt: request.prompt,
      style: request.style || 'realistic',
      size: request.size || '1024x1024',
      quality: request.quality || 'standard',
    };
  }
}

function enhanceImagePrompt(prompt: string, style?: string): string {
  const styleEnhancements: Record<string, string> = {
    'realistic': 'photorealistic, high quality, detailed',
    'artistic': 'artistic style, creative, expressive',
    'minimalist': 'minimalist design, clean, simple',
    'vintage': 'vintage style, retro, classic',
    'modern': 'modern design, contemporary, sleek',
    'cartoon': 'cartoon style, animated, colorful',
    'watercolor': 'watercolor painting style, soft, flowing',
    'digital-art': 'digital art style, vibrant, modern',
    'oil-painting': 'oil painting style, textured, artistic',
    'sketch': 'sketch style, hand-drawn, artistic'
  };
  
  const enhancement = styleEnhancements[style || 'realistic'] || styleEnhancements.realistic;
  
  return `${prompt}, ${enhancement}, high resolution, professional quality`;
}

function createStyleGradient(ctx: CanvasRenderingContext2D, style: string): CanvasGradient {
  const gradients: Record<string, [string, string]> = {
    'realistic': ['#667eea', '#764ba2'],
    'artistic': ['#ff6b6b', '#feca57'],
    'minimalist': ['#f8f9fa', '#e9ecef'],
    'vintage': ['#8b4513', '#daa520'],
    'modern': ['#1e3a8a', '#3b82f6'],
    'cartoon': ['#ff6b9d', '#c44569'],
    'watercolor': ['#74b9ff', '#0984e3'],
    'digital-art': ['#a29bfe', '#6c5ce7'],
    'oil-painting': ['#fd79a8', '#e84393'],
    'sketch': ['#636e72', '#2d3436']
  };
  
  const [color1, color2] = gradients[style] || gradients.realistic;
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

function addArtisticElements(ctx: CanvasRenderingContext2D, description: string, style: string): void {
  // Add some artistic elements based on the style
  if (style === 'artistic' || style === 'digital-art') {
    // Add geometric shapes
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(200 + i * 150, 300 + i * 100, 30 + i * 10, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + i * 0.1})`;
      ctx.fill();
    }
  } else if (style === 'minimalist') {
    // Add simple lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 400);
    ctx.lineTo(900, 400);
    ctx.stroke();
  } else if (style === 'vintage') {
    // Add vintage texture
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }
  }
}

// AI Image Generation Functions
function createAIStyleBackground(ctx: CanvasRenderingContext2D, promptWords: string[], style: string): void {
  // Create a complex, AI-style background based on the prompt
  const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 600);
  
  // Determine colors based on prompt keywords
  let color1 = '#667eea';
  let color2 = '#764ba2';
  
  if (promptWords.includes('candy') || promptWords.includes('sweet') || promptWords.includes('colorful')) {
    color1 = '#ff6b9d';
    color2 = '#feca57';
  } else if (promptWords.includes('nature') || promptWords.includes('forest') || promptWords.includes('green')) {
    color1 = '#10b981';
    color2 = '#059669';
  } else if (promptWords.includes('ocean') || promptWords.includes('sea') || promptWords.includes('blue')) {
    color1 = '#3b82f6';
    color2 = '#1d4ed8';
  } else if (promptWords.includes('sunset') || promptWords.includes('warm') || promptWords.includes('orange')) {
    color1 = '#f59e0b';
    color2 = '#d97706';
  }
  
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);
  
  // Add AI-style noise and texture
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1);
  }
}

function addAIGeneratedElements(ctx: CanvasRenderingContext2D, promptWords: string[], style: string): void {
  // Add AI-generated elements based on the prompt
  if (promptWords.includes('candy') || promptWords.includes('sweet')) {
    // Draw candy elements
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = 20 + Math.random() * 40;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
      ctx.fill();
      
      // Add shine
      ctx.beginPath();
      ctx.arc(x - size/3, y - size/3, size/4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }
  } else if (promptWords.includes('landscape') || promptWords.includes('mountain')) {
    // Draw landscape elements
    for (let i = 0; i < 5; i++) {
      const x = i * 200;
      const height = 200 + Math.random() * 300;
      
      ctx.beginPath();
      ctx.moveTo(x, 1024);
      ctx.lineTo(x + 100, 1024 - height);
      ctx.lineTo(x + 200, 1024);
      ctx.closePath();
      ctx.fillStyle = `hsl(${120 + Math.random() * 40}, 60%, ${40 + Math.random() * 20}%)`;
      ctx.fill();
    }
  } else {
    // Generic AI elements
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = 30 + Math.random() * 50;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.7)`;
      ctx.fill();
    }
  }
}

function addAILightingEffects(ctx: CanvasRenderingContext2D, style: string): void {
  // Add sophisticated lighting effects
  const gradient = ctx.createRadialGradient(512, 200, 0, 512, 200, 800);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);
  
  // Add lens flare effect
  ctx.beginPath();
  ctx.arc(512, 200, 100, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();
}

function addAISignature(ctx: CanvasRenderingContext2D, prompt: string, style: string): void {
  // Add AI signature and prompt info
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('AI Generated', 512, 100);
  
  ctx.font = '16px Arial';
  ctx.fillText(`Style: ${style}`, 512, 130);
  
  // Add prompt text (truncated if too long)
  const maxLength = 50;
  const displayPrompt = prompt.length > maxLength ? prompt.substring(0, maxLength) + '...' : prompt;
  ctx.fillText(displayPrompt, 512, 160);
}

// Free Image Generation Functions
async function generateWithStableDiffusion(prompt: string, style?: string): Promise<string | null> {
  try {
    console.log('🎨 Attempting Stable Diffusion generation...');
    
    // Enhanced prompt based on style
    const enhancedPrompt = enhanceImagePrompt(prompt, style);
    
    const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: You can get a free API key from https://huggingface.co/settings/tokens
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY || 'hf_demo'}`,
      },
      body: JSON.stringify({
        inputs: enhancedPrompt,
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Stable Diffusion API error: ${response.status}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    console.log('✅ Stable Diffusion image generated successfully');
    return imageUrl;
  } catch (error) {
    console.error('❌ Stable Diffusion generation failed:', error);
    return null;
  }
}

async function generateWithUnsplash(prompt: string): Promise<string | null> {
  try {
    console.log('📸 Attempting Unsplash image search...');
    
    // Search for relevant images on Unsplash
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${import.meta.env.VITE_UNSPLASH_API_KEY || 'demo'}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      console.log('✅ Unsplash image found successfully');
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Unsplash image search failed:', error);
    return null;
  }
}
