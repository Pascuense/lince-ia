import { trpc } from "@/lib/trpc";

export const IMAGE_UNAVAILABLE_MSG =
  "La generación de imágenes estará disponible próximamente.";

/** Optional capabilities configured on this deployment (off until the server confirms) */
export function useFeatures() {
  const { data } = trpc.features.useQuery(undefined, {
    staleTime: 5 * 60_000,
    retry: 1,
  });
  return { imageGeneration: data?.imageGeneration ?? false };
}
