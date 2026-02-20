/**
 * LINCE — Client Constants (Azure Edition)
 * Sin dependencias de Manus OAuth.
 */
export const COOKIE_NAME = "lince_session";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// Login URL points to our own login page (no Manus OAuth)
export const getLoginUrl = (returnPath?: string) => {
  const base = "/login";
  if (returnPath) {
    return `${base}?returnTo=${encodeURIComponent(returnPath)}`;
  }
  return base;
};
