import type { JobStatus } from "@/types/job";
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

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  return (
    <span className={`job-status-badge ${STATUS_CLASS_MAP[status]}`}>
      {status}
    </span>
  );
}

