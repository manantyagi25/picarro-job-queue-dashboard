export type JobStatus = "Running" | "Queued" | "Failed" | "Completed";

export interface Job {
  id: string;
  type: string;
  status: JobStatus;
  createdAt: string;
}

