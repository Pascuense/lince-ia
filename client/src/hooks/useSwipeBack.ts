import { useEffect, useRef } from "react";

/**
 * useSwipeBack — Detects swipe from the left edge of the screen to navigate back.
 * 
 * - Only triggers when touch starts within 30px of left edge
 * - Requires minimum 80px horizontal swipe distance
 * - Ignores vertical swipes (angle > 45°)
 * - Uses browser history.back() or fallback to "/"
 */
export function useSwipeBack(enabled = true) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isEdgeTouch = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const EDGE_THRESHOLD = 30; // px from left edge
    const MIN_SWIPE_DISTANCE = 80; // px minimum swipe
    const MAX_VERTICAL_RATIO = 1; // tan(45°) = 1

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX <= EDGE_THRESHOLD) {
        isEdgeTouch.current = true;
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
      } else {
        isEdgeTouch.current = false;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isEdgeTouch.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // Must swipe right, far enough, and not too vertical
      if (deltaX >= MIN_SWIPE_DISTANCE && deltaY / deltaX <= MAX_VERTICAL_RATIO) {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "/";
        }
      }

      isEdgeTouch.current = false;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled]);
}
