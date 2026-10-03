import { describe, expect, it } from "vitest";
import { getRequestIP } from "./clientIp";

const req = (xff?: string, remote = "169.254.130.1") =>
  ({ headers: xff === undefined ? {} : { "x-forwarded-for": xff }, socket: { remoteAddress: remote } }) as any;

describe("getRequestIP", () => {
  it("strips the port Azure appends to IPv4", () => {
    expect(getRequestIP(req("83.45.12.9:51234"))).toBe("83.45.12.9");
  });
  it("trusts only the last entry, ignoring client-supplied ones", () => {
    expect(getRequestIP(req("1.1.1.1, 83.45.12.9:51234"))).toBe("83.45.12.9");
  });
  it("handles bracketed IPv6 with port and bare IPv6", () => {
    expect(getRequestIP(req("[2001:db8::1]:443"))).toBe("2001:db8::1");
    expect(getRequestIP(req("2001:db8::1"))).toBe("2001:db8::1");
  });
  it("falls back to the socket address without the header", () => {
    expect(getRequestIP(req())).toBe("169.254.130.1");
  });
});
