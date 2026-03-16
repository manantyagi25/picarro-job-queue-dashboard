import type { JobStatus } from "@/types/job";
import "@/styles/job-status-filter.css";

export type JobStatusFilterValue = "All" | JobStatus;

interface JobStatusFilterProps {
  value: JobStatusFilterValue;
  onChange: (value: JobStatusFilterValue) => void;
}

const OPTIONS: JobStatusFilterValue[] = [
  "All",
  "Running",
  "Queued",
  "Failed",
  "Completed"
];

export function JobStatusFilter({ value, onChange }: JobStatusFilterProps) {
  return (
    <label className="job-status-filter-label">
      <span>Status:</span>
      <select
        className="job-status-filter-select"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as JobStatusFilterValue)
        }
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

