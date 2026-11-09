import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardList,
  CreditCard,
  Dumbbell,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Gym ERP | Run your gym with clarity",
  description:
    "A simple workspace for managing gym members, training plans, payments, and performance.",
};

const features = [
  {
    icon: Users,
    title: "Students and plans",
    description:
      "Keep member profiles, memberships, and plan details organized in one place.",
  },
  {
    icon: Dumbbell,
    title: "Professionals and workouts",
    description:
      "Help trainers build, assign, and follow personalized workout programs.",
  },
  {
    icon: CreditCard,
    title: "Financial overview",
    description:
      "Track subscriptions, payments, and expenses without losing sight of the details.",
  },
  {
    icon: BarChart3,
    title: "Useful indicators",
    description:
      "See the activity and business snapshots that help you make your next decision.",
  },
];

const audiences = [
  {
    title: "For administrators",
    description: "One clear view of your members, team, plans, and gym operations.",
  },
  {
    title: "For trainers",
    description: "Spend less time coordinating and more time helping members progress.",
  },
  {
    title: "For students",
    description: "Keep workouts and membership information easy to find and follow.",
  },
];

function DashboardPreview() {
  return (
    <div
      aria-label="Preview of the gym management dashboard"
      className="relative mx-auto w-full max-w-xl rounded-2xl border bg-card p-4 shadow-xl shadow-slate-950/10 sm:p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Overview</p>
          <h2 className="mt-1 text-lg font-semibold">Your gym at a glance</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          This month
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[
          { label: "Active members", value: "248", change: "+12 this month" },
          { label: "Active plans", value: "06", change: "Across your gym" },
          { label: "Workouts logged", value: "1,384", change: "Across all members" },
          { label: "Payments received", value: "$12.8k", change: "Monthly overview" },
        ].map((metric) => (
          <div key={metric.label} className="rounded-xl border bg-background p-4">
            <p className="text-xs text-muted-foreground sm:text-sm">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Membership activity</p>
            <p className="mt-1 text-xs text-muted-foreground">A quick look at recent growth</p>
          </div>
          <BarChart3 aria-hidden="true" className="size-5 text-primary" />
        </div>
        <div aria-hidden="true" className="flex h-20 items-end gap-2 sm:h-24 sm:gap-3">
          {[38, 54, 46, 72, 61, 88, 68, 96, 76, 100, 82, 92].map((height, index) => (
            <div
              key={`${height}-${index}`}
              className={`flex-1 rounded-t-sm ${index === 9 ? "bg-primary" : "bg-primary/25"}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IntroductionPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_55%)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground">
              <Dumbbell aria-hidden="true" className="size-4 text-primary" />
              A smarter workspace for your gym
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Simplify the management of your gym.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Bring your members, trainers, workouts, and day-to-day operations together in one
              straightforward platform—so you can focus on building a stronger community.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-11 items-center justify-center rounded-md border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Explore features
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/sign-in">
                Sign in
              </Link>
            </p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {["Member management", "Training plans", "Gym insights"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check aria-hidden="true" className="size-4 text-success" /> {item}
                </span>
              ))}
            </div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Everything in sync</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            The essentials to run a better gym
          </h2>
          <p className="mt-4 text-muted-foreground">
            Keep the important parts of your operation connected, from a member&apos;s first day to
            their next personal best.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50">
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">One team, one view</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Made for everyone who makes your gym work.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Give each role a clear place in the process, with the information and tools they need
              to stay on the same page.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {audiences.map((audience, index) => (
              <article key={audience.title} className="rounded-xl border bg-card p-5">
                <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                <h3 className="mt-4 font-semibold">{audience.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{audience.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-10">
        <div className="order-2 lg:order-1">
          <div className="rounded-2xl border bg-card p-5 shadow-lg shadow-slate-950/5 sm:p-7">
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="font-semibold">A connected daily workflow</p>
                <p className="text-sm text-muted-foreground">From planning to progress</p>
              </div>
            </div>
            <ul className="mt-5 space-y-4">
              {[
                "Keep member and membership details close at hand",
                "Coordinate trainers and personalized workout plans",
                "Follow payments and gym activity in one workspace",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Less juggling, more momentum</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Clear information makes room for better coaching.
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Gym ERP brings the everyday details into view, helping your team spend less time
            searching across tools and more time supporting member progress.
          </p>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to make gym management feel simpler?
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Get your team and your members moving in the same direction.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-background px-5 text-sm font-medium text-foreground transition-opacity hover:opacity-90 lg:mt-0"
          >
            Create your account <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <Link href="/introduction" className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Dumbbell aria-hidden="true" className="size-4 text-primary" /> Gym ERP
          </Link>
          <p>Tools to help your gym and its community thrive.</p>
          <nav aria-label="Footer navigation" className="flex gap-5">
            <Link className="hover:text-foreground" href="#features">Features</Link>
            <Link className="hover:text-foreground" href="/plans">Plans</Link>
            <Link className="hover:text-foreground" href="/sign-in">Sign in</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
