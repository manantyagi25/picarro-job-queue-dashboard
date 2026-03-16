# Job Queue Dashboard

A React + TypeScript dashboard for operations and SRE teams to monitor background job queues, filter by status, retry failed jobs, and view at-a-glance status summaries—with dark mode and a mock API for development.

---

## Overview

The **Job Queue Dashboard** gives operations users a single place to see running, queued, failed, and completed jobs. It addresses the need to quickly assess queue health, identify failed jobs, and retry them without switching to other tools. The UI is built for clarity and speed: status badges, filters, sortable columns, and one-click retry with clear feedback (toasts and row highlight).

---

## Features

Implemented features include:

- **Job queue table** – Table view of all jobs with columns: Job ID, Job Type, Status, Created At, Actions.
- **Status color badges** – Visual badges (Running, Queued, Failed, Completed) with distinct colors and Lucide icons (e.g. spinner for Running, check for Completed).
- **Status filtering** – Dropdown to filter jobs by status (All, Running, Queued, Failed, Completed).
- **Retry failed job** – “Retry” button on failed jobs; triggers `POST /api/jobs/:id/retry`, updates cache, shows success/error toast and brief row highlight.
- **Loading states** – Initial load shows a skeleton table; refresh and retry show appropriate loading/disabled states.
- **Error handling** – Initial load error shows “Unable to load jobs” with a Retry button; retry failure shows an error toast.
- **Empty state** – “No jobs found” when the filtered list is empty.
- **Column sorting** – Created At column is sortable (asc/desc) with arrow icons.
- **Status summary cards** – Four cards showing counts for Running, Queued, Failed, and Completed.
- **Dark mode** – Theme toggle in the sidebar (next-themes); full dark styling for table, cards, and layout.
- **Skeleton loader** – Table-shaped skeleton with animated placeholders during initial fetch.
- **Copy job ID** – Copy button next to each job ID using `navigator.clipboard.writeText`.
- **Icons and animations** – Lucide icons throughout; slow spin on Running badge; row hover and highlight transitions (e.g. `transition-colors duration-300`).
- **Tests** – Unit tests for `JobStatusBadge` and `JobStatusFilter` (Vitest + React Testing Library).
- **Deployment** – No deployment configuration (e.g. Vercel/Netlify) is present in the repo; the app can be built and run with `npm run build` and `npm run start`.

---

## Tech Stack

- **React** (18) – UI components and client state.
- **TypeScript** – Typed models and props.
- **Next.js** (14) – App Router, layout, and API routes used as the mock backend.
- **Tailwind CSS** – Utility-first styling; custom component classes in `@layer components`.
- **TanStack React Query** – Server state: fetching jobs, caching, and optimistic-style cache updates on retry.
- **next-themes** – Dark/light theme with `class` strategy and no system preference.
- **Lucide React** – Icons (e.g. Copy, ArrowUp/ArrowDown, Loader2, CheckCircle2, Moon, Sun).
- **date-fns** – Not used for display; `toLocaleString` is used in `formatJobCreatedAt` in `src/utils/date.ts`.
- **Mock API** – Implemented via **Next.js API routes** (`/api/jobs`, `/api/jobs/[id]/retry`) backed by in-memory data in `src/mocks/jobs.ts`. MSW is listed in `package.json` but is not used in the application code.
- **Testing** – **Vitest** for test runner, **@testing-library/react** and **@testing-library/jest-dom** for component tests; `jsdom` environment.

---

## Architecture

- **App Router** – Root layout in `src/app/layout.tsx` wraps the app with `ThemeProvider` and `ReactQueryProvider`; main content in `src/app/page.tsx` (client component).
- **Component structure** – Page composes layout (header, summary, filters, table/empty/error/skeleton) and owns UI state (filter, sort, toast, highlighted row). Job-related UI is split into presentational components under `src/components/jobs/` and layout in `src/components/layout/`.
- **Server state vs UI state** – **Server state**: job list and its updates live in React Query (query key `["jobs"]`); retry mutation updates the cache in place. **UI state**: status filter, created-at sort direction, toast, highlighted job ID, and load-retry count are React `useState` in the page.
- **Hooks / services** – `useJobs()` in `src/hooks/useJobs.ts` encapsulates `useQuery` (get jobs) and `useMutation` (retry); `getJobs` and `retryJob` in `src/services/jobsService.ts` call the Next.js API routes.
- **Mock API design** – In-memory array `MOCK_JOBS` and `updateJobStatus(id, status)` in `src/mocks/jobs.ts`; API route handlers import this and respond with JSON. GET returns the full list; POST retry sets the job’s status to `"Queued"` and returns the updated job.

---

## Component Structure

| Component | Responsibility |
|-----------|----------------|
| **Layout** | |
| `Sidebar` | App shell: nav (Jobs Queue), collapse/expand, dark/light toggle, user placeholder. |
| **Page** | |
| `page.tsx` | Main jobs page: fetches via `useJobs`, holds filter/sort/toast/highlight state, composes header, summary, filter, and table/empty/error/skeleton; renders custom toast. |
| **Jobs** | |
| `JobStatusSummary` | Four cards showing counts per status (Running, Queued, Failed, Completed). |
| `JobStatusFilter` | Dropdown to filter by status (All or one status). |
| `JobTable` | Table of jobs: Job ID (with copy), Type, Status badge, Created At, Retry (for Failed). Handles sort toggle, retry loading state, and highlighted row. |
| `JobStatusBadge` | Badge with status-specific class and icon (e.g. Running with spinner). |
| `JobTableSkeleton` | Table skeleton with 6 placeholder rows and pulse animation. |
| **UI** | |
| `Spinner` | Small loading spinner (sm/md) used in Retry button and elsewhere. |
| **Providers** | |
| `ThemeProvider` | Wraps next-themes provider (class, default light). |
| `ReactQueryProvider` | Wraps QueryClientProvider and React Query Devtools. |

