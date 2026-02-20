/**
 * LINCE — System Router (Azure Edition)
 * Minimal system router replacing Manus systemRouter.
 */
import { router, publicProcedure, adminProcedure } from "./trpc";
import { z } from "zod";
import { notifyOwner } from "./notification";

export const systemRouter = router({
  /** Health check */
  health: publicProcedure.query(() => {
    return { status: "ok", timestamp: Date.now() };
  }),

  /** Notify owner (admin only) */
  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(1200),
        content: z.string().min(1).max(20000),
      })
    )
    .mutation(async ({ input }) => {
      const success = await notifyOwner(input);
      return { success };
    }),
});
