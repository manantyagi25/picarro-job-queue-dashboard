interface SpinnerProps {
  size?: "sm" | "md";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <span
      className={`inline-block ${dimension} animate-spin rounded-full border-2 border-slate-400 border-t-transparent`}
      aria-label="Loading"
    />
  );
}