---

## State Management

- **Server state (jobs list)**  
  - Fetched with `useQuery({ queryKey: ["jobs"], queryFn: getJobs })`.  
  - Refetched via “Refresh data” and on initial load error “Retry”.  
  - After a successful retry, `onSuccess` of the retry mutation calls `queryClient.setQueryData(["jobs"], ...)` and replaces the matching job with the updated one (status set to `"Queued"`), so the table updates without a full refetch.

- **UI state (filters, interactions)**  
  - **Status filter**: `useState<JobStatusFilterValue>("All")`; applied in a `useMemo` that filters `jobsQuery.data` and then sorts by `createdAt`.  
  - **Sort**: `useState<"asc" \| "desc">("desc")` for Created At; same `useMemo` applies sort.  
  - **Toast**: `useState<ToastState>(null)`; set on retry success/error; cleared after 3 seconds.  
  - **Highlighted row**: `useState<string | null>(null)`; set to the retried job id on success, cleared after 1.2s.  
  - **Load retry count**: `useState(0)` used to show a different message after the first load-retry attempt.

- **Retry updates in the UI**  
  - Retry calls `retryMutation.mutate(id)`; on success, the mutation’s `onSuccess` updates the React Query cache and the page shows a success toast and highlights the row. The table re-renders from the updated cache, so the job’s status badge changes to Queued and the Retry button disappears.

---

## API Mocking

The “backend” is implemented with **Next.js API routes** and an in-memory store:

- **Data** – `src/mocks/jobs.ts` exports a mutable `MOCK_JOBS` array and `updateJobStatus(id, status)`, which finds the job, updates its status, mutates the in-memory list, and returns the updated job.

- **GET /api/jobs**  
  - Handler in `src/pages/api/jobs/index.ts`.  
  - Returns `200` with `MOCK_JOBS` as JSON.  
  - Responds with `405` for non-GET.

- **POST /api/jobs/:id/retry**  
  - Handler in `src/pages/api/jobs/[id]/retry.ts`.  
  - Reads `id` from the route, calls `updateJobStatus(id, "Queued")`.  
  - Returns `200` with the updated job, `404` if not found, `400` if id missing, `405` for non-POST.

The frontend uses relative URLs: `fetch("/api/jobs")` and `fetch(\`/api/jobs/${id}/retry\`, { method: "POST" })`, so the same app serves both UI and mock API in development and in a production build.

---

## AI Workflow

This README was generated by analyzing the repository. The project may have been developed with assistance from AI tools (e.g. for scaffolding, components, or tests); the exact tools and prompts are not documented in the repo. Manual decisions evident in the codebase include: using Next.js API routes instead of MSW for the mock API, centralizing server state in React Query with a single `useJobs` hook, and implementing a custom toast and row highlight instead of a toast library.

---

## Running the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

   Then open [http://localhost:3000](http://localhost:3000) in your browser.

3. (Optional) Production build and run:

   ```bash
   npm run build
   npm run start
   ```

---

## Testing

Tests are run with **Vitest** and **React Testing Library**; `vitest.setup.ts` imports `@testing-library/jest-dom`. Path alias `@` is resolved to `src` in `vitest.config.ts`.

- **JobStatusBadge** (`src/components/jobs/__tests__/JobStatusBadge.test.tsx`)  
  - Renders the status text for Running, Queued, Failed, Completed.  
  - Applies the correct status class (e.g. `job-status-running`) to the badge element.

- **JobStatusFilter** (`src/components/jobs/__tests__/JobStatusFilter.test.tsx`)  
  - Renders all options (All, Running, Queued, Failed, Completed) in the combobox.  
  - Calls `onChange` with the selected value when the user changes the select.

Run tests:

```bash
npm test
```

---

## Future Improvements

Realistic next steps that could be added with more time:

- **Pagination** – Paginate or virtualize the table for large lists to keep DOM and rendering performant.
- **Real-time updates** – Polling or WebSockets so the dashboard reflects new or updated jobs without manual refresh.
- **Accessibility** – ARIA labels, keyboard navigation, focus management for toasts and retry, and screen-reader-friendly status announcements.
- **Observability** – Logging or metrics for retries and errors; optional integration with backend tracing.
- **Larger datasets** – Server-side filtering/sorting or cursor-based pagination when the job list grows.
- **Retry feedback** – Disable or limit concurrent retries; show a “Queued for retry” state in the row until the next poll or event.

---

### Live demo

The app is deployed on Vercel here:  
[https://picarro-job-queue-dashboard.vercel.app/](https://picarro-job-queue-dashboard.vercel.app/)

### Deploying to Vercel

This project is configured as a standard Next.js app, so Vercel can use the default settings.

1. **Connect the repo to Vercel**
   - Go to [Vercel](https://vercel.com/), import the GitHub repository, and select the default **Next.js** framework preset.

2. **Build & output settings**
   - Build command: `npm run build` (or `npm run vercel-build`, which is an alias).
   - Output directory: `.next`
   - Install command: `npm install` (or `pnpm install`/`yarn install` if you switch package managers).

3. **Environment variables**
   - No environment variables are required for the current mock-API setup. If you later add real backend integration, configure the necessary variables in Vercel’s **Project Settings → Environment Variables**.

4. **Production deployments**
   - Every push to the main branch (or whatever branch you configure) will trigger a new production deployment.
   - Vercel also creates preview deployments for pull requests.
