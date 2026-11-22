import type { Metadata } from "next"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { getSession } from "@/lib/core/server"
import { toUserRole } from "@/lib/users"
import { DASHBOARD_PATH } from "@/lib/role"


export const metadata: Metadata = {
  title: "Unauthorised — SalonBook",
}

export const dynamic = "force-dynamic"

const UnauthorisedPage = async () => {
  const session = await getSession()

  
  const primaryHref = session
    ? DASHBOARD_PATH[toUserRole(session.user.role)]
    : "/sign-in"
  const primaryLabel = session ? "Go to my dashboard" : "Sign in"

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#fdf9f6] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#eaddd8] bg-white p-8 text-center shadow-xl shadow-[#6d2e46]/10">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <ShieldAlert className="size-8" aria-hidden="true" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">
          Error 403
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#2b2b2b]">
          You can&apos;t access this page
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#8a7f7a]">
          Your account doesn&apos;t have permission to view this page. If you
          think this is a mistake, please sign in with the right account.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-xl bg-[#6d2e46] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#512033]"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-[#6d2e46] ring-1 ring-[#eaddd8] transition hover:bg-[#fdf9f6]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default UnauthorisedPage