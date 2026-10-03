const TOKEN_KEY = "lince-game-token";

/** Server messages for a missing, invalid or expired game token */
export function isGameSessionError(message: string | undefined): boolean {
  return (
    !!message &&
    (message.startsWith("Sesión de juego") ||
      message.startsWith("Token de sesión de juego"))
  );
}

/** Clear the stored session and send the user to the login page */
export function handleExpiredGameSession(): void {
  if (!localStorage.getItem(TOKEN_KEY) && !localStorage.getItem("lince-user")) {
    return;
  }
  localStorage.removeItem("lince-user");
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("lince-logout"));
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

/** Renew the game token on app start so active users never hit the expiry */
export async function refreshGameToken(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return;
  try {
    const res = await fetch("/api/trpc/gamePlayer.refreshToken", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-game-token": token },
      credentials: "include",
      body: "{}",
    });
    if (res.status === 401) {
      handleExpiredGameSession();
      return;
    }
    if (!res.ok) return;
    const body = await res.json();
    const fresh = body?.result?.data?.json?.gameToken;
    if (typeof fresh === "string") localStorage.setItem(TOKEN_KEY, fresh);
  } catch {
    // Offline: keep the current token and try again next start
  }
}
