import type { Job } from "@/types/job";
import { formatJobCreatedAt } from "@/utils/date";
import { JobStatusBadge } from "./JobStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import "@/styles/job-table.css";

interface JobTableProps {
  jobs: Job[];
  isRetryingId?: string | null;
  onRetry: (id: string) => void;
}

export function JobTable({ jobs, isRetryingId, onRetry }: JobTableProps) {
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

            return (
              <tr key={job.id} className="job-table-body-row">
                <td className="job-id-cell">{job.id}</td>
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

