import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface OnboardingCheckProps {
  children: React.ReactNode;
}

export const OnboardingCheck = ({ children }: OnboardingCheckProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          navigate('/login');
          return;
        }

        // Check if user has a business profile
        const { data: businessProfile, error: profileError } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is expected for new users
          console.error('Business profile check error:', profileError);
        }

        if (businessProfile) {
          setHasCompletedOnboarding(true);
        } else {
          // No business profile found, redirect to onboarding
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Onboarding check error:', error);
        navigate('/onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking your setup...</p>
        </div>
      </div>
    );
  }

  return hasCompletedOnboarding ? <>{children}</> : null;
}; 