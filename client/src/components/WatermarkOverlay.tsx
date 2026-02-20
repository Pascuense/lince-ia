/**
 * WatermarkOverlay - Adds a subtle diagonal watermark across the page
 * to deter screenshots and unauthorized reproduction.
 * 
 * Usage: Place <WatermarkOverlay /> inside any page component.
 */
export function WatermarkOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
      style={{ opacity: 0.025 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Ctext x='50%25' y='50%25' font-family='Space Grotesk,monospace' font-size='14' fill='%2300E5FF' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 200 100)'%3E%C2%A9 ACNB IA SL %E2%80%A2 LINCE %E2%80%A2 CONFIDENCIAL%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
