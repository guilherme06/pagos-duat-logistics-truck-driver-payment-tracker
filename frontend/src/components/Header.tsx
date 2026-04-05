import { UserProfile } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../hooks/useLanguage';
import { useUpdateUserProfile } from '../hooks/useQueries';
import { Language, languageNames } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Moon, Sun, Truck, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface HeaderProps {
  userProfile: UserProfile;
}

export function Header({ userProfile }: HeaderProps) {
  const { clear, identity } = useInternetIdentity();
  const { theme, setTheme } = useTheme();
  const { language, translations: t, setLanguage } = useLanguage();
  const updateProfile = useUpdateUserProfile();
  const [isScrolled, setIsScrolled] = useState(false);
  const userId = identity?.getPrincipal().toString();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    if (!userId) return;
    
    // Update language in local state immediately for instant UI feedback
    setLanguage(newLanguage);
    
    try {
      // Update the user profile in the backend with the new language
      await updateProfile.mutateAsync({
        userId,
        name: userProfile.name,
        companyName: userProfile.companyName,
        salary: userProfile.salary,
        language: newLanguage,
        monthlyGoal: userProfile.monthlyGoal
      });
    } catch (error) {
      // If backend update fails, revert the language change
      setLanguage(language);
      toast.error(t.profileUpdateError);
      console.error('Error updating language in profile:', error);
    }
  };

  return (
    <header className={`
      border-b border-modern-accent/20 header-gradient backdrop-blur-sm sticky top-0 z-50 shadow-modern
      transition-all duration-300 ease-in-out
      ${isScrolled ? 'header-compact' : 'header-expanded'}
    `}>
      <div className="container mx-auto px-4 transition-all duration-300 ease-in-out">
        <div className={`
          flex items-center justify-between transition-all duration-300 ease-in-out
          ${isScrolled ? 'py-2' : 'py-4'}
        `}>
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className={`
              p-3 bg-gradient-to-br from-orange-primary/20 to-orange-secondary/20 rounded-2xl transition-all duration-300 ease-in-out border border-orange-primary/30
              ${isScrolled ? 'scale-75' : 'scale-100'}
            `}>
              <Truck className={`
                text-orange-primary transition-all duration-300 ease-in-out
                ${isScrolled ? 'h-5 w-5' : 'h-7 w-7'}
              `} />
            </div>
            <div className="transition-all duration-300 ease-in-out">
              <h1 className={`
                font-bold text-modern-primary transition-all duration-300 ease-in-out
                ${isScrolled ? 'text-lg' : 'text-2xl'}
              `}>
                {userProfile.companyName}
              </h1>
              <p className={`
                text-modern-secondary font-medium transition-all duration-300 ease-in-out
                ${isScrolled ? 'text-xs opacity-75' : 'text-sm opacity-100'}
              `}>
                {t.paymentSystem}
              </p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size={isScrolled ? "sm" : "sm"}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`
                border-modern-primary/30 hover:border-modern-primary/50 hover:bg-modern-primary/5
                transition-all duration-300 ease-in-out rounded-xl
                ${isScrolled ? 'h-8 w-8 p-0' : 'h-9 w-9 p-0'}
              `}
            >
              {theme === 'dark' ? (
                <Sun className={`
                  text-modern-primary transition-all duration-300 ease-in-out
                  ${isScrolled ? 'h-3 w-3' : 'h-4 w-4'}
                `} />
              ) : (
                <Moon className={`
                  text-modern-primary transition-all duration-300 ease-in-out
                  ${isScrolled ? 'h-3 w-3' : 'h-4 w-4'}
                `} />
              )}
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`
                  relative rounded-2xl hover:bg-modern-primary/10 transition-all duration-300 ease-in-out
                  ${isScrolled ? 'h-9 w-9' : 'h-11 w-11'}
                `}>
                  <Avatar className={`
                    transition-all duration-300 ease-in-out
                    ${isScrolled ? 'h-9 w-9' : 'h-11 w-11'}
                  `}>
                    <AvatarFallback className={`
                      bg-gradient-to-br from-blue-primary to-blue-secondary text-white font-semibold transition-all duration-300 ease-in-out
                      ${isScrolled ? 'text-xs' : 'text-sm'}
                    `}>
                      {getInitials(userProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 shadow-modern-lg rounded-2xl" align="end">
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-modern-primary">{userProfile.name}</p>
                    <p className="text-sm text-modern-secondary">
                      {t.professionalDriver}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                
                {/* Language Selector */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="rounded-xl m-1">
                    <Languages className="mr-2 h-4 w-4" />
                    <span>{languageNames[language]}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="rounded-xl">
                    {Object.entries(languageNames).map(([lang, name]) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => handleLanguageChange(lang as Language)}
                        className={`rounded-lg ${language === lang ? 'bg-modern-primary/10 text-modern-primary' : ''}`}
                        disabled={updateProfile.isPending}
                      >
                        {name}
                        {updateProfile.isPending && language !== lang && (
                          <div className="ml-auto animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clear} className="text-destructive hover:bg-destructive/5 hover:text-destructive rounded-xl m-1">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
