import { useState } from 'react';
import { useTripCategories, useAddTripCategory, useUpdateTripCategory, useDeleteTripCategory } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Plus, Edit, Trash2, Euro } from 'lucide-react';
import { toast } from 'sonner';
import { TripCategory } from '../backend';

interface TripCategoriesProps {
  userId: string;
}

export function TripCategories({ userId }: TripCategoriesProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TripCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');

  const { data: categories = [] } = useTripCategories(userId);
  const addCategory = useAddTripCategory();
  const updateCategory = useUpdateTripCategory();
  const deleteCategory = useDeleteTripCategory();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error('Por favor, introduce un nombre para la categoría');
      return;
    }

    const amount = parseFloat(newCategoryAmount) || 0;
    if (amount < 0) {
      toast.error('El importe no puede ser negativo');
      return;
    }

    try {
      await addCategory.mutateAsync({
        userId,
        name: newCategoryName.trim(),
        defaultAmount: BigInt(Math.round(amount * 100))
      });
      
      setNewCategoryName('');
      setNewCategoryAmount('');
      setIsAddDialogOpen(false);
      toast.success('Categoría creada exitosamente');
    } catch (error) {
      toast.error('Error al crear la categoría');
      console.error(error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory || !newCategoryName.trim()) {
      return;
    }

    const amount = parseFloat(newCategoryAmount) || 0;
    if (amount < 0) {
      toast.error('El importe no puede ser negativo');
      return;
    }

    try {
      await updateCategory.mutateAsync({
        categoryId: editingCategory.id,
        name: newCategoryName.trim(),
        defaultAmount: BigInt(Math.round(amount * 100))
      });
      
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategoryAmount('');
      toast.success('Categoría actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar la categoría');
      console.error(error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      toast.success('Categoría eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la categoría');
      console.error(error);
    }
  };

  const openEditDialog = (category: TripCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryAmount((Number(category.defaultAmount) / 100).toString());
  };

  const closeEditDialog = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FolderOpen className="h-6 w-6 text-modern-primary" />
          <h2 className="text-2xl font-bold">Categorías de Viajes</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>
                Define una nueva categoría de viaje con su importe por defecto
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Nombre de la categoría</Label>
                  <Input
                    id="categoryName"
                    placeholder="ej. Francia, Lidl, Mercadona..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryAmount">Importe por defecto</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="categoryAmount"
                      type="number"
                      placeholder="0.00"
                      value={newCategoryAmount}
                      onChange={(e) => setNewCategoryAmount(e.target.value)}
                      className="pl-10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={addCategory.isPending}
                  className="bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold"
                >
                  {addCategory.isPending ? 'Creando...' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="border-modern-accent/20 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant="secondary" className="bg-modern-secondary/10 text-modern-secondary">
                    {formatCurrency(Number(category.defaultAmount))}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará la categoría "{category.name}" permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera categoría de viaje para comenzar a organizar tus rutas
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Categoría
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Modifica el nombre y el importe por defecto de la categoría
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateCategory}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editCategoryName">Nombre de la categoría</Label>
                <Input
                  id="editCategoryName"
                  placeholder="ej. Francia, Lidl, Mercadona..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategoryAmount">Importe por defecto</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="editCategoryAmount"
                    type="number"
                    placeholder="0.00"
                    value={newCategoryAmount}
                    onChange={(e) => setNewCategoryAmount(e.target.value)}
                    className="pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeEditDialog}
                className="bg-destructive hover:bg-destructive/90 text-white dark:text-white border-destructive"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={updateCategory.isPending}
                className="bg-modern-primary hover:bg-modern-primary/90 text-white dark:text-white font-semibold"
              >
                {updateCategory.isPending ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
