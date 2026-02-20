/**
 * RequireLogin: Previously blocked access for non-logged-in users.
 * NOW: Pass-through — all users can access all tools without registration.
 * Only admin emails (cristobalalisteg@gmail.com, cristobal@acnb.es) need registration.
 * Kept as a wrapper for backward compatibility.
 */

interface RequireLoginProps {
  children: React.ReactNode;
}

export default function RequireLogin({ children }: RequireLoginProps) {
  // No barriers — everyone can use everything
  return <>{children}</>;
}
