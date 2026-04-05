import { useMemo } from 'react';
import { UserProfile } from '../backend';
import { useTripRecords, useTripCategories, useOtrosEntries } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Euro, TrendingUp, Truck, PlusCircle, Calendar, Target, Trophy, TrendingDown } from 'lucide-react';

interface MonthlyOverviewProps {
  userId: string;
  userProfile: UserProfile;
}

export function MonthlyOverview({ userId, userProfile }: MonthlyOverviewProps) {
  const { data: tripRecords = [] } = useTripRecords(userId);
  const { data: tripCategories = [] } = useTripCategories(userId);
  const { data: otrosEntries = [] } = useOtrosEntries(userId);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter current month data
    const currentMonthTrips = tripRecords.filter(trip => {
      const tripDate = new Date(Number(trip.date) / 1000000); // Convert nanoseconds to milliseconds
      return tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear;
    });

    const currentMonthOtros = otrosEntries.filter(entry => {
      const entryDate = new Date(Number(entry.date) / 1000000);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });

    // Calculate totals
    const salaryAmount = Number(userProfile.salary) / 100; // Convert from cents
    const tripsTotal = currentMonthTrips.reduce((sum, trip) => sum + (Number(trip.amount) / 100), 0);
    const otrosTotal = currentMonthOtros.reduce((sum, entry) => sum + (Number(entry.amount) / 100), 0);
    const totalEarnings = salaryAmount + tripsTotal + otrosTotal;
    
    // Monthly goal calculations
    const monthlyGoal = Number(userProfile.monthlyGoal) / 100;
    const goalProgress = monthlyGoal > 0 ? (totalEarnings / monthlyGoal) * 100 : 0;
    const goalAchieved = totalEarnings >= monthlyGoal;
    const goalExceeded = totalEarnings > monthlyGoal;

    // Category breakdown
    const categoryBreakdown = currentMonthTrips.reduce((acc, trip) => {
      const category = tripCategories.find(cat => cat.id === trip.categoryId);
      const categoryName = category?.name || 'Desconocido';
      const amount = Number(trip.amount) / 100;
      
      if (!acc[categoryName]) {
        acc[categoryName] = { count: 0, total: 0 };
      }
      acc[categoryName].count += 1;
      acc[categoryName].total += amount;
      
      return acc;
    }, {} as Record<string, { count: number; total: number }>);

    return {
      salary: salaryAmount,
      trips: tripsTotal,
      otros: otrosTotal,
      total: totalEarnings,
      tripCount: currentMonthTrips.length,
      otrosCount: currentMonthOtros.length,
      categoryBreakdown,
      monthlyGoal,
      goalProgress,
      goalAchieved,
      goalExceeded
    };
  }, [tripRecords, otrosEntries, userProfile.salary, userProfile.monthlyGoal, tripCategories]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const currentMonthName = new Intl.DateTimeFormat('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const getGoalStatusMessage = () => {
    if (monthlyData.goalExceeded) {
      return "¡Este mes superaste tu meta!";
    } else if (monthlyData.goalAchieved) {
      return "¡Objetivo logrado!";
    } else if (monthlyData.goalProgress > 75) {
      return "Sigue así, vas por buen camino";
    } else if (monthlyData.goalProgress > 50) {
      return "Vas bien, continúa así";
    } else {
      return "Aún puedes alcanzar tu objetivo";
    }
  };

  const getGoalStatusColor = () => {
    if (monthlyData.goalExceeded) {
      return "text-yellow-600";
    } else if (monthlyData.goalAchieved) {
      return "text-green-600";
    } else if (monthlyData.goalProgress > 75) {
      return "text-blue-600";
    } else {
      return "text-orange-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6 text-logistics-primary" />
        <h2 className="text-2xl font-bold capitalize">{currentMonthName}</h2>
      </div>

      {/* Monthly Goal Progress */}
      {monthlyData.monthlyGoal > 0 && (
        <Card className="border-blue-primary/20 bg-blue-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-primary" />
              <span>Objetivo Mensual</span>
              {monthlyData.goalAchieved && (
                <Badge className="bg-green-600 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Logrado
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Progreso hacia tu meta mensual de {formatCurrency(monthlyData.monthlyGoal)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">
                {Math.min(monthlyData.goalProgress, 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(monthlyData.goalProgress, 100)} 
              className="h-3"
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-logistics-primary">
                  {formatCurrency(monthlyData.total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  de {formatCurrency(monthlyData.monthlyGoal)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${getGoalStatusColor()}`}>
                  {getGoalStatusMessage()}
                </p>
                {monthlyData.goalExceeded && (
                  <p className="text-xs text-muted-foreground">
                    Excedente: {formatCurrency(monthlyData.total - monthlyData.monthlyGoal)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-logistics-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salario Base</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-logistics-primary">
              {formatCurrency(monthlyData.salary)}
            </div>
            <p className="text-xs text-muted-foreground">
              Salario mensual fijo
            </p>
          </CardContent>
        </Card>

        <Card className="border-logistics-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viajes</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-logistics-secondary">
              {formatCurrency(monthlyData.trips)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyData.tripCount} viajes realizados
            </p>
          </CardContent>
        </Card>

        <Card className="border-logistics-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Otros</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${monthlyData.otros >= 0 ? 'text-modern-success' : 'text-destructive'}`}>
              {formatCurrency(monthlyData.otros)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlyData.otrosCount} entradas adicionales
            </p>
          </CardContent>
        </Card>

        <Card className="border-logistics-primary/20 bg-logistics-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mensual</CardTitle>
            <TrendingUp className="h-4 w-4 text-logistics-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-logistics-primary">
              {formatCurrency(monthlyData.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresos totales del mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(monthlyData.categoryBreakdown).length > 0 && (
        <Card className="border-logistics-accent/20">
          <CardHeader>
            <CardTitle>Desglose por Categorías</CardTitle>
            <CardDescription>
              Resumen de viajes por categoría este mes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(monthlyData.categoryBreakdown).map(([category, data]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{category}</span>
                    <Badge variant="secondary">{data.count} viajes</Badge>
                  </div>
                  <span className="font-bold text-logistics-primary">
                    {formatCurrency(data.total)}
                  </span>
                </div>
                <Progress 
                  value={(data.total / monthlyData.trips) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {monthlyData.tripCount === 0 && monthlyData.otrosCount === 0 && (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Truck className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay datos este mes</h3>
            <p className="text-muted-foreground mb-4">
              Comienza registrando tus primeros viajes o entradas adicionales
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
