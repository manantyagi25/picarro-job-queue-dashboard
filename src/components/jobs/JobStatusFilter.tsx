import type { JobStatus } from "@/types/job";

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
    <label className="flex items-center gap-2 text-sm text-slate-300">
      <span>Status:</span>
      <select
        className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 shadow-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
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

