# Job Queue Dashboard

A React + TypeScript dashboard for operations and SRE teams to monitor background job queues, retry failed jobs without engineering intervention, and view at-a-glance status—with dark mode and a mock API.

---

## Overview

The **Job Queue Dashboard** gives operations and SRE users a single place to see running, queued, failed, and completed jobs. It addresses the need to quickly assess queue health, identify failures, and retry them without switching tools or involving engineers. The UI is built for clarity and speed: status badges, filters, sortable columns, one-click retry with clear feedback (toasts and row highlight), and summary cards for quick visibility.

---

## Features

- View background jobs in a sortable table
- Filter jobs by status
- Retry failed jobs
- Summary cards for quick status overview
- Copy job ID to clipboard
- Skeleton loading state
- Row highlight on retry
- Dark mode support
- Mock API with Next.js routes

## Tech Stack

| Layer | Choice |
|-------|--------|
| **UI** | React 18, TypeScript, Next.js 14 (App Router) |
| **Styling** | Tailwind CSS, Lucide React, next-themes (dark/light) |
| **Server state** | TanStack React Query (fetch, cache, cache updates on retry) |
| **Backend** | Next.js API routes + in-memory mock (`/api/jobs`, `/api/jobs/:id/retry`) |
| **Dates** | Native `Date#toLocaleString` via `src/utils/date.ts` (no date-fns) |
| **Testing** | Vitest, React Testing Library, jsdom |

---

## Architecture

### Server state vs UI state

- **Server state** — The job list is the single source of truth in React Query (`queryKey: ["jobs"]`). It is fetched via `getJobs`, refetched on “Refresh data” and on initial-load “Retry.” After a successful retry, the mutation’s `onSuccess` updates the cache with `queryClient.setQueryData`, replacing only the retried job with the updated one (status → `Queued`). The table and summary cards re-render from this cache, so the UI reflects the new state without a full refetch.
- **UI state** — Status filter, Created At sort direction, toast, highlighted job ID, and load-retry count live in React `useState` on the page. Filtering and sorting are derived in a `useMemo` from `jobsQuery.data`; they are not stored on the server.


### Guiding Principles

The implementation prioritizes clear separation of server and UI state, predictable data flow, and responsive user feedback so that operations users can quickly understand job status and safely retry failures without ambiguity.

### Hooks and services

- **`useJobs()`** (`src/hooks/useJobs.ts`) — Encapsulates `useQuery` (jobs list) and `useMutation` (retry). Keeps server state and retry logic in one place and simplifies the page.
- **`jobsService`** (`src/services/jobsService.ts`) — Thin layer over `fetch` for `GET /api/jobs` and `POST /api/jobs/:id/retry`. Keeps API URLs and response handling out of components.

### Component composition

The main jobs page composes layout (header, summary, filters, table area) and owns all UI state. It delegates job list rendering to `JobTable`, which receives filtered/sorted data and callbacks. Presentational pieces (badges, filter dropdown, summary cards, skeleton) are separate components so they stay modular and testable.

### How retry updates reach the UI

1. User clicks Retry → `retryMutation.mutate(id)`.
2. `retryJob(id)` calls `POST /api/jobs/:id/retry`; mock updates the job to `Queued` and returns it.
3. Mutation `onSuccess` runs: `queryClient.setQueryData(["jobs"], ...)` updates the cached list in place.
4. React Query triggers a re-render; the page’s `filteredJobs` (from `useMemo`) now include the updated job.
5. Page sets success toast and `highlightedJobId`; after 1.2s the highlight clears. The row shows “Queued” and the Retry button is no longer shown.

---

## Component Architecture

| Component | Responsibility | Modularity |
|-----------|----------------|------------|
| **JobTable** | Renders the jobs table: columns (Job ID with copy, Type, Status, Created At, Actions). Handles sort toggle, retry loading state per row, and highlighted row styling. Uses `JobStatusBadge` for status and an inline Retry button for failed jobs. | Receives `jobs`, callbacks, and UI state as props; no data fetching. |
| **JobStatusBadge** | Renders a status pill with semantic color and icon (e.g. Running + spinner, Failed + alert, Completed + check). | Pure presentational; single prop `status`. |
| **JobStatusFilter** | Dropdown to filter by status (All, Running, Queued, Failed, Completed). | Controlled component: `value` + `onChange`. |
| **JobStatusSummary** | Four summary cards (Running, Queued, Failed, Completed) with counts derived from the job list. | Pure presentational; accepts `jobs` and computes counts internally. |
| **JobTableSkeleton** | Table-shaped skeleton with 6 placeholder rows and pulse animation during initial load. | Reuses same table structure as `JobTable` for visual consistency. |
| **Sidebar** | App shell: logo, nav (Jobs Queue), collapse/expand, theme toggle. | Layout-only; no job logic. |
| **Spinner** | Small loading indicator (sm/md) used in Retry button and elsewhere. | Reusable UI primitive. |

There is no separate `JobRow` component; rows are rendered inside `JobTable` to keep the table and its behavior (retry, highlight, copy) in one place while still delegating status display to `JobStatusBadge`.

