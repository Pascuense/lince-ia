import type { IncomingMessage } from "http";

function stripPort(raw: string): string {
  const value = raw.trim();
  const bracketed = value.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracketed) return bracketed[1];
  // IPv4 with port ("1.2.3.4:5678"); bare IPv6 has several colons and is left as is
  if (/^[\d.]+:\d+$/.test(value)) return value.slice(0, value.lastIndexOf(":"));
  return value;
}

/**
 * Client IP as seen by Azure App Service. Its front end appends the real client
 * address (with ":port") as the last X-Forwarded-For entry; earlier entries come
 * from the client and can be forged, so only the last one is trusted.
 */
export function getRequestIP(req: IncomingMessage): string {
  const xff = req.headers["x-forwarded-for"];
  const header = Array.isArray(xff) ? xff.join(",") : xff;
  const last = header?.split(",").map(s => s.trim()).filter(Boolean).pop();
  return (last && stripPort(last)) || req.socket?.remoteAddress || "unknown";
}
