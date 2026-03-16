import type { Job } from "@/types/job";
import { formatJobCreatedAt } from "@/utils/date";
import { JobStatusBadge } from "./JobStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { Copy, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import "@/styles/job-table.css";

interface JobTableProps {
  jobs: Job[];
  isRetryingId?: string | null;
  onRetry: (id: string) => void;
  highlightedJobId?: string | null;
  createdAtSortDirection: "asc" | "desc";
  onToggleCreatedAtSort: () => void;
}

export function JobTable({
  jobs,
  isRetryingId,
  onRetry,
  highlightedJobId,
  createdAtSortDirection,
  onToggleCreatedAtSort
}: JobTableProps) {
  return (
    <div className="job-table-wrapper">
      <table className="job-table">
        <thead className="job-table-header">
          <tr>
            <th className="job-table-header-cell">Job ID</th>
            <th className="job-table-header-cell">Job Type</th>
            <th className="job-table-header-cell">Status</th>
            <th className="job-table-header-cell">
              <button
                type="button"
                onClick={onToggleCreatedAtSort}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-100 dark:hover:text-slate-50"
              >
                <span>Created At</span>
                {createdAtSortDirection === "asc" ? (
                  <ArrowUp className="h-3 w-3" />
                ) : createdAtSortDirection === "desc" ? (
                  <ArrowDown className="h-3 w-3" />
                ) : (
                  <ArrowUpDown className="h-3 w-3" />
                )}
              </button>
            </th>
            <th className="job-table-header-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const isRetrying = isRetryingId === job.id;
            const canRetry = job.status === "Failed";
            const isHighlighted = highlightedJobId === job.id;

            return (
              <tr
                key={job.id}
                className={`job-table-body-row transition-colors duration-300 ${
                  isHighlighted ? "!bg-green-50 dark:!bg-green-900/40" : ""
                }`}
              >
                <td className="job-id-cell">
                  <div className="flex items-center gap-2">
                    <span>{job.id}</span>
                    <button
                      type="button"
                      aria-label="Copy job ID"
                      onClick={() => navigator.clipboard?.writeText(job.id)}
                      className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="job-type-cell">{job.type}</td>
                <td className="job-table-cell">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="job-created-at-cell">
                  {formatJobCreatedAt(job.createdAt)}
                </td>
                <td className="job-actions-cell">
                  {canRetry ? (
                    <button
                      type="button"
                      onClick={() => onRetry(job.id)}
                      disabled={isRetrying}
                      className="retry-button"
                    >
                      {isRetrying && <Spinner size="sm" />}
                      <span>Retry</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