---

## State Management

- **Server data** — Fetched with `useQuery({ queryKey: ["jobs"], queryFn: getJobs })`. Refetched via “Refresh data” and on initial-load “Retry.” No polling or WebSockets in the current scope.
- **Filtering and sorting** — Applied client-side in a `useMemo`: filter by `statusFilter`, then sort by `createdAt` (asc/desc). This keeps the implementation simple and avoids backend changes; see Tradeoffs for limits.
- **Retry mutation** — `useMutation` with `mutationFn: retryJob`. On success, the cache is updated in place so the list and summary cards stay in sync without a refetch.
- **Toast and highlight** — Local state; toast auto-clears after 3s, highlight after 1.2s. Custom implementation (no toast library) to keep dependencies minimal and behavior explicit.

---

## Design & UX Decisions

- **Status color coding** — Running (blue), Queued (gray), Failed (red), Completed (green) with matching dark-mode variants. Aligns with common mental models and improves quick scanning.
- **Skeleton loading** — Table-shaped skeleton during initial fetch to avoid layout shift and signal that a table is loading.
- **Disabled retry during mutation** — Retry button shows a spinner and is disabled while the request is in flight to prevent double submissions and give clear feedback.
- **Summary cards** — Four cards above the table for quick status visibility without scrolling or filtering.
- **Row highlight on retry success** — Short green highlight on the retried row reinforces which job was queued for retry.
- **Subtle animations** — Row hover and highlight use `transition-colors duration-300`; Running badge uses a slow spin for “in progress.”
- **Dark mode** — next-themes with class-based strategy; full dark styling for table, cards, sidebar, and toasts so the app is usable in low-light environments.

---

## API Mocking

The backend is implemented with **Next.js API routes** (Pages Router) and an in-memory store:

- **`src/mocks/jobs.ts`** — Exports mutable `MOCK_JOBS` and `updateJobStatus(id, status)`. Retry sets status to `"Queued"` and returns the updated job.
- **GET /api/jobs** — Returns the full job list (200) or 405 for non-GET.
- **POST /api/jobs/:id/retry** — Updates the job to Queued, returns the job (200), or 404/400 for not found or missing id; 405 for non-POST.

The app uses relative URLs, so the same process serves both UI and API in development and production build.

---

## AI Workflow

AI tools were used as a development assistant for scaffolding, component structure, and tests. Where they accelerated work: initial Next.js + React Query setup, Tailwind and component markup, and test structure for `JobStatusBadge` and `JobStatusFilter`. Manual engineering decisions included: using Next.js API routes instead of MSW for the mock (simpler for a single full-stack app), centralizing server state in a single `useJobs` hook, implementing cache updates on retry instead of refetch-only, and choosing a custom toast and row highlight instead of a third-party toast library. The README and architecture were written and refined by hand to reflect actual code and tradeoffs.

---

## Tradeoffs

- **Mock API vs real backend** — In-memory mock keeps the project self-contained and easy to run; swapping to a real API is a matter of changing `jobsService` and optionally adding auth/env config.
- **Client-side filtering and sorting** — Simple and correct for small lists; for very large datasets, server-side filtering, sorting, and pagination would be needed.
- **Cache update vs refetch on retry** — Cache is updated in place so the UI updates immediately and stays consistent with the mutation response; a refetch could be used instead for stronger consistency with the server at the cost of an extra request and possible flash.
- **No pagination** — In scope, the list is small enough to render in one view; pagination or virtualization would be a natural next step for larger lists.
- **Single retry at a time** — The UI disables retry while a mutation is pending (and the implementation could be extended to limit concurrency) to avoid overlapping retries and unclear feedback.

---

## Future Improvements

- **Pagination or virtualization** — For large lists, add cursor-based or page-based pagination, or virtualize the table to keep DOM and render cost low.
- **Real-time updates** — Polling or WebSockets so the dashboard reflects new or updated jobs without manual refresh.
- **Job detail view** — Expand or modal with full job payload, history, and logs for debugging.
- **Observability** — Logging and metrics for retries and errors; optional correlation with backend tracing.
- **Accessibility** — ARIA labels, keyboard navigation, focus management for toasts and retry, and screen-reader-friendly status announcements.
- **Retry feedback** — Optional “Queued for retry” or similar state in the row until the next refresh or event.

---

## Running the Project

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm run start
```

---

## Testing

Vitest + React Testing Library; `@` alias points to `src`.

- **JobStatusBadge** — Renders correct label and status-specific class for Running, Queued, Failed, Completed.
- **JobStatusFilter** — Renders all options and calls `onChange` with the selected value.

Run tests:

```bash
npm test
```

---

## Live Demo & Deployment

**Live demo:** [https://picarro-job-queue-dashboard.vercel.app/](https://picarro-job-queue-dashboard.vercel.app/)

**Vercel:** Connect the repo, use the default Next.js preset. Build: `npm run build`, output: `.next`. No environment variables required for the current mock API.
