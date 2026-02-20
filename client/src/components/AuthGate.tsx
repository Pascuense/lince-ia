/**
 * AuthGate: Previously implemented three-tier access (logged/guest/public).
 * NOW: All users get full access to everything. No barriers.
 * Only admin emails need to register. Everyone else uses everything freely.
 * 
 * This component is kept for backward compatibility but just renders children.
 */

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  return <>{children}</>;
}
