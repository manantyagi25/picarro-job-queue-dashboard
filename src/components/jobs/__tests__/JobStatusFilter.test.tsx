import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { JobStatusFilter } from "../JobStatusFilter";
import type { JobStatus } from "@/types/job";

describe("JobStatusFilter", () => {
  const allOptions: ("All" | JobStatus)[] = [
    "All",
    "Running",
    "Queued",
    "Failed",
    "Completed",
  ];

  it("renders all options", () => {
    render(React.createElement(JobStatusFilter, { value: "All", onChange: () => {} }));

    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (option) => option.textContent
    );

    expect(options).toEqual(allOptions);
  });

  it("calls onChange with selected value", () => {
    const handleChange = vi.fn();
    render(
      React.createElement(JobStatusFilter, { value: "All", onChange: handleChange })
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Failed" } });

    expect(handleChange).toHaveBeenCalledWith("Failed");
  });
});

