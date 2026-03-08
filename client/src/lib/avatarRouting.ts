import { AVATAR_PROMPTS } from "@shared/avatarPrompts";

const CHARACTER_IDS = [
  // Familia Original
  "yayolin",
  "yayalina",
  "papalin",
  "mamalina",
  "chavalin",
  "chavalina",
  "pequelin",
  "pequelina",
  "atolondralin",
  "sabelin",
  // Especialistas
  "eticolin",
  "datolin",
  "eticalin",
  "abogalin",
  "influencelin",
  "curralin",
  "doctolin",
  "profalin",
  "emprendalin",
  "conspiralin",
  "abuelin",
  "artistalin",
  "gamerlin",
  // MUSICALIN + Internacional
  "trapzolin",
  "lumalin",
  "cristalin",
  "cronoslin",
  "sirenlin",
  "kumeylin",
  "versolin",
  "rimalin",
  "brislin",
  "wavelin",
  "sonalin",
  "zotealin",
  "grafalin",
  "mantralin",
  "flowalin",
  "pulsolin",
  "beatlin",
  "stilin",
  "coreolin",
  "voltzlin",
  "gamelin",
  "maraklin",
  "flamencalin",
  "iberalin",
  "tonalin",
  "solearlin",
  "gaditaklin",
  "tangarlin",
  "cumbielin",
  "pampalin",
  "milonguelin",
  "gauchalin",
  "boriqualin",
  "tropiklin",
  "perrealin",
  "islalina",
  "salsalin",
  "cumbialin",
  "vallenatalin",
  "parcelin",
  "cafetalin",
  "champetaklin",
  // Aragoneses
  "manolin",
  "pilarin",
  "cierzolin",
  "goyalin",
  "jotalin",
  "ternelin",
  "baturralin",
  "mudejarin",
  "ebrolin",
  "borrajin",
  // Zaragoza Historico
  "lafitalin",
  "nayimin",
  "anderin",
  "gabilin",
  "pardezalin",
  "caminerin",
  "senorin",
  "aguadin",
  "villalin",
  "sorianin",
] as const;

const CHARACTER_ID_OVERRIDES: Record<string, string> = {
  yayolin: "YAYALIN",
};

export const ID_TO_AVATAR_KEY: Record<string, string> = Object.fromEntries(
  CHARACTER_IDS.map((id) => [id, CHARACTER_ID_OVERRIDES[id] ?? id.toUpperCase()])
) as Record<string, string>;

const AVATAR_KEY_TO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(ID_TO_AVATAR_KEY).map(([id, key]) => [key, id])
) as Record<string, string>;

const VALID_AVATAR_KEYS = new Set(AVATAR_PROMPTS.map((a) => a.key));

export function normalizeAvatarKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, "");
}

export function toCanonicalAvatarKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = normalizeAvatarKey(value);
  return VALID_AVATAR_KEYS.has(normalized) ? normalized : null;
}

export function getAvatarKeyForCharacterId(characterId: string): string {
  const rawKey = ID_TO_AVATAR_KEY[characterId] ?? characterId;
  return toCanonicalAvatarKey(rawKey) ?? normalizeAvatarKey(rawKey);
}

export function getCharacterIdByAvatarKey(avatarKey: string): string | null {
  const canonicalKey = toCanonicalAvatarKey(avatarKey);
  if (!canonicalKey) return null;
  return AVATAR_KEY_TO_ID[canonicalKey] ?? null;
}

export type ChatDashboardReferralAction =
  | { kind: "switch"; avatarKey: string }
  | { kind: "redirect"; path: string };

export function resolveChatDashboardReferralAction(
  availableAvatarKeys: readonly string[],
  targetAvatarKey: string
): ChatDashboardReferralAction | null {
  const canonicalTarget = toCanonicalAvatarKey(targetAvatarKey);
  if (!canonicalTarget) return null;

  const canSwitchLocally = availableAvatarKeys.some(
    (key) => toCanonicalAvatarKey(key) === canonicalTarget
  );

  if (canSwitchLocally) {
    return { kind: "switch", avatarKey: canonicalTarget };
  }

  return {
    kind: "redirect",
    path: `/personajes?ref=${encodeURIComponent(canonicalTarget)}`,
  };
}
