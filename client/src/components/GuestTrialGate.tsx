import { type TrialAction } from "@/contexts/GuestContext";

/**
 * GuestTrialGate — Previously blocked guest users when trials were exhausted.
 * NOW: Pass-through — all users have unlimited access without registration.
 */

interface GuestTrialGateProps {
  action: TrialAction;
  detail?: string;
  children: React.ReactNode;
  inline?: boolean;
  lockedMessage?: string;
}

export function GuestTrialGate({ children }: GuestTrialGateProps) {
  return <>{children}</>;
}
