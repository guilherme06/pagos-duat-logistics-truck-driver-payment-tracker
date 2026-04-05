import { useState } from 'react';
import { useTripCategories, useTripRecords, useAddTripRecord, useUpdateTripRecord, useDeleteTripRecord } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Truck, Plus, Euro, Calendar as CalendarIcon, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TripRecord } from '../backend';

interface TripLoggingProps {
  userId: string;
}

export function TripLogging({ userId }: TripLoggingProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [tripAmount, setTripAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Edit state
  const [editingTrip, setEditingTrip] = useState<TripRecord | null>(null);
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState<Date>(new Date());
  const [isEditCalendarOpen, setIsEditCalendarOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: categories = [] } = useTripCategories(userId);
  const { data: tripRecords = [] } = useTripRecords(userId);
  const addTripRecord = useAddTripRecord();
  const updateTripRecord = useUpdateTripRecord();
  const deleteTripRecord = useDeleteTripRecord();

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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setTripAmount((Number(category.defaultAmount) / 100).toString());
    }
  };

  const handleEditCategoryChange = (categoryId: string) => {
    setEditCategoryId(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setEditAmount((Number(category.defaultAmount) / 100).toString());
    }
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategoryId) {
      toast.error('Por favor, selecciona una categoría');
      return;
    }

    const amount = parseFloat(tripAmount) || 0;
    if (amount < 0) {
      toast.error('El importe no puede ser negativo');
      return;
    }

    try {
      // Convert selected date to nanoseconds timestamp
      const dateTimestamp = BigInt(selectedDate.getTime() * 1000000);
      
      await addTripRecord.mutateAsync({
        userId,
        categoryId: selectedCategoryId,
        amount: BigInt(Math.round(amount * 100)),
        date: dateTimestamp
      });
      
      setSelectedCategoryId('');
      setTripAmount('');
      setSelectedDate(new Date());
      toast.success('Viaje registrado exitosamente');
    } catch (error) {
      toast.error('Error al registrar el viaje');
      console.error(error);
    }
  };

  const handleEditTrip = (trip: TripRecord) => {
    setEditingTrip(trip);
    setEditCategoryId(trip.categoryId);
    setEditAmount((Number(trip.amount) / 100).toString());
    setEditDate(new Date(Number(trip.date) / 1000000));
    setIsEditDialogOpen(true);
  };

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTrip || !editCategoryId) {
      toast.error('Por favor, selecciona una categoría');
      return;
    }

    const amount = parseFloat(editAmount) || 0;
    if (amount < 0) {
      toast.error('El importe no puede ser negativo');
      return;
    }

    try {
      const dateTimestamp = BigInt(editDate.getTime() * 1000000);
      
      await updateTripRecord.mutateAsync({
        recordId: editingTrip.id,
        categoryId: editCategoryId,
        amount: BigInt(Math.round(amount * 100)),
        date: dateTimestamp
      });
      
      setIsEditDialogOpen(false);
      setEditingTrip(null);
      toast.success('Viaje actualizado exitosamente');
    } catch (error) {
      toast.error('Error al actualizar el viaje');
      console.error(error);
    }
  };

  const handleDeleteTrip = async (recordId: string) => {
    try {
      await deleteTripRecord.mutateAsync(recordId);
      toast.success('Viaje eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el viaje');
      console.error(error);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Categoría desconocida';
  };

  // Sort trips by date (newest first)
  const sortedTrips = [...tripRecords].sort((a, b) => Number(b.date) - Number(a.date));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-soft-primary/10 rounded-xl">
          <Truck className="h-7 w-7 text-soft-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-soft-primary">Registro de Viajes</h2>
          <p className="text-soft-secondary">Gestiona tus viajes y ganancias</p>
        </div>
      </div>

      {/* Add Trip Form */}
      <Card className="border-soft-accent/30 shadow-soft-lg card-gradient-primary">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl text-soft-primary">Nuevo Viaje</CardTitle>
          <CardDescription className="text-soft-secondary">
            Registra un nuevo viaje seleccionando la fecha, categoría y el importe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <form onSubmit={handleAddTrip} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <Label htmlFor="tripDate" className="text-soft-primary font-medium">Fecha del viaje</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-12 border-soft-primary/30 hover:border-soft-primary/50 hover:bg-soft-primary/5"
                      >
                        <CalendarIcon className="mr-3 h-5 w-5 text-soft-primary" />
                        <span className="text-soft-primary">
                          {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
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
                          locale={es}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category" className="text-soft-primary font-medium">Categoría</Label>
                  <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-12 border-soft-primary/30 hover:border-soft-primary/50">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{category.name}</span>
                            <Badge variant="secondary" className="ml-2 bg-soft-secondary/20 text-soft-secondary">
                              {formatCurrency(Number(category.defaultAmount))}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-soft-primary font-medium">Importe</Label>
                  <div className="relative">
                    <Euro className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-secondary" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={tripAmount}
                      onChange={(e) => setTripAmount(e.target.value)}
                      className="pl-12 h-12 border-soft-primary/30 hover:border-soft-primary/50 focus:border-soft-primary"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={addTripRecord.isPending}
                className="w-full h-12 bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                {addTripRecord.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-3 h-5 w-5" />
                    Registrar
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-soft-warning/10 rounded-xl inline-block mb-4">
                <Truck className="h-12 w-12 text-soft-warning mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-soft-primary mb-2">
                Necesitas crear categorías
              </h3>
              <p className="text-soft-secondary">
                Ve a la sección "Categorías" para crear tu primera categoría de viaje
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Trips */}
      <Card className="border-soft-accent/30 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl text-soft-primary">Viajes Recientes</CardTitle>
          <CardDescription className="text-soft-secondary">
            Historial de tus últimos viajes registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedTrips.length > 0 ? (
            <div className="space-y-4">
              {sortedTrips.slice(0, 10).map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-4 border border-soft-accent/20 rounded-xl hover:bg-soft-primary/5 transition-all duration-200 hover:shadow-soft">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-soft-primary/10 rounded-xl">
                      <Truck className="h-5 w-5 text-soft-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-soft-primary">{getCategoryName(trip.categoryId)}</p>
                      <div className="flex items-center space-x-2 text-sm text-soft-secondary">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(trip.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-soft-success/20 text-soft-success font-semibold px-3 py-1">
                      {formatCurrency(Number(trip.amount))}
                    </Badge>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditTrip(trip)}
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
                          <AlertDialogTitle>¿Eliminar viaje?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el viaje a "{getCategoryName(trip.categoryId)}" por {formatCurrency(Number(trip.amount))}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTrip(trip.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              
              {sortedTrips.length > 10 && (
                <p className="text-center text-sm text-soft-secondary pt-6">
                  Mostrando los 10 viajes más recientes. Ve al historial para ver todos.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-soft-info/10 rounded-xl inline-block mb-4">
                <Truck className="h-12 w-12 text-soft-info mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-soft-primary mb-2">No hay viajes registrados</h3>
              <p className="text-soft-secondary">
                Registra tu primer viaje usando el formulario de arriba
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-soft-primary">Editar Viaje</DialogTitle>
            <DialogDescription className="text-soft-secondary">
              Modifica los datos del viaje seleccionado
            </DialogDescription>
          </DialogHeader>
          
          {editingTrip && (
            <form onSubmit={handleUpdateTrip} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="editTripDate" className="text-soft-primary font-medium">Fecha del viaje</Label>
                  <Popover open={isEditCalendarOpen} onOpenChange={setIsEditCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-12 border-soft-primary/30 hover:border-soft-primary/50 hover:bg-soft-primary/5"
                      >
                        <CalendarIcon className="mr-3 h-5 w-5 text-soft-primary" />
                        <span className="text-soft-primary">
                          {format(editDate, 'dd/MM/yyyy', { locale: es })}
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
                          locale={es}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="editCategory" className="text-soft-primary font-medium">Categoría</Label>
                  <Select value={editCategoryId} onValueChange={handleEditCategoryChange}>
                    <SelectTrigger className="h-12 border-soft-primary/30 hover:border-soft-primary/50">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{category.name}</span>
                            <Badge variant="secondary" className="ml-2 bg-soft-secondary/20 text-soft-secondary">
                              {formatCurrency(Number(category.defaultAmount))}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="editAmount" className="text-soft-primary font-medium">Importe</Label>
                <div className="relative">
                  <Euro className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-secondary" />
                  <Input
                    id="editAmount"
                    type="number"
                    placeholder="0.00"
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
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateTripRecord.isPending}
                  className="bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold"
                >
                  {updateTripRecord.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    'Guardar'
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
