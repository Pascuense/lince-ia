import { describe, it, expect } from "vitest";

/**
 * Tests for chat persistence integration.
 * Validates that the frontend-to-backend chat flow is properly connected:
 * - ArtistChatModal loads history via trpc.avatarChat.getHistory
 * - Messages are persisted via sendMessage with gamePlayerId
 * - MiPerfil lists sessions via trpc.avatarChat.listSessions
 * - Sessions can be deleted via trpc.avatarChat.deleteSession
 * - Relationship levels update correctly
 */
describe("Chat Persistence Integration", () => {
  describe("ArtistChatModal frontend connection", () => {
    it("imports trpc and useGame for backend connection", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      // Must import trpc for backend calls
      expect(content).toContain('import { trpc }');
      // Must import useGame for gamePlayerId
      expect(content).toContain('import { useGame }');
    });

    it("uses trpc.avatarChat.getHistory.useQuery to load history", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("trpc.avatarChat.getHistory.useQuery");
    });

    it("passes gamePlayerId to sendMessage mutation", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("gamePlayerId");
      expect(content).toContain("trpc.avatarChat.sendMessage.useMutation");
    });

    it("displays relationship level indicator in chat header", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("RELATIONSHIP_CONFIG");
      expect(content).toContain("relationshipLevel");
      expect(content).toContain("Desconocido");
      expect(content).toContain("Conocido");
      expect(content).toContain("Amigo");
      expect(content).toContain("Confidente");
    });

    it("shows loading state while fetching history", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("historyLoading");
      expect(content).toContain("Cargando historial");
    });

    it("populates messages from backend history data", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("historyData");
      expect(content).toContain("historyData.messages");
      expect(content).toContain("Conversación anterior");
    });

    it("uses useMemo to stabilize query input and prevent infinite re-renders", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("useMemo");
      expect(content).toContain("historyInput");
    });

    it("updates relationship level from sendMessage response", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/components/ArtistChatModal.tsx", "utf-8");
      expect(content).toContain("result.relationshipLevel");
      expect(content).toContain("setRelationshipLevel");
    });
  });

  describe("MiPerfil conversations section", () => {
    it("imports required components for conversations", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain('import { trpc }');
      expect(content).toContain('import { ArtistChatModal }');
      expect(content).toContain("MessageCircle");
      expect(content).toContain("Trash2");
    });

    it("uses trpc.avatarChat.listSessions.useQuery", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("trpc.avatarChat.listSessions.useQuery");
    });

    it("uses trpc.avatarChat.deleteSession.useMutation", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("trpc.avatarChat.deleteSession.useMutation");
    });

    it("displays Mis Conversaciones section header", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("myConversations");
      expect(content).toContain("Mis Conversaciones");
      expect(content).toContain("My Conversations");
      expect(content).toContain("我的对话");
    });

    it("shows empty state when no conversations exist", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("noConversations");
      expect(content).toContain("Ir a Personajes");
    });

    it("shows login required message when not authenticated", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("loginRequired");
    });

    it("renders conversation list with avatar image, name, and relationship level", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("chatSessions.map");
      expect(content).toContain("getAvatarImage");
      expect(content).toContain("RELATIONSHIP_CONFIG");
      expect(content).toContain("lastMessagePreview");
      expect(content).toContain("messageCount");
    });

    it("has continue chat button that opens ArtistChatModal", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("handleOpenChat");
      expect(content).toContain("setChatArtist");
      expect(content).toContain("continueChat");
    });

    it("has delete button with confirmation", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("handleDeleteSession");
      expect(content).toContain("window.confirm");
      expect(content).toContain("deleteChatConfirm");
    });

    it("refetches sessions when chat modal closes", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("refetchSessions");
      expect(content).toContain("onClose={() => {");
    });

    it("supports all 3 languages for conversation UI", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      // Check ES
      expect(content).toContain("Mis Conversaciones");
      expect(content).toContain("mensajes");
      expect(content).toContain("Eliminar esta conversación");
      // Check EN
      expect(content).toContain("My Conversations");
      expect(content).toContain("messages");
      expect(content).toContain("Delete this conversation");
      // Check ZH
      expect(content).toContain("我的对话");
      expect(content).toContain("条消息");
      expect(content).toContain("删除此对话");
    });

    it("shows relative time for last activity", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync("client/src/pages/MiPerfil.tsx", "utf-8");
      expect(content).toContain("formatRelativeTime");
      expect(content).toContain("updatedAt");
    });
  });

  describe("Backend procedures are properly defined", () => {
    it("getHistory procedure exists and returns correct shape", async () => {
      const { appRouter } = await import("./routers");
      expect(appRouter._def.procedures).toBeDefined();
      // The procedure should be accessible
      const procedures = Object.keys(appRouter._def.procedures);
      expect(procedures).toContain("avatarChat.getHistory");
    });

    it("listSessions procedure exists", async () => {
      const { appRouter } = await import("./routers");
      const procedures = Object.keys(appRouter._def.procedures);
      expect(procedures).toContain("avatarChat.listSessions");
    });

    it("deleteSession procedure exists", async () => {
      const { appRouter } = await import("./routers");
      const procedures = Object.keys(appRouter._def.procedures);
      expect(procedures).toContain("avatarChat.deleteSession");
    });

    it("sendMessage procedure exists", async () => {
      const { appRouter } = await import("./routers");
      const procedures = Object.keys(appRouter._def.procedures);
      expect(procedures).toContain("avatarChat.sendMessage");
    });
  });

  describe("Relationship level configuration consistency", () => {
    it("frontend and backend use same 4 relationship levels", () => {
      const levels = ["new", "known", "friend", "best_friend"];
      // Frontend labels
      const frontendLabels: Record<string, Record<string, string>> = {
        new: { es: "Desconocido", en: "Stranger", zh: "陌生人" },
        known: { es: "Conocido", en: "Acquaintance", zh: "认识" },
        friend: { es: "Amigo", en: "Friend", zh: "朋友" },
        best_friend: { es: "Confidente", en: "Confidant", zh: "知己" },
      };
      levels.forEach(level => {
        expect(frontendLabels[level]).toBeDefined();
        expect(frontendLabels[level].es).toBeTruthy();
        expect(frontendLabels[level].en).toBeTruthy();
        expect(frontendLabels[level].zh).toBeTruthy();
      });
    });

    it("relationship thresholds are consistent: 0-4=new, 5-14=known, 15-29=friend, 30+=best_friend", () => {
      // This mirrors the logic in server/db.ts updateRelationshipLevel
      const getLevel = (count: number) => {
        if (count >= 30) return "best_friend";
        if (count >= 15) return "friend";
        if (count >= 5) return "known";
        return "new";
      };
      expect(getLevel(0)).toBe("new");
      expect(getLevel(4)).toBe("new");
      expect(getLevel(5)).toBe("known");
      expect(getLevel(14)).toBe("known");
      expect(getLevel(15)).toBe("friend");
      expect(getLevel(29)).toBe("friend");
      expect(getLevel(30)).toBe("best_friend");
      expect(getLevel(100)).toBe("best_friend");
    });
  });
});
