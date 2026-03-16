export function JobTableSkeleton() {
  const rows = Array.from({ length: 6 });

  return (
    <div className="job-table-wrapper">
      <table className="job-table">
        <thead className="job-table-header">
          <tr>
            <th className="job-table-header-cell">Job ID</th>
            <th className="job-table-header-cell">Job Type</th>
            <th className="job-table-header-cell">Status</th>
            <th className="job-table-header-cell">Created At</th>
            <th className="job-table-header-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index} className="job-table-body-row">
              <td className="job-id-cell">
                <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
              </td>
              <td className="job-type-cell">
                <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
              </td>
              <td className="job-table-cell">
                <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse" />
              </td>
              <td className="job-created-at-cell">
                <div className="h-3 w-28 rounded bg-slate-200 animate-pulse" />
              </td>
              <td className="job-actions-cell">
                <div className="ml-auto h-8 w-16 rounded-md bg-slate-200 animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

