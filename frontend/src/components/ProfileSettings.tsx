import { useState, useEffect } from 'react';
import { UserProfile } from '../backend';
import { useUpdateUserProfile, useUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../hooks/useLanguage';
import { Language, languageNames } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, User, Euro, LogOut, Save, Edit, X, Calendar, Building2, Languages, Target } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSettingsProps {
  userId: string;
  userProfile: UserProfile;
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const { language, translations: t, setLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [effectiveMonth, setEffectiveMonth] = useState('');
  const [effectiveYear, setEffectiveYear] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [originalCompanyName, setOriginalCompanyName] = useState('');
  const [originalSalary, setOriginalSalary] = useState('');
  const [originalMonthlyGoal, setOriginalMonthlyGoal] = useState('');
  const [originalLanguage, setOriginalLanguage] = useState<Language>(language);

  const { clear } = useInternetIdentity();
  const updateProfile = useUpdateUserProfile();
  const { data: currentUserProfile, isLoading } = useUserProfile(userId);

  // Use the latest data from React Query
  const userProfile = currentUserProfile;

  // Update local state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      const salaryValue = (Number(userProfile.salary) / 100).toString();
      const goalValue = (Number(userProfile.monthlyGoal) / 100).toString();
      const userLang = (userProfile.language as Language) || 'es';
      
      setName(userProfile.name);
      setCompanyName(userProfile.companyName);
      setSalary(salaryValue);
      setMonthlyGoal(goalValue);
      setSelectedLanguage(userLang);
      setOriginalName(userProfile.name);
      setOriginalCompanyName(userProfile.companyName);
      setOriginalSalary(salaryValue);
      setOriginalMonthlyGoal(goalValue);
      setOriginalLanguage(userLang);
      
      // Set default effective date to current month/year
      const now = new Date();
      setEffectiveMonth((now.getMonth() + 1).toString().padStart(2, '0'));
      setEffectiveYear(now.getFullYear().toString());
    }
  }, [userProfile]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const calculateAnnualGoal = (monthlyGoal: string) => {
    const monthly = parseFloat(monthlyGoal) || 0;
    return monthly * 12;
  };

  const handleEditClick = () => {
    // Only enable edit mode, do not save anything
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(t.nameRequired);
      return;
    }

    if (!companyName.trim()) {
      toast.error(t.companyNameRequired);
      return;
    }

    const salaryAmount = parseFloat(salary) || 0;
    if (salaryAmount < 0) {
      toast.error(t.salaryPositive);
      return;
    }

    const goalAmount = parseFloat(monthlyGoal) || 0;
    if (goalAmount < 0) {
      toast.error(t.monthlyGoalPositive);
      return;
    }

    if (!effectiveMonth || !effectiveYear) {
      toast.error('Por favor, selecciona la fecha efectiva del salario');
      return;
    }

    try {
      // Update profile with language and monthly goal
      await updateProfile.mutateAsync({
        userId,
        name: name.trim(),
        companyName: companyName.trim(),
        salary: BigInt(Math.round(salaryAmount * 100)),
        language: selectedLanguage,
        monthlyGoal: BigInt(Math.round(goalAmount * 100))
      });
      
      // Update language in the app if it changed
      if (selectedLanguage !== language) {
        setLanguage(selectedLanguage);
      }
      
      // Update original values after successful save
      setOriginalName(name.trim());
      setOriginalCompanyName(companyName.trim());
      setOriginalSalary(salary);
      setOriginalMonthlyGoal(monthlyGoal);
      setOriginalLanguage(selectedLanguage);
      setIsEditing(false);
      
      toast.success(t.profileUpdated);
    } catch (error) {
      toast.error(t.profileUpdateError);
      console.error(error);
    }
  };

  const handleCancel = () => {
    // Restore original values
    setName(originalName);
    setCompanyName(originalCompanyName);
    setSalary(originalSalary);
    setMonthlyGoal(originalMonthlyGoal);
    setSelectedLanguage(originalLanguage);
    const now = new Date();
    setEffectiveMonth((now.getMonth() + 1).toString().padStart(2, '0'));
    setEffectiveYear(now.getFullYear().toString());
    setIsEditing(false);
  };

  // Generate month options based on language
  const getMonthOptions = () => {
    switch (selectedLanguage) {
      case 'pt':
        return [
          { value: '01', label: 'Janeiro' },
          { value: '02', label: 'Fevereiro' },
          { value: '03', label: 'Março' },
          { value: '04', label: 'Abril' },
          { value: '05', label: 'Maio' },
          { value: '06', label: 'Junho' },
          { value: '07', label: 'Julho' },
          { value: '08', label: 'Agosto' },
          { value: '09', label: 'Setembro' },
          { value: '10', label: 'Outubro' },
          { value: '11', label: 'Novembro' },
          { value: '12', label: 'Dezembro' }
        ];
      case 'en':
        return [
          { value: '01', label: 'January' },
          { value: '02', label: 'February' },
          { value: '03', label: 'March' },
          { value: '04', label: 'April' },
          { value: '05', label: 'May' },
          { value: '06', label: 'June' },
          { value: '07', label: 'July' },
          { value: '08', label: 'August' },
          { value: '09', label: 'September' },
          { value: '10', label: 'October' },
          { value: '11', label: 'November' },
          { value: '12', label: 'December' }
        ];
      default: // Spanish
        return [
          { value: '01', label: 'Enero' },
          { value: '02', label: 'Febrero' },
          { value: '03', label: 'Marzo' },
          { value: '04', label: 'Abril' },
          { value: '05', label: 'Mayo' },
          { value: '06', label: 'Junio' },
          { value: '07', label: 'Julio' },
          { value: '08', label: 'Agosto' },
          { value: '09', label: 'Septiembre' },
          { value: '10', label: 'Octubre' },
          { value: '11', label: 'Noviembre' },
          { value: '12', label: 'Diciembre' }
        ];
    }
  };

  // Generate year options (current year and next 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);

  if (isLoading || !userProfile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-logistics-primary" />
          <h2 className="text-2xl font-bold">{t.settings}</h2>
        </div>
        <Card className="border-logistics-accent/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t.loading}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-logistics-primary" />
        <h2 className="text-2xl font-bold">{t.profileTitle}</h2>
      </div>

      {/* Profile Settings */}
      <Card className={`border-logistics-accent/20 transition-all duration-200 ${isEditing ? 'ring-2 ring-logistics-primary/20 border-logistics-primary/30' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{t.profileTitle}</span>
            </div>
            {isEditing && (
              <div className="flex items-center space-x-2 text-sm text-logistics-primary bg-logistics-primary/10 px-3 py-1 rounded-full">
                <Edit className="h-4 w-4" />
                <span>{t.edit}</span>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            {t.profileSubtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profileName">{t.nameLabel}</Label>
              <Input
                id="profileName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className={`transition-all duration-200 ${
                  !isEditing 
                    ? "bg-muted/50 cursor-not-allowed" 
                    : "border-logistics-primary/30 focus:border-logistics-primary"
                }`}
                placeholder={t.setupNamePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileCompanyName">{t.companyNameLabel}</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="profileCompanyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={!isEditing}
                  className={`pl-10 transition-all duration-200 ${
                    !isEditing 
                      ? "bg-muted/50 cursor-not-allowed" 
                      : "border-logistics-primary/30 focus:border-logistics-primary"
                  }`}
                  placeholder={t.setupCompanyPlaceholder}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Este nombre aparece en el encabezado de la aplicación
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileSalary">{t.salaryLabel}</Label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="profileSalary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  disabled={!isEditing}
                  className={`pl-10 transition-all duration-200 ${
                    !isEditing 
                      ? "bg-muted/50 cursor-not-allowed" 
                      : "border-logistics-primary/30 focus:border-logistics-primary"
                  }`}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              {!isEditing && (
                <p className="text-sm text-muted-foreground">
                  Salario actual: {formatCurrency(Number(userProfile.salary))}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileMonthlyGoal">{t.monthlyGoalLabel}</Label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="profileMonthlyGoal"
                  type="number"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  disabled={!isEditing}
                  className={`pl-10 transition-all duration-200 ${
                    !isEditing 
                      ? "bg-muted/50 cursor-not-allowed" 
                      : "border-logistics-primary/30 focus:border-logistics-primary"
                  }`}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {!isEditing && (
                  <p>Objetivo mensual actual: {formatCurrency(Number(userProfile.monthlyGoal))}</p>
                )}
                <p className="font-medium text-blue-primary">
                  {t.annualGoalLabel}: {formatCurrency(calculateAnnualGoal(monthlyGoal) * 100)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileLanguage">{t.languageLabel}</Label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select 
                  value={selectedLanguage} 
                  onValueChange={(value) => setSelectedLanguage(value as Language)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={`pl-10 transition-all duration-200 ${
                    !isEditing 
                      ? "bg-muted/50 cursor-not-allowed" 
                      : "border-logistics-primary/30 focus:border-logistics-primary"
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(languageNames).map(([lang, name]) => (
                      <SelectItem key={lang} value={lang}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha efectiva del nuevo salario</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="effectiveMonth" className="text-sm text-muted-foreground">Mes</Label>
                    <Select value={effectiveMonth} onValueChange={setEffectiveMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {getMonthOptions().map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="effectiveYear" className="text-sm text-muted-foreground">Año</Label>
                    <Select value={effectiveYear} onValueChange={setEffectiveYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona año" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  El nuevo salario será efectivo a partir del mes seleccionado
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Moneda</Label>
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
                <img 
                  src="/assets/generated/euro-icon.png" 
                  alt="Euro" 
                  className="h-5 w-5"
                />
                <span className="font-medium">Euro (€)</span>
                <span className="text-sm text-muted-foreground ml-auto">Por defecto</span>
              </div>
            </div>

            {/* Action Buttons - Positioned at bottom of form */}
            <div className="flex items-center space-x-3 pt-6 border-t border-border/50">
              {!isEditing ? (
                <Button 
                  onClick={handleEditClick} 
                  variant="outline"
                  className="hover:bg-logistics-primary/10 hover:border-logistics-primary/30"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t.editProfileButton}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleSave}
                    disabled={updateProfile.isPending}
                    className="bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-modern-primary"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        {t.loading}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t.saveChangesButton}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={updateProfile.isPending}
                    className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t.cancel}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Acciones de Cuenta</CardTitle>
          <CardDescription>
            Gestiona tu sesión y acceso a la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                {t.logout}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se cerrará tu sesión actual. Tendrás que volver a iniciar sesión para acceder a la aplicación.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive">
                  {t.cancel}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={clear}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {t.logout}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="border-logistics-accent/20 bg-logistics-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/generated/duat-logo.png" 
              alt="Logo" 
              className="h-10 w-10"
            />
            <div>
              <h3 className="font-semibold text-logistics-primary">{userProfile.companyName}</h3>
              <p className="text-sm text-muted-foreground">
                Sistema de seguimiento de pagos para conductores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
