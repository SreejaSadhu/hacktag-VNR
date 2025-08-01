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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Analyze business type from description
    const businessType = analyzeBusinessType(request.description);
    const colorScheme = getColorScheme(businessType, request.persona);
    const layoutStyle = getLayoutStyle(request.persona);

    console.log('📊 Business Analysis:', { businessType, persona: request.persona, colorScheme });

    const prompt = `
🔮 SYSTEM PROMPT — Futuristic Website Generator

Mission: Design a visually breathtaking, ultra-modern website for the following project:

🧠 Description: ${request.description}
🏢 Business Type: ${businessType}
🧬 Design Personality: ${request.persona}
🎨 Color Palette: ${colorScheme}
📐 Layout Style: ${layoutStyle}

💡 Design Directives
Craft a next-gen website interface that embodies cutting-edge aesthetics and immersive interactivity:

🌌 Futuristic UI: Glassmorphism + vibrant neon lighting

📱 Fully Responsive: Scales flawlessly across all devices

🌀 Elegant Animations: Smooth transitions, hover effects, and kinetic UI

🌈 Gradient Dynamics: Layered backgrounds with floating UI components

🧠 AI-Written Content: Professional, relevant, and context-aware (no lorem ipsum)

🚫 No Placeholders: Every section must be complete, with real content

Return ONLY this JSON format:
{
  "html": "<full futuristic HTML code here>",
  "css": "<beautifully animated, responsive CSS here>",
  "title": "Business Name",
  "description": "A concise, compelling description of the site purpose and style"
}

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
<<<<<<< Updated upstream
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
=======
} 
>>>>>>> Stashed changes
