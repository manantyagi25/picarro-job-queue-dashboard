import type { NextApiRequest, NextApiResponse } from "next";
import type { Job } from "@/types/job";
import { updateJobStatus } from "@/mocks/jobs";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Job | { message: string }>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;
  const jobId = Array.isArray(id) ? id[0] : id;

  if (!jobId) {
    return res.status(400).json({ message: "Job ID is required" });
  }

  const updated = updateJobStatus(jobId, "Queued");

  if (!updated) {
    return res.status(404).json({ message: "Job not found" });
  }

  return res.status(200).json(updated);
}

