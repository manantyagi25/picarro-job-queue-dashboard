import type { JobStatus } from "@/types/job";
import { Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import "@/styles/job-status-badge.css";

interface JobStatusBadgeProps {
  status: JobStatus;
}

const STATUS_CLASS_MAP: Record<JobStatus, string> = {
  Running: "job-status-running",
  Queued: "job-status-queued",
  Failed: "job-status-failed",
  Completed: "job-status-completed"
};

const STATUS_ICON_MAP: Record<JobStatus, JSX.Element> = {
  Running: <Loader2 className="h-3.5 w-3.5 animate-spin-slow" />,
  Queued: <Clock className="h-3.5 w-3.5" />,
  Failed: <AlertCircle className="h-3.5 w-3.5" />,
  Completed: <CheckCircle2 className="h-3.5 w-3.5" />
};

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  return (
    <span className={`job-status-badge ${STATUS_CLASS_MAP[status]}`}>
      {STATUS_ICON_MAP[status]}
      <span className="leading-none">{status}</span>
    </span>
  );
}

