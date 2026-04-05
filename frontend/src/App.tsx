import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useUserProfile } from './hooks/useQueries';
import { useLanguage } from './hooks/useLanguage';
import { LoginScreen } from './components/LoginScreen';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { language, setLanguage } = useLanguage();
  const userId = identity?.getPrincipal().toString();
  
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile(userId);

  // Sync language with user profile when available
  useEffect(() => {
    if (userProfile && userProfile.language && userProfile.language !== language) {
      setLanguage(userProfile.language as 'es' | 'pt' | 'en');
    }
  }, [userProfile, language, setLanguage]);

  const { translations: t } = useLanguage();

  // Show login screen if not authenticated
  if (loginStatus === 'idle' || loginStatus === 'logging-in' || !identity) {
    return <LoginScreen />;
  }

  // Show loading while checking profile
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Show setup screen if no profile exists
  if (!userProfile) {
    return <SetupScreen userId={userId!} />;
  }

  // Show main dashboard
  return <Dashboard userId={userId!} userProfile={userProfile} />;
}

export default function AppWithProviders() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
      <Toaster />
    </ThemeProvider>
  );
}
