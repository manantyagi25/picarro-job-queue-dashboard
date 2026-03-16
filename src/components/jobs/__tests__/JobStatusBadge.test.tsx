import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JobStatusBadge } from "../JobStatusBadge";
import type { JobStatus } from "@/types/job";

describe("JobStatusBadge", () => {
  const statuses: JobStatus[] = ["Running", "Queued", "Failed", "Completed"];

  it("renders the status text", () => {
    statuses.forEach((status) => {
      render(React.createElement(JobStatusBadge, { status }));
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  it("applies the correct status class", () => {
    statuses.forEach((status) => {
      const { container, unmount } = render(
        React.createElement(JobStatusBadge, { status })
      );
      const badge = container.querySelector(".job-status-badge");
      expect(badge).toHaveClass(`job-status-${status.toLowerCase()}`);
      unmount();
    });
  });
});

