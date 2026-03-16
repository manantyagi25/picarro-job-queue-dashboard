import type { Job } from "@/types/job";

export async function getJobs(): Promise<Job[]> {
  const res = await fetch("/api/jobs");
  if (!res.ok) {
    throw new Error("Failed to load jobs");
  }

  return res.json();
}

export async function retryJob(id: string): Promise<Job> {
  const res = await fetch(`/api/jobs/${encodeURIComponent(id)}/retry`, {
    method: "POST"
  });

  if (!res.ok) {
    throw new Error("Failed to retry job");
  }

  return res.json();
}

