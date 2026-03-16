import type { Job } from "@/types/job";

interface JobStatusSummaryProps {
  jobs: Job[];
}

export function JobStatusSummary({ jobs }: JobStatusSummaryProps) {
  const counts = jobs.reduce(
    (acc, job) => {
      if (acc[job.status] !== undefined) {
        acc[job.status] += 1;
      }
      return acc;
    },
    {
      Running: 0,
      Queued: 0,
      Failed: 0,
      Completed: 0
    }
  );

  return (
    <section className="section">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-900/30">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Running
          </p>
          <p className="mt-2 text-2xl font-semibold text-blue-900 dark:text-blue-200">
            {counts.Running}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-gray-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-700 dark:text-slate-200">
            Queued
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-slate-50">
            {counts.Queued}
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-900/30">
          <p className="text-xs font-medium uppercase tracking-wide text-red-700 dark:text-red-300">
            Failed
          </p>
          <p className="mt-2 text-2xl font-semibold text-red-900 dark:text-red-200">
            {counts.Failed}
          </p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-900/30">
          <p className="text-xs font-medium uppercase tracking-wide text-green-700 dark:text-green-300">
            Completed
          </p>
          <p className="mt-2 text-2xl font-semibold text-green-900 dark:text-green-200">
            {counts.Completed}
          </p>
        </div>
      </div>
    </section>
  );
}

