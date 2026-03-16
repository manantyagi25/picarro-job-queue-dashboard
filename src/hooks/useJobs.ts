import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Job } from "@/types/job";
import { getJobs, retryJob } from "@/services/jobsService";

export function useJobs() {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: getJobs
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => retryJob(id),
    onSuccess: (updatedJob) => {
      queryClient.setQueryData<Job[]>(["jobs"], (current) =>
        current
          ? current.map((job) =>
              job.id === updatedJob.id ? { ...job, status: updatedJob.status } : job
            )
          : [updatedJob]
      );
    }
  });

  return {
    jobsQuery,
    retryMutation
  };
}

