import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">
            Picarro Job Queue Dashboard
          </h1>
          <p className="text-slate-300">
            Next.js + TypeScript project scaffold. Start building your job queue
            monitoring UI here.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium mb-2">Getting started</h2>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
              <li>Run <code>npm install</code> to install dependencies.</li>
              <li>Then run <code>npm run dev</code> to start the dev server.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
            <h2 className="text-lg font-medium mb-2">Key files</h2>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
              <li>
                <code>src/app/page.tsx</code> – main landing page.
              </li>
              <li>
                <code>src/app/layout.tsx</code> – root layout and globals.
              </li>
              <li>
                <code>src/app/(dashboard)</code> – suggested folder for views.
              </li>
            </ul>
          </div>
        </section>

        <footer className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Next.js + TypeScript starter</span>
          <Link
            href="https://nextjs.org/docs"
            className="underline underline-offset-4 hover:text-slate-200"
          >
            Next.js docs
          </Link>
        </footer>
      </div>
    </main>
  );
}
