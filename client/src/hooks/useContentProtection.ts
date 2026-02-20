import { useEffect } from "react";

/**
 * Content protection hook - disables right-click context menu,
 * text selection on protected elements, and common copy shortcuts.
 * 
 * Note: These are deterrents, not absolute protections.
 * Real protection comes from server-side measures and legal frameworks.
 */
export function useContentProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow right-click on input/textarea for usability
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
    };

    // Block common copy/save shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Allow shortcuts in input/textarea
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      // Ctrl+S (save), Ctrl+U (view source), Ctrl+Shift+I (devtools)
      if (e.ctrlKey && (e.key === "s" || e.key === "u")) {
        e.preventDefault();
      }
      // F12 (devtools) - deterrent only
      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    // Disable drag on images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Add CSS to prevent text selection on protected content
    const style = document.createElement("style");
    style.id = "lince-content-protection";
    style.textContent = `
      .protected-content {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .protected-content input,
      .protected-content textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      const existingStyle = document.getElementById("lince-content-protection");
      if (existingStyle) existingStyle.remove();
    };
  }, []);
}
