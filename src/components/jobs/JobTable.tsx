import type { Job } from "@/types/job";
import { formatJobCreatedAt } from "@/utils/date";
import { JobStatusBadge } from "./JobStatusBadge";
import { Spinner } from "@/components/ui/Spinner";

interface JobTableProps {
  jobs: Job[];
  isRetryingId?: string | null;
  onRetry: (id: string) => void;
}

export function JobTable({ jobs, isRetryingId, onRetry }: JobTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Job ID</th>
            <th className="px-4 py-3 text-left">Job Type</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Created At</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-100">
          {jobs.map((job) => {
            const isRetrying = isRetryingId === job.id;
            const canRetry = job.status === "Failed";

            return (
              <tr key={job.id} className="hover:bg-slate-900/40">
                <td className="px-4 py-3 font-mono text-xs text-slate-300">
                  {job.id}
                </td>
                <td className="px-4 py-3 capitalize text-slate-200">
                  {job.type}
                </td>
                <td className="px-4 py-3">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {formatJobCreatedAt(job.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  {canRetry ? (
                    <button
                      type="button"
                      onClick={() => onRetry(job.id)}
                      disabled={isRetrying}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-100 shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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

