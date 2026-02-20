import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { canAccessRoute, isAdminUser } from "@/lib/accessControl";
import { toast } from "sonner";

interface RouteGuardProps {
  children: ReactNode;
}

/**
 * RouteGuard wraps all game routes and redirects non-admin users
 * away from admin-only routes back to /home with a toast notification.
 */
export function RouteGuard({ children }: RouteGuardProps) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Skip check for admins
    if (isAdminUser()) return;

    // Check if current route is allowed
    if (!canAccessRoute(location)) {
      toast.info("Esta sección está en desarrollo. ¡Pronto estará disponible!", {
        duration: 3000,
      });
      setLocation("/home");
    }
  }, [location, setLocation]);

  return <>{children}</>;
}
