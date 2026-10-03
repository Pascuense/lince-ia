import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const GENERIC_INTERNAL_ERROR = "Error interno del servidor. Inténtalo de nuevo en unos minutos.";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  // Errors tRPC wraps from a plain throw (DB driver, SDKs) carry raw SQL or vendor text;
  // in production only deliberate TRPCError messages reach the browser.
  errorFormatter({ shape, error }) {
    const wrapped =
      error.code === "INTERNAL_SERVER_ERROR" &&
      error.cause !== undefined &&
      !(error.cause instanceof TRPCError);
    if (process.env.NODE_ENV === "production" && wrapped) {
      return { ...shape, message: GENERIC_INTERNAL_ERROR };
    }
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
