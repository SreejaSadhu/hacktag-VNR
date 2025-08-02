// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          phone: string | null
          company_name: string | null
          job_title: string | null
          location: string | null
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          phone?: string | null
          company_name?: string | null
          job_title?: string | null
          location?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          phone?: string | null
          company_name?: string | null
          job_title?: string | null
          location?: string | null
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: 'café_restaurant' | 'retail_store' | 'design_agency' | 'tech_startup' | 'consulting' | 'healthcare' | 'fitness_wellness' | 'education' | 'real_estate' | 'beauty_salon' | 'other'
          industry: 'food_beverage' | 'retail' | 'creative_services' | 'technology' | 'professional_services' | 'healthcare' | 'health_wellness' | 'education' | 'real_estate' | 'beauty_personal_care' | 'manufacturing' | 'finance' | 'transportation' | 'entertainment' | 'other'
          business_description: string | null
          target_audience: string | null
          business_goals: string | null
          website_url: string | null
          social_media_links: any | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          business_hours: any | null
          services_offered: string[] | null
          brand_tone: 'friendly' | 'professional' | 'bold' | 'minimal'
          user_goal: 'create_website' | 'generate_leads' | 'automate_support' | 'build_awareness' | 'showcase_portfolio' | 'sell_online' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type?: 'café_restaurant' | 'retail_store' | 'design_agency' | 'tech_startup' | 'consulting' | 'healthcare' | 'fitness_wellness' | 'education' | 'real_estate' | 'beauty_salon' | 'other'
          industry?: 'food_beverage' | 'retail' | 'creative_services' | 'technology' | 'professional_services' | 'healthcare' | 'health_wellness' | 'education' | 'real_estate' | 'beauty_personal_care' | 'manufacturing' | 'finance' | 'transportation' | 'entertainment' | 'other'
          business_description?: string | null
          target_audience?: string | null
          business_goals?: string | null
          website_url?: string | null
          social_media_links?: any | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          business_hours?: any | null
          services_offered?: string[] | null
          brand_tone?: 'friendly' | 'professional' | 'bold' | 'minimal'
          user_goal?: 'create_website' | 'generate_leads' | 'automate_support' | 'build_awareness' | 'showcase_portfolio' | 'sell_online' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: 'café_restaurant' | 'retail_store' | 'design_agency' | 'tech_startup' | 'consulting' | 'healthcare' | 'fitness_wellness' | 'education' | 'real_estate' | 'beauty_salon' | 'other'
          industry?: 'food_beverage' | 'retail' | 'creative_services' | 'technology' | 'professional_services' | 'healthcare' | 'health_wellness' | 'education' | 'real_estate' | 'beauty_personal_care' | 'manufacturing' | 'finance' | 'transportation' | 'entertainment' | 'other'
          business_description?: string | null
          target_audience?: string | null
          business_goals?: string | null
          website_url?: string | null
          social_media_links?: any | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          business_hours?: any | null
          services_offered?: string[] | null
          brand_tone?: 'friendly' | 'professional' | 'bold' | 'minimal'
          user_goal?: 'create_website' | 'generate_leads' | 'automate_support' | 'build_awareness' | 'showcase_portfolio' | 'sell_online' | null
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_progress: {
        Row: {
          id: string
          user_id: string
          business_profile_id: string | null
          current_step: number
          total_steps: number
          is_completed: boolean
          completed_at: string | null
          step_data: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_profile_id?: string | null
          current_step?: number
          total_steps?: number
          is_completed?: boolean
          completed_at?: string | null
          step_data?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_profile_id?: string | null
          current_step?: number
          total_steps?: number
          is_completed?: boolean
          completed_at?: string | null
          step_data?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      business_preferences: {
        Row: {
          id: string
          business_profile_id: string
          website_style: string | null
          color_scheme: string | null
          font_preference: string | null
          layout_preference: string | null
          features_priority: any | null
          budget_range: string | null
          timeline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_profile_id: string
          website_style?: string | null
          color_scheme?: string | null
          font_preference?: string | null
          layout_preference?: string | null
          features_priority?: any | null
          budget_range?: string | null
          timeline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_profile_id?: string
          website_style?: string | null
          color_scheme?: string | null
          font_preference?: string | null
          layout_preference?: string | null
          features_priority?: any | null
          budget_range?: string | null
          timeline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      business_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          business_type: 'café_restaurant' | 'retail_store' | 'design_agency' | 'tech_startup' | 'consulting' | 'healthcare' | 'fitness_wellness' | 'education' | 'real_estate' | 'beauty_salon' | 'other' | null
          industry: 'food_beverage' | 'retail' | 'creative_services' | 'technology' | 'professional_services' | 'healthcare' | 'health_wellness' | 'education' | 'real_estate' | 'beauty_personal_care' | 'manufacturing' | 'finance' | 'transportation' | 'entertainment' | 'other' | null
          brand_tone: 'friendly' | 'professional' | 'bold' | 'minimal' | null
          template_data: any
          is_featured: boolean
          is_public: boolean
          created_by: string | null
          usage_count: number
          rating: number | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          business_type?: 'café_restaurant' | 'retail_store' | 'design_agency' | 'tech_startup' | 'consulting' | 'healthcare' | 'fitness_wellness' | 'education' | 'real_estate' | 'beauty_salon' | 'other' | null
          industry?: 'food_beverage' | 'retail' | 'creative_services' | 'technology' | 'professional_services' | 'healthcare' | 'health_wellness' | 'education' | 'real_estate' | 'beauty_personal_care' | 'manufacturing' | 'finance' | 'transportation' | 'entertainment' | 'other' | null
          brand_tone?: 'friendly' | 'professional' | 'bold' | 'minimal' | null
          template_data: any
          is_featured?: boolean
          is_public?: boolean
          created_by?: string | null
          usage_count?: number
          rating?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          business_type?: 'café_restaurant' | 'retail_store' | 'design_agency' | 'tech_startup' | 'consulting' | 'healthcare' | 'fitness_wellness' | 'education' | 'real_estate' | 'beauty_salon' | 'other' | null
          industry?: 'food_beverage' | 'retail' | 'creative_services' | 'technology' | 'professional_services' | 'healthcare' | 'health_wellness' | 'education' | 'real_estate' | 'beauty_personal_care' | 'manufacturing' | 'finance' | 'transportation' | 'entertainment' | 'other' | null
          brand_tone?: 'friendly' | 'professional' | 'bold' | 'minimal' | null
          template_data?: any
          is_featured?: boolean
          is_public?: boolean
          created_by?: string | null
          usage_count?: number
          rating?: number | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      websites: {
        Row: {
          id: string
          user_id: string
          business_profile_id: string | null
          title: string
          description: string | null
          business_name: string | null
          business_type: string | null
          industry: string | null
          target_audience: string | null
          website_type: string | null
          html_content: string
          css_content: string
          js_content: string | null
          is_published: boolean
          published_url: string | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          custom_domain: string | null
          analytics_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_profile_id?: string | null
          title: string
          description?: string | null
          business_name?: string | null
          business_type?: string | null
          industry?: string | null
          target_audience?: string | null
          website_type?: string | null
          html_content: string
          css_content: string
          js_content?: string | null
          is_published?: boolean
          published_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          custom_domain?: string | null
          analytics_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_profile_id?: string | null
          title?: string
          description?: string | null
          business_name?: string | null
          business_type?: string | null
          industry?: string | null
          target_audience?: string | null
          website_type?: string | null
          html_content?: string
          css_content?: string
          js_content?: string | null
          is_published?: boolean
          published_url?: string | null
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          custom_domain?: string | null
          analytics_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_insights: {
        Row: {
          id: string
          user_id: string
          business_profile_id: string | null
          business_name: string
          business_description: string
          industry: string | null
          competitors: string | null
          seo_analysis: string | null
          pros_cons: string | null
          market_relevance: string | null
          future_score: string | null
          market_trends: string | null
          competitive_analysis: string | null
          growth_opportunities: string | null
          risk_factors: string | null
          recommendations: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_profile_id?: string | null
          business_name: string
          business_description: string
          industry?: string | null
          competitors?: string | null
          seo_analysis?: string | null
          pros_cons?: string | null
          market_relevance?: string | null
          future_score?: string | null
          market_trends?: string | null
          competitive_analysis?: string | null
          growth_opportunities?: string | null
          risk_factors?: string | null
          recommendations?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_profile_id?: string | null
          business_name?: string
          business_description?: string
          industry?: string | null
          competitors?: string | null
          seo_analysis?: string | null
          pros_cons?: string | null
          market_relevance?: string | null
          future_score?: string | null
          market_trends?: string | null
          competitive_analysis?: string | null
          growth_opportunities?: string | null
          risk_factors?: string | null
          recommendations?: string | null
          created_at?: string
        }
      }
      email_campaigns: {
        Row: {
          id: string
          user_id: string
          business_profile_id: string | null
          name: string
          subject: string
          content: string
          campaign_type: string
          status: string
          scheduled_at: string | null
          sent_at: string | null
          recipient_count: number
          open_rate: number | null
          click_rate: number | null
          bounce_rate: number | null
          template_id: string | null
          sender_name: string | null
          sender_email: string | null
          reply_to_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_profile_id?: string | null
          name: string
          subject: string
          content: string
          campaign_type?: string
          status?: string
          scheduled_at?: string | null
          sent_at?: string | null
          recipient_count?: number
          open_rate?: number | null
          click_rate?: number | null
          bounce_rate?: number | null
          template_id?: string | null
          sender_name?: string | null
          sender_email?: string | null
          reply_to_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_profile_id?: string | null
          name?: string
          subject?: string
          content?: string
          campaign_type?: string
          status?: string
          scheduled_at?: string | null
          sent_at?: string | null
          recipient_count?: number
          open_rate?: number | null
          click_rate?: number | null
          bounce_rate?: number | null
          template_id?: string | null
          sender_name?: string | null
          sender_email?: string | null
          reply_to_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      email_recipients: {
        Row: {
          id: string
          campaign_id: string
          email: string
          first_name: string | null
          last_name: string | null
          company_name: string | null
          status: string
          sent_at: string | null
          opened_at: string | null
          clicked_at: string | null
          bounce_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          status?: string
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounce_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          status?: string
          sent_at?: string | null
          opened_at?: string | null
          clicked_at?: string | null
          bounce_reason?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: string
          email_notifications: boolean
          push_notifications: boolean
          marketing_emails: boolean
          newsletter_subscription: boolean
          language: string
          timezone: string
          currency: string
          date_format: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          newsletter_subscription?: boolean
          language?: string
          timezone?: string
          currency?: string
          date_format?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          newsletter_subscription?: boolean
          language?: string
          timezone?: string
          currency?: string
          date_format?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_data: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          activity_data?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          activity_data?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      content_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          template_type: string
          content: string
          variables: any | null
          is_public: boolean
          category: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          template_type: string
          content: string
          variables?: any | null
          is_public?: boolean
          category?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          template_type?: string
          content?: string
          variables?: any | null
          is_public?: boolean
          category?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          website_id: string | null
          event_type: string
          event_data: any | null
          session_id: string | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          website_id?: string | null
          event_type: string
          event_data?: any | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          website_id?: string | null
          event_type?: string
          event_data?: any | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row']
export type OnboardingProgress = Database['public']['Tables']['onboarding_progress']['Row']
export type BusinessPreferences = Database['public']['Tables']['business_preferences']['Row']
export type BusinessTemplate = Database['public']['Tables']['business_templates']['Row']
export type Website = Database['public']['Tables']['websites']['Row']
export type AIInsight = Database['public']['Tables']['ai_insights']['Row']
export type EmailCampaign = Database['public']['Tables']['email_campaigns']['Row']
export type EmailRecipient = Database['public']['Tables']['email_recipients']['Row']
export type UserSettings = Database['public']['Tables']['user_settings']['Row']
export type UserActivity = Database['public']['Tables']['user_activity']['Row']
export type ContentTemplate = Database['public']['Tables']['content_templates']['Row']
export type Analytics = Database['public']['Tables']['analytics']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type BusinessProfileInsert = Database['public']['Tables']['business_profiles']['Insert']
export type OnboardingProgressInsert = Database['public']['Tables']['onboarding_progress']['Insert']
export type BusinessPreferencesInsert = Database['public']['Tables']['business_preferences']['Insert']
export type BusinessTemplateInsert = Database['public']['Tables']['business_templates']['Insert']
export type WebsiteInsert = Database['public']['Tables']['websites']['Insert']
export type AIInsightInsert = Database['public']['Tables']['ai_insights']['Insert']
export type EmailCampaignInsert = Database['public']['Tables']['email_campaigns']['Insert']
export type EmailRecipientInsert = Database['public']['Tables']['email_recipients']['Insert']
export type UserSettingsInsert = Database['public']['Tables']['user_settings']['Insert']
export type UserActivityInsert = Database['public']['Tables']['user_activity']['Insert']
export type ContentTemplateInsert = Database['public']['Tables']['content_templates']['Insert']
export type AnalyticsInsert = Database['public']['Tables']['analytics']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type BusinessProfileUpdate = Database['public']['Tables']['business_profiles']['Update']
export type OnboardingProgressUpdate = Database['public']['Tables']['onboarding_progress']['Update']
export type BusinessPreferencesUpdate = Database['public']['Tables']['business_preferences']['Update']
export type BusinessTemplateUpdate = Database['public']['Tables']['business_templates']['Update']
export type WebsiteUpdate = Database['public']['Tables']['websites']['Update']
export type AIInsightUpdate = Database['public']['Tables']['ai_insights']['Update']
export type EmailCampaignUpdate = Database['public']['Tables']['email_campaigns']['Update']
export type EmailRecipientUpdate = Database['public']['Tables']['email_recipients']['Update']
export type UserSettingsUpdate = Database['public']['Tables']['user_settings']['Update']
export type UserActivityUpdate = Database['public']['Tables']['user_activity']['Update']
export type ContentTemplateUpdate = Database['public']['Tables']['content_templates']['Update']
export type AnalyticsUpdate = Database['public']['Tables']['analytics']['Update'] 