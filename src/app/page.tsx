"use client";

import { useMemo, useState, useEffect } from "react";
import { useJobs } from "@/hooks/useJobs";
import {
  JobStatusFilter,
  type JobStatusFilterValue
} from "@/components/jobs/JobStatusFilter";
import { JobTable } from "@/components/jobs/JobTable";
import { Spinner } from "@/components/ui/Spinner";

type ToastState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export default function JobsPage() {
  const { jobsQuery, retryMutation } = useJobs();
  const [statusFilter, setStatusFilter] =
    useState<JobStatusFilterValue>("All");
  const [loadRetryCount, setLoadRetryCount] = useState(0);
  const [toast, setToast] = useState<ToastState>(null);

  const filteredJobs = useMemo(() => {
    if (!jobsQuery.data) return [];
    if (statusFilter === "All") return jobsQuery.data;
    return jobsQuery.data.filter((job) => job.status === statusFilter);
  }, [jobsQuery.data, statusFilter]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const handleRetryLoad = () => {
    setLoadRetryCount((count) => count + 1);
    jobsQuery.refetch();
  };

  const handleRetryJob = (id: string) => {
    if (retryMutation.isPending) return;

    retryMutation.mutate(id, {
      onSuccess: () => {
        setToast({ type: "success", message: "Job queued for retry" });
      },
      onError: () => {
        setToast({ type: "error", message: "Retry failed — please try again" });
      }
    });
  };

  const showInitialSpinner = jobsQuery.isLoading && !jobsQuery.isFetched;
  const showLoadError = jobsQuery.isError;

  let body: JSX.Element | null = null;

  if (showInitialSpinner) {
    body = (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-300">
        <Spinner />
        <p className="text-sm">Loading jobs…</p>
      </div>
    );
  } else if (showLoadError) {
    body =
      loadRetryCount === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-300">
          <p className="text-sm">Unable to load jobs.</p>
          <button
            type="button"
            onClick={handleRetryLoad}
            className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 shadow-sm hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-300">
          <p className="text-sm">
            Unable to load jobs — please try again later.
          </p>
        </div>
      );
  } else if (filteredJobs.length === 0) {
    body = (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-300">
        <p className="text-sm">No jobs found</p>
      </div>
    );
  } else {
    body = (
      <JobTable
        jobs={filteredJobs}
        isRetryingId={retryMutation.variables ?? null}
        onRetry={handleRetryJob}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Job Queue Dashboard
            </h1>
            <p className="text-sm text-slate-300">
              Monitor running, queued, failed, and completed jobs in one place.
            </p>
          </div>
          <JobStatusFilter value={statusFilter} onChange={setStatusFilter} />
        </header>

        {body}
      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50">
          <div
            className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                : "border-red-500/40 bg-red-500/10 text-red-100"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}
