export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// The app has its own login page; there is no external OAuth portal on Azure.
export const getLoginUrl = () => "/login";
