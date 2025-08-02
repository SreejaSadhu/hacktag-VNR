-- Additional Schema for Onboarding and Business Profile Management
-- Run this in your Supabase SQL Editor after the main schema

-- ========================================
-- ENUM TYPES FOR BUSINESS DATA
-- ========================================

-- Create enum for business types
CREATE TYPE business_type_enum AS ENUM (
  'café_restaurant',
  'retail_store',
  'design_agency',
  'tech_startup',
  'consulting',
  'healthcare',
  'fitness_wellness',
  'education',
  'real_estate',
  'beauty_salon',
  'other'
);

-- Create enum for industry categories
CREATE TYPE industry_enum AS ENUM (
  'food_beverage',
  'retail',
  'creative_services',
  'technology',
  'professional_services',
  'healthcare',
  'health_wellness',
  'education',
  'real_estate',
  'beauty_personal_care',
  'manufacturing',
  'finance',
  'transportation',
  'entertainment',
  'other'
);

-- Create enum for brand tones
CREATE TYPE brand_tone_enum AS ENUM (
  'friendly',
  'professional',
  'bold',
  'minimal'
);

-- Create enum for user goals
CREATE TYPE user_goal_enum AS ENUM (
  'create_website',
  'generate_leads',
  'automate_support',
  'build_awareness',
  'showcase_portfolio',
  'sell_online'
);

-- ========================================
-- UPDATE EXISTING TABLES WITH ENUMS
-- ========================================

-- Update business_profiles table to use enums
ALTER TABLE public.business_profiles 
  ALTER COLUMN business_type TYPE business_type_enum USING business_type::business_type_enum,
  ALTER COLUMN industry TYPE industry_enum USING industry::industry_enum;

-- Add brand tone and user goal to business_profiles
ALTER TABLE public.business_profiles 
  ADD COLUMN brand_tone brand_tone_enum DEFAULT 'professional',
  ADD COLUMN user_goal user_goal_enum;

-- ========================================
-- ONBOARDING PROGRESS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 3,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    step_data JSONB, -- Store data for each step
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- BUSINESS PREFERENCES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.business_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_profile_id UUID REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
    website_style TEXT, -- 'modern', 'classic', 'minimal', 'bold'
    color_scheme TEXT, -- 'blue', 'green', 'red', 'purple', 'custom'
    font_preference TEXT, -- 'sans-serif', 'serif', 'monospace'
    layout_preference TEXT, -- 'single-page', 'multi-page', 'landing-page'
    features_priority JSONB, -- ['contact_form', 'blog', 'portfolio', 'ecommerce']
    budget_range TEXT, -- 'low', 'medium', 'high'
    timeline TEXT, -- 'asap', '1_month', '3_months', 'flexible'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- BUSINESS TEMPLATES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.business_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    business_type business_type_enum,
    industry industry_enum,
    brand_tone brand_tone_enum,
    template_data JSONB NOT NULL, -- HTML, CSS, JS content
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ENABLE RLS ON NEW TABLES
-- ========================================
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_templates ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES FOR NEW TABLES
-- ========================================

-- Onboarding progress policies
CREATE POLICY "Users can view own onboarding progress" ON public.onboarding_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding progress" ON public.onboarding_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress" ON public.onboarding_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own onboarding progress" ON public.onboarding_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Business preferences policies
CREATE POLICY "Users can view own business preferences" ON public.business_preferences
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_profiles 
            WHERE business_profiles.id = business_preferences.business_profile_id 
            AND business_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own business preferences" ON public.business_preferences
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.business_profiles 
            WHERE business_profiles.id = business_preferences.business_profile_id 
            AND business_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own business preferences" ON public.business_preferences
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.business_profiles 
            WHERE business_profiles.id = business_preferences.business_profile_id 
            AND business_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own business preferences" ON public.business_preferences
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.business_profiles 
            WHERE business_profiles.id = business_preferences.business_profile_id 
            AND business_profiles.user_id = auth.uid()
        )
    );

-- Business templates policies
CREATE POLICY "Users can view public templates" ON public.business_templates
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can insert own templates" ON public.business_templates
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own templates" ON public.business_templates
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete own templates" ON public.business_templates
    FOR DELETE USING (created_by = auth.uid());

