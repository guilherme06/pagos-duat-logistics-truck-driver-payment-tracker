import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, LogIn, Heart } from 'lucide-react';

export function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-primary/5 via-background to-blue-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-orange-primary/20 to-orange-secondary/20 rounded-2xl border border-orange-primary/30">
              <Truck className="h-10 w-10 text-orange-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-modern-primary">Sistema de Pagos</h1>
              <p className="text-sm text-modern-secondary font-medium">Logística</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Seguimiento de pagos para conductores
          </p>
        </div>

        {/* Login Card */}
        <Card className="card-modern-orange">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Truck className="h-5 w-5 text-orange-primary" />
              <span>Acceso de Conductor</span>
            </CardTitle>
            <CardDescription>
              Inicia sesión para gestionar tus viajes y pagos mensuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={login} 
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-orange-primary to-orange-secondary hover:from-orange-primary/90 hover:to-orange-secondary/90 text-white rounded-xl shadow-modern"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025. Built with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> using <a href="https://caffeine.ai" className="text-modern-primary hover:underline font-medium">caffeine.ai</a></p>
        </div>
      </div>
    </div>
  );
}
