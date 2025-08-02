-- Supabase Database Schema for BoostlyAI
-- Run this in your Supabase SQL Editor

-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 1. PROFILES TABLE (User Information)
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    bio TEXT,
    phone TEXT,
    company_name TEXT,
    job_title TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. BUSINESS PROFILES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    business_type TEXT, -- 'startup', 'small_business', 'enterprise', 'freelancer'
    industry TEXT, -- 'technology', 'healthcare', 'finance', 'education', 'retail', etc.
    business_description TEXT,
    target_audience TEXT,
    business_goals TEXT,
    website_url TEXT,
    social_media_links JSONB, -- {facebook: url, instagram: url, linkedin: url, twitter: url}
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    business_hours JSONB, -- {monday: "9-5", tuesday: "9-5", etc.}
    services_offered TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. WEBSITES TABLE (AI Generated Websites)
-- ========================================
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    business_name TEXT,
    business_type TEXT,
    industry TEXT,
    target_audience TEXT,
    website_type TEXT, -- 'landing_page', 'portfolio', 'ecommerce', 'blog', 'corporate'
    html_content TEXT NOT NULL,
    css_content TEXT NOT NULL,
    js_content TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    custom_domain TEXT,
    analytics_id TEXT, -- Google Analytics ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. AI INSIGHTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
    business_name TEXT NOT NULL,
    business_description TEXT NOT NULL,
    industry TEXT,
    competitors TEXT,
    seo_analysis TEXT,
    pros_cons TEXT,
    market_relevance TEXT,
    future_score TEXT,
    market_trends TEXT,
    competitive_analysis TEXT,
    growth_opportunities TEXT,
    risk_factors TEXT,
    recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. EMAIL CAMPAIGNS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    campaign_type TEXT DEFAULT 'marketing' CHECK (campaign_type IN ('marketing', 'newsletter', 'promotional', 'welcome', 'abandoned_cart')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipient_count INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2),
    click_rate DECIMAL(5,2),
    bounce_rate DECIMAL(5,2),
    template_id TEXT,
    sender_name TEXT,
    sender_email TEXT,
    reply_to_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. EMAIL RECIPIENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.email_recipients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounce_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. USER SETTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT TRUE,
    newsletter_subscription BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    currency TEXT DEFAULT 'USD',
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. USER ACTIVITY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL, -- 'login', 'website_generated', 'email_sent', 'insight_created', 'profile_updated'
    activity_data JSONB, -- Additional data about the activity
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 9. CONTENT TEMPLATES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.content_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('website', 'email', 'social_media', 'blog')),
    content TEXT NOT NULL,
    variables JSONB, -- Template variables like {{business_name}}, {{industry}}
    is_public BOOLEAN DEFAULT FALSE,
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. ANALYTICS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'page_view', 'click', 'form_submit', 'email_open'
    event_data JSONB,
    session_id TEXT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Business profiles policies
CREATE POLICY "Users can view own business profiles" ON public.business_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profiles" ON public.business_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profiles" ON public.business_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business profiles" ON public.business_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Websites policies
CREATE POLICY "Users can view own websites" ON public.websites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own websites" ON public.websites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own websites" ON public.websites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own websites" ON public.websites
    FOR DELETE USING (auth.uid() = user_id);

-- AI Insights policies
CREATE POLICY "Users can view own insights" ON public.ai_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON public.ai_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON public.ai_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" ON public.ai_insights
    FOR DELETE USING (auth.uid() = user_id);

-- Email campaigns policies
CREATE POLICY "Users can view own campaigns" ON public.email_campaigns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON public.email_campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.email_campaigns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON public.email_campaigns
    FOR DELETE USING (auth.uid() = user_id);

-- Email recipients policies
CREATE POLICY "Users can view own recipients" ON public.email_recipients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.email_campaigns 
            WHERE email_campaigns.id = email_recipients.campaign_id 
            AND email_campaigns.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own recipients" ON public.email_recipients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.email_campaigns 
            WHERE email_campaigns.id = email_recipients.campaign_id 
            AND email_campaigns.user_id = auth.uid()
        )
    );

-- User settings policies
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can view own activity" ON public.user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Content templates policies
CREATE POLICY "Users can view own templates" ON public.content_templates
    FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own templates" ON public.content_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.content_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.content_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_business_profiles_user_id ON public.business_profiles(user_id);
CREATE INDEX idx_business_profiles_business_name ON public.business_profiles(business_name);
CREATE INDEX idx_websites_user_id ON public.websites(user_id);
CREATE INDEX idx_websites_created_at ON public.websites(created_at);
CREATE INDEX idx_websites_business_name ON public.websites(business_name);
CREATE INDEX idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX idx_ai_insights_created_at ON public.ai_insights(created_at);
CREATE INDEX idx_email_campaigns_user_id ON public.email_campaigns(user_id);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX idx_email_campaigns_scheduled_at ON public.email_campaigns(scheduled_at);
CREATE INDEX idx_email_recipients_campaign_id ON public.email_recipients(campaign_id);
CREATE INDEX idx_email_recipients_email ON public.email_recipients(email);
CREATE INDEX idx_email_recipients_status ON public.email_recipients(status);
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX idx_content_templates_user_id ON public.content_templates(user_id);
CREATE INDEX idx_content_templates_type ON public.content_templates(template_type);
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    
    -- Create default user settings
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and settings on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON public.business_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON public.websites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON public.content_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Sample business profile
-- INSERT INTO public.business_profiles (
--     user_id,
--     business_name,
--     business_type,
--     industry,
--     business_description,
--     target_audience,
--     business_goals,
--     contact_email,
--     city,
--     country
-- ) VALUES (
--     'your-user-id-here',
--     'TechStart Solutions',
--     'startup',
--     'technology',
--     'A software development company specializing in web applications',
--     'Small to medium businesses looking for custom software solutions',
--     'Expand client base and increase revenue by 50%',
--     'contact@techstart.com',
--     'San Francisco',
--     'USA'
-- );

-- Sample website
-- INSERT INTO public.websites (
--     user_id,
--     title,
--     description,
--     business_name,
--     business_type,
--     industry,
--     html_content,
--     css_content
-- ) VALUES (
--     'your-user-id-here',
--     'TechStart Solutions - Custom Software Development',
--     'Professional website for a software development company',
--     'TechStart Solutions',
--     'startup',
--     'technology',
--     '<div class="hero"><h1>Welcome to TechStart Solutions</h1></div>',
--     'body { font-family: Arial; } .hero { text-align: center; }'
-- );

-- Sample AI insight
-- INSERT INTO public.ai_insights (
--     user_id,
--     business_name,
--     business_description,
--     industry,
--     competitors,
--     seo_analysis,
--     pros_cons,
--     market_relevance,
--     future_score
-- ) VALUES (
--     'your-user-id-here',
--     'TechStart Solutions',
--     'A software development company specializing in web applications',
--     'technology',
--     'Local software agencies, freelance developers, offshore companies',
--     'Strong potential for local SEO with service-based keywords',
--     'Pros: High demand, scalable business model. Cons: High competition, requires skilled team',
--     'Growing market with increasing digital transformation needs',
--     '8/10 - Strong growth potential in the current market'
-- ); 