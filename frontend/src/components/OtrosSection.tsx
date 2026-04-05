import { useState } from 'react';
import { useOtrosEntries, useAddOtrosEntry, useUpdateOtrosEntry, useDeleteOtrosEntry } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PlusCircle, Plus, Euro, Calendar as CalendarIcon, Trash2, Edit, TrendingUp, TrendingDown, CreditCard, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es, pt, enUS } from 'date-fns/locale';
import { OtrosEntry } from '../backend';

interface OtrosSectionProps {
  userId: string;
}

export function OtrosSection({ userId }: OtrosSectionProps) {
  const { language, translations: t } = useLanguage();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [entryType, setEntryType] = useState<'credito' | 'deuda'>('credito');

  // Edit state
  const [editingEntry, setEditingEntry] = useState<OtrosEntry | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState<Date>(new Date());
  const [editEntryType, setEditEntryType] = useState<'credito' | 'deuda'>('credito');
  const [isEditCalendarOpen, setIsEditCalendarOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: otrosEntries = [] } = useOtrosEntries(userId);
  const addOtrosEntry = useAddOtrosEntry();
  const updateOtrosEntry = useUpdateOtrosEntry();
  const deleteOtrosEntry = useDeleteOtrosEntry();

  const getDateLocale = () => {
    switch (language) {
      case 'pt': return pt;
      case 'en': return enUS;
      default: return es;
    }
  };

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

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error(t.descriptionRequired);
      return;
    }

    const amountValue = parseFloat(amount) || 0;
    if (amountValue === 0) {
      toast.error(t.amountRequired);
      return;
    }

    try {
      // Convert selected date to nanoseconds timestamp
      // Backend will add Time.now() to ensure uniqueness
      const dateTimestamp = BigInt(selectedDate.getTime() * 1000000);
      
      // Apply sign based on entry type
      const finalAmount = entryType === 'deuda' ? -Math.abs(amountValue) : Math.abs(amountValue);
      
      await addOtrosEntry.mutateAsync({
        userId,
        description: description.trim(),
        amount: BigInt(Math.round(finalAmount * 100)),
        date: dateTimestamp,
        entryType
      });
      
      setDescription('');
      setAmount('');
      setSelectedDate(new Date());
      setEntryType('credito');
      toast.success(t.entryRegistered);
    } catch (error) {
      toast.error(t.entryRegisterError);
      console.error(error);
    }
  };

  const handleEditEntry = (entry: OtrosEntry) => {
    setEditingEntry(entry);
    setEditDescription(entry.description);
    setEditAmount((Math.abs(Number(entry.amount)) / 100).toString());
    setEditDate(new Date(Number(entry.date) / 1000000));
    setEditEntryType(entry.entryType as 'credito' | 'deuda');
    setIsEditDialogOpen(true);
  };

  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEntry || !editDescription.trim()) {
      toast.error(t.descriptionRequired);
      return;
    }

    const amountValue = parseFloat(editAmount) || 0;
    if (amountValue === 0) {
      toast.error(t.amountRequired);
      return;
    }

    try {
      const dateTimestamp = BigInt(editDate.getTime() * 1000000);
      
      // Apply sign based on entry type
      const finalAmount = editEntryType === 'deuda' ? -Math.abs(amountValue) : Math.abs(amountValue);
      
      await updateOtrosEntry.mutateAsync({
        entryId: editingEntry.id,
        description: editDescription.trim(),
        amount: BigInt(Math.round(finalAmount * 100)),
        date: dateTimestamp,
        entryType: editEntryType
      });
      
      setIsEditDialogOpen(false);
      setEditingEntry(null);
      toast.success(t.entryUpdated);
    } catch (error) {
      toast.error(t.entryUpdateError);
      console.error(error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteOtrosEntry.mutateAsync(entryId);
      toast.success(t.entryDeleted);
    } catch (error) {
      toast.error(t.entryDeleteError);
      console.error(error);
    }
  };

  // Sort entries by date (newest first)
  const sortedEntries = [...otrosEntries].sort((a, b) => Number(b.date) - Number(a.date));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-soft-accent/10 rounded-xl">
          <PlusCircle className="h-7 w-7 text-soft-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-soft-primary">{t.othersTitle}</h2>
          <p className="text-soft-secondary">{t.othersSubtitle}</p>
        </div>
      </div>

      {/* Add Entry Form */}
      <Card className="border-soft-accent/30 shadow-soft-lg card-gradient-accent">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl text-soft-primary">{t.newEntryTitle}</CardTitle>
          <CardDescription className="text-soft-secondary">
            {t.newEntrySubtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEntry} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="entryDate" className="text-soft-primary font-medium">{t.entryDateLabel}</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-12 border-soft-primary/30 hover:border-soft-primary/50 hover:bg-soft-primary/5"
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-soft-primary" />
                    <span className="text-soft-primary">
                      {format(selectedDate, 'dd/MM/yyyy', { locale: getDateLocale() })}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-soft-lg" align="start">
                  <div className="calendar-enhanced">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setIsCalendarOpen(false);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                      locale={getDateLocale()}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label className="text-soft-primary font-medium">{t.entryTypeLabel}</Label>
              <ToggleGroup 
                type="single" 
                value={entryType} 
                onValueChange={(value) => value && setEntryType(value as 'credito' | 'deuda')}
                className="grid grid-cols-2 gap-3"
              >
                <ToggleGroupItem 
                  value="credito" 
                  className="h-14 flex-col space-y-2 border-2 data-[state=on]:border-modern-success data-[state=on]:bg-modern-success data-[state=on]:text-white hover:bg-modern-success/10 hover:border-modern-success/50"
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">{t.credit}</span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="deuda" 
                  className="h-14 flex-col space-y-2 border-2 data-[state=on]:border-destructive data-[state=on]:bg-destructive data-[state=on]:text-white hover:bg-destructive/10 hover:border-destructive/50"
                >
                  <Receipt className="h-5 w-5" />
                  <span className="font-medium">{t.debt}</span>
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-soft-secondary">
                {t.entryTypeHelp}
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-soft-primary font-medium">{t.descriptionLabel}</Label>
              <Textarea
                id="description"
                placeholder={t.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="border-soft-primary/30 hover:border-soft-primary/50 focus:border-soft-primary resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount" className="text-soft-primary font-medium">{t.amountLabel}</Label>
              <div className="relative">
                <Euro className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-secondary" />
                <Input
                  id="amount"
                  type="number"
                  placeholder={t.amountPlaceholder}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 h-12 border-soft-primary/30 hover:border-soft-primary/50 focus:border-soft-primary"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-soft-secondary">
                {t.amountHelp}
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={addOtrosEntry.isPending}
              className="w-full h-12 bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              {addOtrosEntry.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  {t.loading}
                </>
              ) : (
                <>
                  <Plus className="mr-3 h-5 w-5" />
                  {t.save}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="border-soft-accent/30 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl text-soft-primary">{t.allEntriesTitle}</CardTitle>
          <CardDescription className="text-soft-secondary">
            {t.allEntriesSubtitle} ({sortedEntries.length} {language === 'en' ? 'entries' : language === 'pt' ? 'entradas' : 'entradas'})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedEntries.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {sortedEntries.map((entry) => {
                const entryAmount = Number(entry.amount);
                const isCredit = entry.entryType === 'credito';
                
                return (
                  <div 
                    key={entry.id} 
                    className={`flex items-start justify-between p-4 border rounded-xl transition-all duration-200 hover:shadow-soft ${
                      isCredit 
                        ? 'border-modern-success/30 bg-modern-success/5 hover:bg-modern-success/10' 
                        : 'border-destructive/30 bg-destructive/5 hover:bg-destructive/10'
                    }`}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-xl ${isCredit ? 'bg-modern-success/20' : 'bg-destructive/20'}`}>
                        {isCredit ? (
                          <TrendingUp className="h-5 w-5 text-modern-success" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isCredit ? 'text-modern-success' : 'text-destructive'}`}>
                          {entry.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm mt-1">
                          <CalendarIcon className={`h-4 w-4 ${isCredit ? 'text-modern-success/70' : 'text-destructive/70'}`} />
                          <span className={isCredit ? 'text-modern-success/70' : 'text-destructive/70'}>
                            {formatDate(entry.date)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 font-medium ${
                              isCredit 
                                ? 'border-modern-success/50 text-modern-success bg-modern-success/10' 
                                : 'border-destructive/50 text-destructive bg-destructive/10'
                            }`}
                          >
                            {isCredit ? t.credit : t.debt}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="secondary" 
                        className={`font-bold px-4 py-2 text-base ${
                          isCredit 
                            ? 'bg-modern-success/20 text-modern-success border-modern-success/30' 
                            : 'bg-destructive/20 text-destructive border-destructive/30'
                        }`}
                      >
                        {formatCurrency(entryAmount)}
                      </Badge>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditEntry(entry)}
                        className="text-soft-primary hover:text-soft-primary border-soft-primary/30 hover:bg-soft-primary/5"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t.deleteEntryTitle}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t.deleteEntryMessage}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive">
                              {t.cancel}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {t.delete}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-soft-info/10 rounded-xl inline-block mb-4">
                <PlusCircle className="h-12 w-12 text-soft-info mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-soft-primary mb-2">{t.noEntriesTitle}</h3>
              <p className="text-soft-secondary">
                {t.noEntriesMessage}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-soft-primary">{t.editEntryTitle}</DialogTitle>
            <DialogDescription className="text-soft-secondary">
              {t.editEntrySubtitle}
            </DialogDescription>
          </DialogHeader>
          
          {editingEntry && (
            <form onSubmit={handleUpdateEntry} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="editEntryDate" className="text-soft-primary font-medium">{t.entryDateLabel}</Label>
                <Popover open={isEditCalendarOpen} onOpenChange={setIsEditCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-12 border-soft-primary/30 hover:border-soft-primary/50 hover:bg-soft-primary/5"
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-soft-primary" />
                      <span className="text-soft-primary">
                        {format(editDate, 'dd/MM/yyyy', { locale: getDateLocale() })}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 shadow-soft-lg" align="start">
                    <div className="calendar-enhanced">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={(date) => {
                          if (date) {
                            setEditDate(date);
                            setIsEditCalendarOpen(false);
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        locale={getDateLocale()}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-soft-primary font-medium">{t.entryTypeLabel}</Label>
                <ToggleGroup 
                  type="single" 
                  value={editEntryType} 
                  onValueChange={(value) => value && setEditEntryType(value as 'credito' | 'deuda')}
                  className="grid grid-cols-2 gap-3"
                >
                  <ToggleGroupItem 
                    value="credito" 
                    className="h-14 flex-col space-y-2 border-2 data-[state=on]:border-modern-success data-[state=on]:bg-modern-success data-[state=on]:text-white hover:bg-modern-success/10 hover:border-modern-success/50"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">{t.credit}</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="deuda" 
                    className="h-14 flex-col space-y-2 border-2 data-[state=on]:border-destructive data-[state=on]:bg-destructive data-[state=on]:text-white hover:bg-destructive/10 hover:border-destructive/50"
                  >
                    <Receipt className="h-5 w-5" />
                    <span className="font-medium">{t.debt}</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="editDescription" className="text-soft-primary font-medium">{t.descriptionLabel}</Label>
                <Textarea
                  id="editDescription"
                  placeholder={t.descriptionPlaceholder}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  rows={3}
                  className="border-soft-primary/30 hover:border-soft-primary/50 focus:border-soft-primary resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="editAmount" className="text-soft-primary font-medium">{t.amountLabel}</Label>
                <div className="relative">
                  <Euro className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-secondary" />
                  <Input
                    id="editAmount"
                    type="number"
                    placeholder={t.amountPlaceholder}
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="pl-12 h-12 border-soft-primary/30 hover:border-soft-primary/50 focus:border-soft-primary"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive"
                >
                  {t.cancel}
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateOtrosEntry.isPending}
                  className="bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold"
                >
                  {updateOtrosEntry.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t.loading}
                    </>
                  ) : (
                    t.save
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
