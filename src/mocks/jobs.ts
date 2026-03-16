import type { Job } from "@/types/job";

export let MOCK_JOBS: Job[] = [
  { id: "job-001", type: "export", status: "Completed", createdAt: "2026-03-12T08:00:00Z" },
  { id: "job-002", type: "sync", status: "Failed", createdAt: "2026-03-12T08:05:00Z" },
  { id: "job-003", type: "notify", status: "Running", createdAt: "2026-03-12T08:10:00Z" },
  { id: "job-004", type: "export", status: "Queued", createdAt: "2026-03-12T08:15:00Z" },
  { id: "job-005", type: "sync", status: "Failed", createdAt: "2026-03-12T08:20:00Z" },
  { id: "job-006", type: "notify", status: "Completed", createdAt: "2026-03-12T08:25:00Z" },
  { id: "job-007", type: "export", status: "Queued", createdAt: "2026-03-12T08:30:00Z" },
  { id: "job-008", type: "sync", status: "Running", createdAt: "2026-03-12T08:35:00Z" }
];

export function updateJobStatus(id: string, status: Job["status"]): Job | undefined {
  const index = MOCK_JOBS.findIndex((job) => job.id === id);
  if (index === -1) return undefined;

  const updated: Job = { ...MOCK_JOBS[index], status };
  MOCK_JOBS = [
    ...MOCK_JOBS.slice(0, index),
    updated,
    ...MOCK_JOBS.slice(index + 1)
  ];

  return updated;
}

