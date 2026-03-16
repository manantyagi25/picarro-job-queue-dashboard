"use client";

import { useMemo, useState, useEffect } from "react";
import { useJobs } from "@/hooks/useJobs";
import {
  JobStatusFilter,
  type JobStatusFilterValue
} from "@/components/jobs/JobStatusFilter";
import { JobTable } from "@/components/jobs/JobTable";
import { JobTableSkeleton } from "@/components/jobs/JobTableSkeleton";
import { JobStatusSummary } from "@/components/jobs/JobStatusSummary";
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
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);
  const [createdAtSortDirection, setCreatedAtSortDirection] = useState<
    "asc" | "desc"
  >("desc");
  const [now, setNow] = useState<number>(() => Date.now());

  const lastUpdatedLabel = useMemo(() => {
    if (!jobsQuery.dataUpdatedAt) return "Never updated";
    const diffMs = now - jobsQuery.dataUpdatedAt;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 10) return "just now";
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }, [jobsQuery.dataUpdatedAt, now]);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const filteredJobs = useMemo(() => {
    if (!jobsQuery.data) return [];

    const base =
      statusFilter === "All"
        ? jobsQuery.data
        : jobsQuery.data.filter((job) => job.status === statusFilter);

    return [...base].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return createdAtSortDirection === "asc" ? aTime - bTime : bTime - aTime;
    });
  }, [jobsQuery.data, statusFilter, createdAtSortDirection]);

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
        setHighlightedJobId(id);
        setTimeout(() => {
          setHighlightedJobId((current) => (current === id ? null : current));
        }, 1200);
      },
      onError: () => {
        setToast({ type: "error", message: "Retry failed — please try again" });
      }
    });
  };

  const handleToggleCreatedAtSort = () => {
    setCreatedAtSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const showInitialSpinner = jobsQuery.isLoading && !jobsQuery.isFetched;
  const showLoadError = jobsQuery.isError;

  let body: JSX.Element | null = null;

  if (showInitialSpinner) {
    body = <JobTableSkeleton />;
  } else if (showLoadError) {
    body =
      loadRetryCount === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <p className="metadata-text">Unable to load jobs.</p>
          <button
            type="button"
            onClick={handleRetryLoad}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <p className="metadata-text">
            Unable to load jobs — please try again later.
          </p>
        </div>
      );
  } else if (filteredJobs.length === 0) {
    body = <div className="empty-state">No jobs found</div>;
  } else {
    body = (
      <JobTable
        jobs={filteredJobs}
        isRetryingId={retryMutation.variables ?? null}
        onRetry={handleRetryJob}
        highlightedJobId={highlightedJobId}
        createdAtSortDirection={createdAtSortDirection}
        onToggleCreatedAtSort={handleToggleCreatedAtSort}
      />
    );
  }

  return (
    <main className="page-root">
      <div className="page-container">
        <header className="mb-4 rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div className="page-header">
              <h1 className="page-title">Job Queue Dashboard</h1>
              <p className="page-subtitle">
                Monitor running, queued, failed, and completed jobs in one place.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => jobsQuery.refetch()}
                disabled={jobsQuery.isFetching}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {jobsQuery.isFetching ? "Refreshing…" : "Refresh data"}
              </button>
              {/* <p className="text-[11px] italic text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Last updated {lastUpdatedLabel}
              </p> */}
            </div>
          </div>
        </header>

        <JobStatusSummary jobs={jobsQuery.data ?? []} />

        <section className="section flex-1 flex flex-col min-h-0">
          <div className="card flex flex-col gap-4 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <p className="metadata-text">
                Showing {filteredJobs.length} job
                {filteredJobs.length === 1 ? "" : "s"}
              </p>
              <JobStatusFilter value={statusFilter} onChange={setStatusFilter} />
            </div>

            {body}
          </div>
        </section>
      </div>

      {toast && (
        <div className="toast-container">
          <div
            className={`toast ${
              toast.type === "success" ? "toast-success" : "toast-error"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}
