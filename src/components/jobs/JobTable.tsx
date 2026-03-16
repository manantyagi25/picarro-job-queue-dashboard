import type { Job } from "@/types/job";
import { formatJobCreatedAt } from "@/utils/date";
import { JobStatusBadge } from "./JobStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import "@/styles/job-table.css";

interface JobTableProps {
  jobs: Job[];
  isRetryingId?: string | null;
  onRetry: (id: string) => void;
  highlightedJobId?: string | null;
}

export function JobTable({
  jobs,
  isRetryingId,
  onRetry,
  highlightedJobId
}: JobTableProps) {
  return (
    <div className="job-table-wrapper">
      <table className="job-table">
        <thead className="job-table-header">
          <tr>
            <th className="job-table-header-cell">Job ID</th>
            <th className="job-table-header-cell">Job Type</th>
            <th className="job-table-header-cell">Status</th>
            <th className="job-table-header-cell">Created At</th>
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
                  isHighlighted ? "!bg-green-50" : ""
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5v7A2.5 2.5 0 0 0 6.5 14h5A2.5 2.5 0 0 0 14 11.5v-7A2.5 2.5 0 0 0 11.5 2h-5ZM6 4.5A.5.5 0 0 1 6.5 4h5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-7Z" />
                        <path d="M5 6a2 2 0 0 0-2 2v6.5A2.5 2.5 0 0 0 5.5 17h6a2 2 0 0 0 2-2v-1a.75.75 0 0 0-1.5 0v1a.5.5 0 0 1-.5.5h-6A1 1 0 0 1 4.5 14V8A.5.5 0 0 1 5 7.5h1a.75.75 0 0 0 0-1.5H5Z" />
                      </svg>
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

