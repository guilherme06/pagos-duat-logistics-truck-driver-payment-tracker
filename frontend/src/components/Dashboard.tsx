import { useState } from 'react';
import { UserProfile } from '../backend';
import { useLanguage } from '../hooks/useLanguage';
import { Header } from './Header';
import { MonthlyOverview } from './MonthlyOverview';
import { TripCategories } from './TripCategories';
import { TripLogging } from './TripLogging';
import { OtrosSection } from './OtrosSection';
import { HistorySection } from './HistorySection';
import { ProfileSettings } from './ProfileSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  FolderOpen, 
  Truck, 
  PlusCircle, 
  History, 
  Settings,
  Heart
} from 'lucide-react';

interface DashboardProps {
  userId: string;
  userProfile: UserProfile;
}

export function Dashboard({ userId, userProfile }: DashboardProps) {
  const { translations: t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-primary/5 via-background to-green-primary/5">
      <Header userProfile={userProfile} />
      
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-modern-primary/20">
            <TabsTrigger value="overview" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-orange-primary data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">{t.overview}</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-blue-primary data-[state=active]:text-white">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t.categories}</span>
            </TabsTrigger>
            <TabsTrigger value="trips" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-green-primary data-[state=active]:text-white">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">{t.trips}</span>
            </TabsTrigger>
            <TabsTrigger value="otros" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-orange-secondary data-[state=active]:text-white">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t.others}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-blue-secondary data-[state=active]:text-white">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">{t.history}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-green-secondary data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <MonthlyOverview userId={userId} userProfile={userProfile} />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6 animate-fade-in">
            <TripCategories userId={userId} />
          </TabsContent>

          <TabsContent value="trips" className="space-y-6 animate-fade-in">
            <TripLogging userId={userId} />
          </TabsContent>

          <TabsContent value="otros" className="space-y-6 animate-fade-in">
            <OtrosSection userId={userId} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6 animate-fade-in">
            <HistorySection userId={userId} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <ProfileSettings userId={userId} userProfile={userProfile} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-12 border-modern-primary/20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025. {t.builtWith} <Heart className="inline h-4 w-4 text-red-500 mx-1" /> {t.using} <a href="https://caffeine.ai" className="text-modern-primary hover:underline font-medium">caffeine.ai</a></p>
        </div>
      </footer>
    </div>
  );
}
