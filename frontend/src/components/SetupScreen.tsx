import { useState } from 'react';
import { useCreateUserProfile } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Euro, Building2, Truck, Target } from 'lucide-react';
import { toast } from 'sonner';

interface SetupScreenProps {
  userId: string;
}

export function SetupScreen({ userId }: SetupScreenProps) {
  const { language, translations: t } = useLanguage();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const createProfile = useCreateUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    try {
      await createProfile.mutateAsync({
        userId,
        name: name.trim(),
        companyName: companyName.trim(),
        salary: BigInt(Math.round(salaryAmount * 100)), // Store as cents
        language,
        monthlyGoal: BigInt(Math.round(goalAmount * 100)) // Store as cents
      });
      toast.success(t.profileUpdated);
    } catch (error) {
      toast.error(t.profileUpdateError);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-primary/5 via-background to-blue-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-orange-primary/20 to-orange-secondary/20 rounded-2xl border border-orange-primary/30">
              <Truck className="h-10 w-10 text-orange-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-modern-primary">{t.setupTitle}</h1>
              <p className="text-sm text-modern-secondary font-medium">{t.paymentSystem}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            {t.setupSubtitle}
          </p>
        </div>

        {/* Setup Form */}
        <Card className="card-modern-blue">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-primary" />
              <span>{t.setupCreateButton}</span>
            </CardTitle>
            <CardDescription>
              {t.setupSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.setupNameLabel}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t.setupNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-base font-semibold text-blue-primary">
                  {t.setupCompanyLabel} *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder={t.setupCompanyPlaceholder}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-10 rounded-xl border-2 border-blue-primary/30 focus:border-blue-primary"
                    required
                  />
                </div>
                <p className="text-sm text-blue-primary font-medium bg-blue-primary/10 p-2 rounded-lg">
                  ✨ Este nombre aparecerá como título principal en toda la aplicación
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">{t.setupSalaryLabel}</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salary"
                    type="number"
                    placeholder={t.setupSalaryPlaceholder}
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="pl-10 rounded-xl"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Puedes modificar esta información más tarde
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyGoal">{t.setupMonthlyGoalLabel}</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="monthlyGoal"
                    type="number"
                    placeholder={t.setupMonthlyGoalPlaceholder}
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value)}
                    className="pl-10 rounded-xl"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.setupMonthlyGoalHelp}
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-primary to-blue-secondary hover:from-blue-primary/90 hover:to-blue-secondary/90 text-white rounded-xl shadow-modern"
                disabled={createProfile.isPending}
                size="lg"
              >
                {createProfile.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t.loading}
                  </>
                ) : (
                  t.setupCreateButton
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Currency Info */}
        <Card className="card-modern-green">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-primary/20 rounded-xl">
                <Euro className="h-6 w-6 text-green-primary" />
              </div>
              <div>
                <p className="font-medium text-green-primary">Moneda: Euro (€)</p>
                <p className="text-sm text-muted-foreground">
                  Todos los pagos se registran en euros
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
