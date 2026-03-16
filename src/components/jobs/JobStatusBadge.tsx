import type { JobStatus } from "@/types/job";

interface JobStatusBadgeProps {
  status: JobStatus;
}

const STATUS_STYLES: Record<JobStatus, string> = {
  Running: "bg-blue-500/15 text-blue-300 border-blue-500/40",
  Queued: "bg-slate-500/15 text-slate-300 border-slate-500/40",
  Failed: "bg-red-500/15 text-red-300 border-red-500/40",
  Completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
};

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

