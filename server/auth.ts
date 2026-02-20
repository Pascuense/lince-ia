/**
 * LINCE — Autenticación propia con JWT + bcrypt
 * Reemplaza completamente el OAuth de Manus.
 * 
 * Flujo:
 * 1. Registro: POST /api/auth/register → crea usuario con password hasheada → devuelve JWT
 * 2. Login: POST /api/auth/login → verifica password → devuelve JWT en cookie
 * 3. Logout: POST /api/auth/logout → limpia cookie
 * 4. Verificación: middleware lee cookie → verifica JWT → inyecta user en ctx
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, Express } from "express";
import { ENV } from "./env";
import * as db from "./db";

const COOKIE_NAME = "lince_session";
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "365d"; // 1 año

// ─── JWT Helpers ───

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, ENV.jwtSecret, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ENV.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
}

// ─── Password Helpers ───

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── Cookie Helpers ───

function getCookieOptions(req: Request) {
  const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: isSecure,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 año
  };
}

// ─── Auth from Request ───

export async function authenticateRequest(req: Request): Promise<any | null> {
  // Try cookie first
  const cookieHeader = req.headers.cookie || "";
  const cookies = new Map(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")] as [string, string];
    })
  );
  const token = cookies.get(COOKIE_NAME);

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Get user from DB
  const user = await db.getUserById(payload.userId);
  return user;
}

// ─── Express Routes ───

export function registerAuthRoutes(app: Express) {
  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son obligatorios." });
        return;
      }

      // Check if user exists
      const existing = await db.getUserByEmail(email);
      if (existing) {
        res.status(409).json({ error: "Ya existe una cuenta con este email." });
        return;
      }

      // Hash password and create user
      const passwordHash = await hashPassword(password);
      const user = await db.createUser({
        email,
        passwordHash,
        name: name || null,
        role: "user",
      });

      if (!user) {
        res.status(500).json({ error: "Error al crear la cuenta." });
        return;
      }

      // Sign JWT and set cookie
      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      res.cookie(COOKIE_NAME, token, getCookieOptions(req));
      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error("[Auth] Register error:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son obligatorios." });
        return;
      }

      const user = await db.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Credenciales incorrectas." });
        return;
      }

      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Credenciales incorrectas." });
        return;
      }

      // Update last sign in
      await db.updateUserLastSignIn(user.id);

      // Sign JWT and set cookie
      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      res.cookie(COOKIE_NAME, token, getCookieOptions(req));
      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error("[Auth] Login error:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  });

  // Logout
  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.json({ success: true });
  });

  // Me (current user)
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const user = await authenticateRequest(req);
    if (!user) {
      res.json({ user: null });
      return;
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });
}

export { COOKIE_NAME };
