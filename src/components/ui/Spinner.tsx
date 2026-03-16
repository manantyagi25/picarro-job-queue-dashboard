import "@/styles/ui.css";

interface SpinnerProps {
  size?: "sm" | "md";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizeClass = size === "sm" ? "spinner-sm" : "";

  return <span className={`spinner ${sizeClass}`} aria-label="Loading" />;
}

