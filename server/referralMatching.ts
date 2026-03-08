import { getAvatarPrompt } from "@shared/avatarPrompts";

export type ReferralMatch = {
  key: string;
  displayName: string;
  specialty: string;
};

export function normalizeReferralText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\u4E00-\u9FFF]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveReferralFromResponse(
  responseText: string,
  referralKeys: string[]
): ReferralMatch | null {
  const normalizedResponse = normalizeReferralText(responseText);
  if (!normalizedResponse) return null;

  for (const refKey of referralKeys) {
    const refAvatar = getAvatarPrompt(refKey);
    if (!refAvatar) continue;

    const normalizedKey = normalizeReferralText(refAvatar.key);
    const normalizedDisplayName = normalizeReferralText(refAvatar.displayName);

    const matchesByKey = normalizedKey.length > 0 && normalizedResponse.includes(normalizedKey);
    const matchesByDisplayName =
      normalizedDisplayName.length > 0 && normalizedResponse.includes(normalizedDisplayName);

    if (matchesByKey || matchesByDisplayName) {
      return {
        key: refAvatar.key,
        displayName: refAvatar.displayName,
        specialty: refAvatar.specialty,
      };
    }
  }

  return null;
}
