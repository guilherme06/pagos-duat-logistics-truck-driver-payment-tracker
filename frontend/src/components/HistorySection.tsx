import { useMemo, useState } from 'react';
import { useTripRecords, useTripCategories, useOtrosEntries, useRandomPositivePhrase, useMonthlyBreakdown } from '../hooks/useQueries';
import { useUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { History, Download, Calendar, Truck, PlusCircle, TrendingUp, TrendingDown, Image as ImageIcon, Share2, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { generateMonthlySummaryImage, downloadImage, shareImage } from '../lib/imageGenerator';
import { useLanguage } from '../hooks/useLanguage';

interface HistorySectionProps {
  userId: string;
}

export function HistorySection({ userId }: HistorySectionProps) {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const { translations } = useLanguage();
  const { data: tripRecords = [] } = useTripRecords(userId);
  const { data: tripCategories = [] } = useTripCategories(userId);
  const { data: otrosEntries = [] } = useOtrosEntries(userId);
  const { data: userProfile } = useUserProfile(userId);
  const { data: randomPhrase } = useRandomPositivePhrase();

  // Calculate month for breakdown query
  const breakdownMonth = useMemo(() => {
    if (selectedMonth === 'all' || selectedYear === 'all') return undefined;
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    return year * 100 + month + 1; // Backend expects YYYYMM format
  }, [selectedMonth, selectedYear]);

  const { data: monthlyBreakdown } = useMonthlyBreakdown(userId, breakdownMonth);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryName = (categoryId: string) => {
    const category = tripCategories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoría desconocida';
  };

  // Get available months and years
  const { availableMonths, availableYears } = useMemo(() => {
    const allDates = [
      ...tripRecords.map(trip => new Date(Number(trip.date) / 1000000)),
      ...otrosEntries.map(entry => new Date(Number(entry.date) / 1000000))
    ];

    const months = new Set<number>();
    const years = new Set<number>();

    allDates.forEach(date => {
      months.add(date.getMonth());
      years.add(date.getFullYear());
    });

    return {
      availableMonths: Array.from(months).sort((a, b) => a - b),
      availableYears: Array.from(years).sort((a, b) => b - a)
    };
  }, [tripRecords, otrosEntries]);

  // Filter data based on selected month/year
  const filteredData = useMemo(() => {
    let filteredTrips = tripRecords;
    let filteredOtros = otrosEntries;

    if (selectedYear !== 'all') {
      const year = parseInt(selectedYear);
      filteredTrips = filteredTrips.filter(trip => {
        const tripDate = new Date(Number(trip.date) / 1000000);
        return tripDate.getFullYear() === year;
      });
      filteredOtros = filteredOtros.filter(entry => {
        const entryDate = new Date(Number(entry.date) / 1000000);
        return entryDate.getFullYear() === year;
      });
    }

    if (selectedMonth !== 'all') {
      const month = parseInt(selectedMonth);
      filteredTrips = filteredTrips.filter(trip => {
        const tripDate = new Date(Number(trip.date) / 1000000);
        return tripDate.getMonth() === month;
      });
      filteredOtros = filteredOtros.filter(entry => {
        const entryDate = new Date(Number(entry.date) / 1000000);
        return entryDate.getMonth() === month;
      });
    }

    // Combine and sort all entries by date
    const allEntries = [
      ...filteredTrips.map(trip => ({
        type: 'trip' as const,
        id: trip.id,
        date: trip.date,
        description: getCategoryName(trip.categoryId),
        amount: Number(trip.amount),
        categoryId: trip.categoryId
      })),
      ...filteredOtros.map(entry => ({
        type: 'otros' as const,
        id: entry.id,
        date: entry.date,
        description: entry.description,
        amount: Number(entry.amount)
      }))
    ].sort((a, b) => Number(b.date) - Number(a.date));

    return allEntries;
  }, [tripRecords, otrosEntries, selectedMonth, selectedYear, tripCategories]);

  // Calculate totals
  const totals = useMemo(() => {
    const tripTotal = filteredData
      .filter(entry => entry.type === 'trip')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const otrosTotal = filteredData
      .filter(entry => entry.type === 'otros')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const salaryAmount = userProfile ? Number(userProfile.salary) : 0;
    const totalToReceive = salaryAmount + tripTotal + Math.max(0, otrosTotal);
    const expenses = Math.abs(Math.min(0, otrosTotal));
    const netBalance = totalToReceive - expenses;

    return {
      trips: tripTotal,
      otros: otrosTotal,
      total: tripTotal + otrosTotal,
      salary: salaryAmount,
      totalToReceive,
      expenses,
      netBalance
    };
  }, [filteredData, userProfile]);

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    // Enhanced CSV content with better formatting
    const headers = [
      'FECHA',
      'TIPO',
      'DESCRIPCIÓN',
      'IMPORTE (€)',
      'CATEGORÍA'
    ];

    const csvRows = [
      // Header row with styling indicators
      headers.join(','),
      // Separator row
      '=====,=====,=====,=====,=====',
      // Data rows
      ...filteredData.map(entry => [
        `"${formatDate(entry.date)}"`,
        `"${entry.type === 'trip' ? 'VIAJE' : 'OTROS'}"`,
        `"${entry.description}"`,
        `"€${(entry.amount / 100).toFixed(2)}"`,
        `"${entry.type === 'trip' ? getCategoryName(entry.categoryId || '') : '-'}"`
      ].join(',')),
      // Separator row
      '=====,=====,=====,=====,=====',
      // Summary section
      '"RESUMEN DEL PERÍODO","","","",""',
      `"Total Viajes","","","€${(totals.trips / 100).toFixed(2)}",""`,
      `"Total Otros","","","€${(totals.otros / 100).toFixed(2)}",""`,
      `"TOTAL GENERAL","","","€${(totals.total / 100).toFixed(2)}",""`
    ];

    // Add monthly breakdown if available
    if (monthlyBreakdown && (selectedMonth !== 'all' && selectedYear !== 'all')) {
      csvRows.push(
        '=====,=====,=====,=====,=====',
        '"DESGLOSE POR CATEGORÍAS","","","",""'
      );
      
      monthlyBreakdown.categorySummaries.forEach(category => {
        if (Number(category.tripCount) > 0) {
          csvRows.push(
            `"${category.categoryName}","${Number(category.tripCount)} viajes","","€${(Number(category.totalAmount) / 100).toFixed(2)}",""`
          );
        }
      });

      if (monthlyBreakdown.entryTypeSummaries.length > 0) {
        csvRows.push('"OTROS INGRESOS/GASTOS","","","",""');
        monthlyBreakdown.entryTypeSummaries.forEach(entryType => {
          if (Number(entryType.count) > 0) {
            const typeName = entryType.entryType === 'crédito' ? 'EXTRAS' : 'GASTOS';
            csvRows.push(
              `"${typeName}","${Number(entryType.count)} entradas","","€${(Number(entryType.totalAmount) / 100).toFixed(2)}",""`
            );
          }
        });
      }
    }

    const csvContent = csvRows.join('\n');

    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const filterText = selectedMonth !== 'all' || selectedYear !== 'all' 
      ? `_${selectedYear !== 'all' ? selectedYear : 'todos'}_${selectedMonth !== 'all' ? (parseInt(selectedMonth) + 1).toString().padStart(2, '0') : 'todos'}`
      : '_completo';
    
    link.setAttribute('download', `historial_pagos${filterText}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Historial exportado exitosamente');
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    
    try {
      // Always generate an image, even with incomplete data
      const monthName = selectedMonth !== 'all' && selectedYear !== 'all'
        ? new Intl.DateTimeFormat('es-ES', { 
            month: 'long', 
            year: 'numeric' 
          }).format(new Date(parseInt(selectedYear), parseInt(selectedMonth)))
        : new Intl.DateTimeFormat('es-ES', { 
            month: 'long', 
            year: 'numeric' 
          }).format(new Date());

      // Use safe defaults for all values
      const userName = userProfile?.name || 'Usuario';
      const companyName = userProfile?.companyName || 'Mi Empresa';
      const phrase = randomPhrase || 'Este es mi resumen mensual';
      const monthlyGoal = userProfile?.monthlyGoal ? Number(userProfile.monthlyGoal) / 100 : undefined;

      // Calculate goal achievement
      const goalAchieved = monthlyGoal ? (totals.netBalance / 100) >= monthlyGoal : false;
      const goalExceeded = monthlyGoal ? (totals.netBalance / 100) > monthlyGoal * 1.1 : false;

      // Prepare category breakdown data
      const categoryBreakdown = monthlyBreakdown?.categorySummaries
        .filter(cat => Number(cat.tripCount) > 0)
        .map(cat => ({
          categoryName: cat.categoryName,
          tripCount: Number(cat.tripCount)
        })) || [];

      const imageUrl = await generateMonthlySummaryImage({
        userName,
        companyName,
        month: monthName,
        totalToReceive: totals.totalToReceive / 100,
        expenses: totals.expenses / 100,
        netBalance: totals.netBalance / 100,
        phrase,
        monthlyGoal,
        goalAchieved,
        goalExceeded,
        categoryBreakdown,
      });

      setGeneratedImageUrl(imageUrl);
      setShowImageDialog(true);
      
      // Show appropriate success message
      if (totals.totalToReceive === 0 && totals.expenses === 0 && totals.netBalance === 0) {
        toast.success('Resumen visual generado (sin datos para este período)');
      } else {
        toast.success(translations.summaryImageGenerated);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('No se pudo generar el resumen visual. Por favor, inténtalo de nuevo.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (generatedImageUrl) {
      try {
        const monthName = selectedMonth !== 'all' && selectedYear !== 'all'
          ? `${selectedYear}-${(parseInt(selectedMonth) + 1).toString().padStart(2, '0')}`
          : new Date().toISOString().slice(0, 7);
        
        downloadImage(generatedImageUrl, `resumen-mensual-${monthName}.png`);
        toast.success('Imagen descargada exitosamente');
      } catch (error) {
        console.error('Error downloading image:', error);
        toast.error('No se pudo descargar la imagen');
      }
    }
  };

  const handleShareImage = async () => {
    if (generatedImageUrl) {
      try {
        await shareImage(generatedImageUrl, 'Resumen Mensual');
        toast.success('Imagen compartida exitosamente');
      } catch (error) {
        console.error('Error sharing image:', error);
        toast.info('Imagen descargada como alternativa');
      }
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-logistics-primary" />
          <h2 className="text-2xl font-bold">{translations.historyTitle}</h2>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleGenerateImage}
            disabled={isGeneratingImage}
            variant="outline"
            className="bg-modern-primary text-white hover:bg-modern-primary/90"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {isGeneratingImage ? translations.loading : translations.generateSummaryImage}
          </Button>
          
          <Button 
            onClick={handleExport}
            disabled={filteredData.length === 0}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-logistics-accent/20">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra el historial por mes y año
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Año</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mes</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los meses</SelectItem>
                  {availableMonths.map(month => (
                    <SelectItem key={month} value={month.toString()}>
                      {monthNames[month]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary Breakdown - ENHANCED WITH LARGER COLORFUL DISPLAY */}
      {monthlyBreakdown && selectedMonth !== 'all' && selectedYear !== 'all' && (
        <Card className="border-logistics-primary/30 bg-gradient-to-br from-logistics-primary/10 via-logistics-secondary/5 to-modern-success/10 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-logistics-primary/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-logistics-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-logistics-primary">{translations.monthlySummaryTitle}</CardTitle>
                <CardDescription className="text-base">
                  {translations.monthlySummarySubtitle}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Trip Categories Summary - EXTRA LARGE AND COLORFUL */}
              {monthlyBreakdown.categorySummaries.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Truck className="h-5 w-5 text-logistics-primary" />
                    <h4 className="font-bold text-xl text-logistics-primary">{translations.tripsByCategory}</h4>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {monthlyBreakdown.categorySummaries.map((category, index) => {
                      const categoryColors = [
                        { bg: 'bg-indigo-500/20', text: 'text-indigo-700', border: 'border-indigo-500/40', badge: 'bg-indigo-500' },
                        { bg: 'bg-teal-500/20', text: 'text-teal-700', border: 'border-teal-500/40', badge: 'bg-teal-500' },
                        { bg: 'bg-amber-500/20', text: 'text-amber-700', border: 'border-amber-500/40', badge: 'bg-amber-500' },
                        { bg: 'bg-emerald-500/20', text: 'text-emerald-700', border: 'border-emerald-500/40', badge: 'bg-emerald-500' },
                        { bg: 'bg-red-500/20', text: 'text-red-700', border: 'border-red-500/40', badge: 'bg-red-500' },
                        { bg: 'bg-purple-500/20', text: 'text-purple-700', border: 'border-purple-500/40', badge: 'bg-purple-500' },
                        { bg: 'bg-pink-500/20', text: 'text-pink-700', border: 'border-pink-500/40', badge: 'bg-pink-500' },
                        { bg: 'bg-cyan-500/20', text: 'text-cyan-700', border: 'border-cyan-500/40', badge: 'bg-cyan-500' },
                      ];
                      const colorScheme = categoryColors[index % categoryColors.length];
                      
                      return Number(category.tripCount) > 0 && (
                        <div 
                          key={category.categoryId} 
                          className={`flex items-center justify-between p-5 ${colorScheme.bg} rounded-xl border-2 ${colorScheme.border} shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
                        >
                          <div className="flex-1">
                            <span className={`text-xl font-bold ${colorScheme.text}`}>
                              Viajes {category.categoryName}
                            </span>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(Number(category.totalAmount))}
                            </div>
                          </div>
                          <div className="ml-4">
                            <Badge 
                              className={`${colorScheme.badge} text-white font-bold text-2xl px-5 py-3 shadow-md`}
                            >
                              {Number(category.tripCount)}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Entry Types Summary */}
              {monthlyBreakdown.entryTypeSummaries.length > 0 && (
                <div>
                  <h4 className="font-semibold text-base text-logistics-primary mb-3">Otros ingresos y gastos:</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {monthlyBreakdown.entryTypeSummaries.map(entryType => (
                      Number(entryType.count) > 0 && (
                        <div 
                          key={entryType.entryType} 
                          className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                            entryType.entryType === 'crédito' 
                              ? 'bg-modern-success/10 border-modern-success/30' 
                              : 'bg-destructive/10 border-destructive/30'
                          }`}
                        >
                          <span className="text-base font-semibold">
                            {entryType.entryType === 'crédito' ? translations.extrasTotal : translations.expensesTotal}
                          </span>
                          <div className="text-right">
                            <Badge 
                              variant="secondary" 
                              className={`font-bold text-base px-3 py-1 ${
                                entryType.entryType === 'crédito' 
                                  ? 'bg-modern-success/20 text-modern-success' 
                                  : 'bg-destructive/20 text-destructive'
                              }`}
                            >
                              {Number(entryType.count)} entradas
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(Number(entryType.totalAmount))}
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Period Totals */}
              <Separator />
              <div className="grid gap-3 md:grid-cols-3">
                <div className="text-center p-4 bg-white/60 rounded-xl shadow-sm border border-logistics-secondary/20">
                  <div className="text-sm font-medium text-muted-foreground">Total Viajes</div>
                  <div className="text-2xl font-bold text-logistics-secondary mt-1">
                    {formatCurrency(Number(monthlyBreakdown.totalTrips))}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl shadow-sm border border-modern-success/20">
                  <div className="text-sm font-medium text-muted-foreground">Extras</div>
                  <div className="text-2xl font-bold text-modern-success mt-1">
                    {formatCurrency(Number(monthlyBreakdown.totalExtras))}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl shadow-sm border border-logistics-primary/20">
                  <div className="text-sm font-medium text-muted-foreground">Balance Neto</div>
                  <div className="text-2xl font-bold text-logistics-primary mt-1">
                    {formatCurrency(Number(monthlyBreakdown.netBalance))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {filteredData.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-logistics-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-logistics-secondary" />
                <div>
                  <p className="text-sm font-medium">Total Viajes</p>
                  <p className="text-2xl font-bold text-logistics-secondary">
                    {formatCurrency(totals.trips)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-logistics-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <PlusCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Otros</p>
                  <p className={`text-2xl font-bold ${totals.otros >= 0 ? 'text-modern-success' : 'text-destructive'}`}>
                    {formatCurrency(totals.otros)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-logistics-primary/20 bg-logistics-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-logistics-primary" />
                <div>
                  <p className="text-sm font-medium">Total General</p>
                  <p className="text-2xl font-bold text-logistics-primary">
                    {formatCurrency(totals.total)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* History List */}
      <Card className="border-logistics-accent/20">
        <CardHeader>
          <CardTitle>Registro Detallado</CardTitle>
          <CardDescription>
            {filteredData.length > 0 
              ? `${filteredData.length} entradas encontradas`
              : 'No hay entradas para mostrar'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="space-y-3">
              {filteredData.map((entry, index) => (
                <div key={entry.id}>
                  <div className="flex items-start justify-between p-3 hover:bg-muted/50 transition-colors rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        entry.type === 'trip' 
                          ? 'bg-logistics-primary/10' 
                          : entry.amount >= 0 
                            ? 'bg-modern-success/20' 
                            : 'bg-destructive/20'
                      }`}>
                        {entry.type === 'trip' ? (
                          <Truck className="h-4 w-4 text-logistics-primary" />
                        ) : entry.amount >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-modern-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{entry.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(entry.date)}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.type === 'trip' ? 'Viaje' : 'Otros'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className={`${
                        entry.type === 'trip' 
                          ? 'bg-logistics-secondary/10 text-logistics-secondary'
                          : entry.amount >= 0 
                            ? 'bg-modern-success/20 text-modern-success border-modern-success/30'
                            : 'bg-destructive/20 text-destructive border-destructive/30'
                      }`}
                    >
                      {formatCurrency(entry.amount)}
                    </Badge>
                  </div>
                  {index < filteredData.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay datos</h3>
              <p className="text-muted-foreground">
                {selectedMonth !== 'all' || selectedYear !== 'all' 
                  ? translations.noDataForPeriod
                  : 'Aún no tienes registros en tu historial'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resumen Visual Mensual</DialogTitle>
            <DialogDescription>
              Tu resumen mensual está listo para descargar o compartir
            </DialogDescription>
          </DialogHeader>
          
          {generatedImageUrl && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={generatedImageUrl} 
                  alt="Resumen mensual" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '500px' }}
                />
              </div>
              
              <div className="flex justify-center space-x-2">
                <Button onClick={handleDownloadImage} className="bg-modern-primary text-white hover:bg-modern-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  {translations.downloadImage}
                </Button>
                
                <Button onClick={handleShareImage} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  {translations.shareImage}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
