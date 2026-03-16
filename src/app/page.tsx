"use client";

import { useMemo, useState, useEffect } from "react";
import { useJobs } from "@/hooks/useJobs";
import {
  JobStatusFilter,
  type JobStatusFilterValue
} from "@/components/jobs/JobStatusFilter";
import { JobTable } from "@/components/jobs/JobTable";
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

  const showInitialSpinner = jobsQuery.isLoading && !jobsQuery.isFetched;
  const showLoadError = jobsQuery.isError;

  let body: JSX.Element | null = null;

  if (showInitialSpinner) {
    body = (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Spinner />
        <p className="metadata-text">Loading jobs…</p>
      </div>
    );
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
      />
    );
  }

  return (
    <main className="page-root">
      <div className="page-container">
        <header className="page-header">
          <h1 className="page-title">Job Queue Dashboard</h1>
          <p className="page-subtitle">
            Monitor running, queued, failed, and completed jobs in one place.
          </p>
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
