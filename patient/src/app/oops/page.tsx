import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, OctagonAlert } from "lucide-react"
import { useParams } from "next/navigation"

export const metadata = {
  title: "Findr — Error",
  description: "We ran into an issue",
}

export default async function OopsPage({ searchParams }: {
  searchParams: Promise<{ code?: string; message?: string }>
}) {
  const filters = (await searchParams);;
  // const params = useParams<{ code?: string; message?: string }>()
  const code = filters?.code ?? "ERROR"
  const message = filters?.message ?? "We hit a snag while processing your request."

  return (
    <main className="relative mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 md:px-10">
      {/* Background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 " />
        <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-400/10" />
        <div className="absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-neutral-200/50 blur-3xl dark:bg-neutral-800/40" />
      </div>

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-3 py-1 text-xs font-medium text-amber-800 shadow-sm backdrop-blur dark:border-amber-300/30 dark:bg-white/5 dark:text-amber-200">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Findr
      </div>

      <section className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
          <OctagonAlert className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text text-transparent dark:from-white dark:to-neutral-300">
            We ran into an issue
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">{message}</p>

        <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">Code: {code}</div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" className="rounded-lg bg-transparent">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild className="rounded-lg bg-lime-600 text-white hover:bg-lime-700">
            <Link href="/profile">Go to profile</Link>
          </Button>
        </div>

      </section>
    </main>
  )
}

