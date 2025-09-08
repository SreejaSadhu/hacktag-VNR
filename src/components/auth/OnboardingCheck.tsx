import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface OnboardingCheckProps {
  children: ReactNode;
}

export function OnboardingCheck({ children }: OnboardingCheckProps) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding via localStorage
    const onboardingData = localStorage.getItem('onboardingData');
    const user = localStorage.getItem('user');
    
    if (user && onboardingData) {
      try {
        const userData = JSON.parse(user);
        const onboarding = JSON.parse(onboardingData);
        
        if (userData.id && onboarding.businessName) {
          setHasCompletedOnboarding(true);
          return;
        }
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
    
    setHasCompletedOnboarding(false);
    navigate('/onboarding');
  }, [navigate]);

  if (hasCompletedOnboarding === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Checking onboarding status...</p>
        </div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return null;
  }

  return <>{children}</>;
} 