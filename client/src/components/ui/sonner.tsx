import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "oklch(0.14 0.015 240)",
          "--normal-text": "#ffffff",
          "--normal-border": "oklch(0.82 0.15 195 / 0.3)",
          "--success-bg": "oklch(0.14 0.015 240)",
          "--success-text": "oklch(0.82 0.15 195)",
          "--success-border": "oklch(0.82 0.15 195 / 0.3)",
          "--error-bg": "oklch(0.14 0.015 240)",
          "--error-text": "#f87171",
          "--error-border": "rgba(248, 113, 113, 0.3)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
