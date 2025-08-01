import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

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

export async function generateWebsite(request: WebsiteGenerationRequest): Promise<WebsiteGenerationResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Analyze business type from description
    const businessType = analyzeBusinessType(request.description);
    const colorScheme = getColorScheme(businessType, request.persona);
    const layoutStyle = getLayoutStyle(request.persona);

    const prompt = `
You are a cutting-edge web designer creating FUTURISTIC, VISUALLY STUNNING websites. Your mission is to generate websites that are both BEAUTIFUL and FULLY FUNCTIONAL with modern, futuristic design elements.

🎨 VISUAL DESIGN REQUIREMENTS - CREATE STUNNING WEBSITES:
- Use GLASSMORPHISM effects with backdrop-blur and transparency
- Implement NEON GLOWS and LIGHTING effects
- Create SMOOTH ANIMATIONS and MICRO-INTERACTIONS
- Use GRADIENT BACKGROUNDS with multiple color stops
- Add FLOATING ELEMENTS and PARALLAX effects
- Include MODERN ICONS and VISUAL ELEMENTS
- Use BOLD TYPOGRAPHY with proper hierarchy
- Implement HOVER EFFECTS and TRANSITIONS
- Add PARTICLE EFFECTS or ANIMATED BACKGROUNDS
- Use SHADOWS and DEPTH for 3D effects

🔧 FUNCTIONAL REQUIREMENTS:
- Create INTERACTIVE NAVIGATION with smooth scrolling
- Add CONTACT FORMS with validation
- Include CALL-TO-ACTION buttons with animations
- Implement RESPONSIVE DESIGN for all devices
- Add LOADING ANIMATIONS and TRANSITIONS
- Include SOCIAL MEDIA LINKS and SHARING
- Create SCROLL-TRIGGERED ANIMATIONS
- Add MOBILE-FRIENDLY interactions

📋 BUSINESS CONTEXT:
Business: "${request.description}"
Type: ${businessType}
Style: ${request.persona}
Colors: ${colorScheme}
Layout: ${layoutStyle}

🎯 WEBSITE STRUCTURE:
1. HERO SECTION: Eye-catching header with animated background, floating elements, and call-to-action
2. ABOUT SECTION: Company story with animated cards and hover effects
3. SERVICES/PRODUCTS: Interactive grid with hover animations
4. FEATURES: Highlight key offerings with icons and animations
5. CONTACT SECTION: Functional contact form with validation
6. FOOTER: Social links and additional information

✨ FUTURISTIC ELEMENTS:
- Glassmorphism cards with backdrop-blur
- Neon glow effects and lighting
- Animated gradients and particles
- Floating navigation and elements
- Smooth scroll animations
- Interactive hover states
- Modern button designs with effects
- Animated backgrounds
- 3D transforms and perspectives
- Micro-interactions throughout

🔮 ADVANCED FEATURES:
- CSS Grid and Flexbox for perfect layouts
- CSS Custom Properties for theming
- Advanced animations with @keyframes
- Responsive design with mobile-first approach
- Accessibility features (ARIA labels, focus states)
- Performance optimizations
- Modern CSS features (clamp, aspect-ratio, etc.)

Return ONLY a valid JSON object:
{
  "html": "<futuristic HTML with glassmorphism, animations, and interactive elements>",
  "css": "<stunning CSS with neon effects, glassmorphism, animations, and modern styling>",
  "title": "Creative Business Name",
  "description": "Futuristic website description"
}

Make this website VISUALLY STUNNING, FUTURISTIC, and FULLY FUNCTIONAL!
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw API response:', text);
    
    // Try to extract JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from API');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    // Validate the response
    if (!parsedResponse.html || !parsedResponse.css || !parsedResponse.title) {
      throw new Error('Incomplete response from API');
    }
    
    return {
      html: parsedResponse.html,
      css: parsedResponse.css,
      title: parsedResponse.title,
      description: parsedResponse.description || "A futuristic website for your business"
    };
  } catch (error) {
    console.error('Error generating website:', error);
    
    // If API fails, return a beautiful fallback website
    return generateFuturisticFallbackWebsite(request);
  }
}

function analyzeBusinessType(description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('bakery') || desc.includes('food') || desc.includes('restaurant') || desc.includes('cafe') || desc.includes('coffee')) {
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
  } else if (desc.includes('art') || desc.includes('design') || desc.includes('creative') || desc.includes('studio')) {
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