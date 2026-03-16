import type { NextApiRequest, NextApiResponse } from "next";
import { MOCK_JOBS } from "@/mocks/jobs";
import type { Job } from "@/types/job";

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Job[] | { message: string }>
) {
  if (_req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  return res.status(200).json(MOCK_JOBS);
}