-- ========================================
-- INDEXES FOR NEW TABLES
-- ========================================
CREATE INDEX idx_onboarding_progress_user_id ON public.onboarding_progress(user_id);
CREATE INDEX idx_onboarding_progress_completed ON public.onboarding_progress(is_completed);
CREATE INDEX idx_business_preferences_profile_id ON public.business_preferences(business_profile_id);
CREATE INDEX idx_business_templates_business_type ON public.business_templates(business_type);
CREATE INDEX idx_business_templates_industry ON public.business_templates(industry);
CREATE INDEX idx_business_templates_brand_tone ON public.business_templates(brand_tone);
CREATE INDEX idx_business_templates_featured ON public.business_templates(is_featured);
CREATE INDEX idx_business_templates_rating ON public.business_templates(rating);

-- ========================================
-- TRIGGERS FOR NEW TABLES
-- ========================================

-- Trigger for onboarding_progress updated_at
CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON public.onboarding_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for business_preferences updated_at
CREATE TRIGGER update_business_preferences_updated_at BEFORE UPDATE ON public.business_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for business_templates updated_at
CREATE TRIGGER update_business_templates_updated_at BEFORE UPDATE ON public.business_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FUNCTIONS FOR ONBOARDING
-- ========================================

-- Function to complete onboarding
CREATE OR REPLACE FUNCTION complete_onboarding(
    p_user_id UUID,
    p_business_profile_id UUID,
    p_step_data JSONB
)
RETURNS void AS $$
BEGIN
    -- Update onboarding progress
    INSERT INTO public.onboarding_progress (
        user_id,
        business_profile_id,
        current_step,
        total_steps,
        is_completed,
        completed_at,
        step_data
    ) VALUES (
        p_user_id,
        p_business_profile_id,
        3,
        3,
        TRUE,
        NOW(),
        p_step_data
    )
    ON CONFLICT (user_id) DO UPDATE SET
        business_profile_id = EXCLUDED.business_profile_id,
        current_step = EXCLUDED.current_step,
        is_completed = EXCLUDED.is_completed,
        completed_at = EXCLUDED.completed_at,
        step_data = EXCLUDED.step_data,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get onboarding status
CREATE OR REPLACE FUNCTION get_onboarding_status(p_user_id UUID)
RETURNS TABLE (
    is_completed BOOLEAN,
    current_step INTEGER,
    total_steps INTEGER,
    business_profile_id UUID,
    completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        op.is_completed,
        op.current_step,
        op.total_steps,
        op.business_profile_id,
        op.completed_at
    FROM public.onboarding_progress op
    WHERE op.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- SAMPLE DATA FOR TESTING
-- ========================================

-- Sample business templates
INSERT INTO public.business_templates (name, description, business_type, industry, brand_tone, template_data, is_featured, tags) VALUES
(
    'Modern Restaurant',
    'Clean and modern design for restaurants and cafes',
    'café_restaurant',
    'food_beverage',
    'friendly',
    '{"html": "<div class=\"restaurant-hero\">...</div>", "css": "body { font-family: Arial; }", "js": ""}',
    TRUE,
    ARRAY['restaurant', 'food', 'modern', 'friendly']
),
(
    'Tech Startup Landing',
    'Professional landing page for tech startups',
    'tech_startup',
    'technology',
    'professional',
    '{"html": "<div class=\"tech-hero\">...</div>", "css": "body { font-family: Inter; }", "js": ""}',
    TRUE,
    ARRAY['startup', 'tech', 'professional', 'landing']
),
(
    'Creative Agency Portfolio',
    'Bold and creative design for agencies',
    'design_agency',
    'creative_services',
    'bold',
    '{"html": "<div class=\"agency-hero\">...</div>", "css": "body { font-family: Poppins; }", "js": ""}',
    TRUE,
    ARRAY['agency', 'creative', 'bold', 'portfolio']
);

-- ========================================
-- VIEWS FOR ANALYTICS
-- ========================================

-- View for onboarding analytics
CREATE VIEW onboarding_analytics AS
SELECT 
    bp.business_type,
    bp.industry,
    bp.brand_tone,
    COUNT(*) as completion_count,
    AVG(EXTRACT(EPOCH FROM (op.completed_at - op.created_at))/3600) as avg_completion_hours
FROM public.onboarding_progress op
JOIN public.business_profiles bp ON op.business_profile_id = bp.id
WHERE op.is_completed = TRUE
GROUP BY bp.business_type, bp.industry, bp.brand_tone;

-- View for popular business types
CREATE VIEW popular_business_types AS
SELECT 
    business_type,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM public.business_profiles
GROUP BY business_type
ORDER BY count DESC; 