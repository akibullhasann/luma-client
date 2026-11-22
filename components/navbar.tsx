"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiArrowLeftEndOnRectangle,
  HiBars3,
  HiChevronDown,
  HiHome,
  HiScissors,
  HiSparkles,
  HiSquares2X2,
  HiStar,
  HiUser,
  HiUserCircle,
} from "react-icons/hi2";

import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "cn";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavUser = {
  name?: string | null;
  email?: string;
  image?: string | null;
  role?: string;
};

const publicLinks = [
  { href: "/", label: "Home", icon: HiHome },
  { href: "/services", label: "Browse Services", icon: HiScissors },
  { href: "/#why-choose-us", label: "Why Choose Us", icon: HiStar },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const user = session?.user as NavUser | undefined;
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = user?.role === "admin";
  const dashboardHref = isAdmin ? "/dashboard/admin" : "/dashboard/patrons";

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = (user?.name ?? user?.email ?? "LU")
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const linkClass = (href: string) =>
    cn(
      buttonVariants({ variant: "ghost", size: "sm" }),
      "rounded-full px-4 text-sm font-medium",
      isActive(href) ? "bg-rose-soft text-plum hover:bg-rose-soft" : "text-ink"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blush bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plum"
          aria-label="Luma home"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-plum text-cream shadow-sm">
            <HiSparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight text-plum">
            Luma
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="h-8 w-24 animate-pulse rounded-full bg-blush/70" />
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full border-blush bg-cream px-1.5 text-plum hover:bg-rose-soft/60"
                    />
                  }
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt=""
                      className="size-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex size-7 items-center justify-center rounded-full bg-rose-soft text-xs font-semibold text-plum">
                      {initials}
                    </span>
                  )}
                  <span className="hidden max-w-28 truncate sm:inline">
                    {user.name ?? user.email}
                  </span>
                  <HiChevronDown className="size-3.5" aria-hidden="true" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-xl border border-blush bg-cream p-1.5 text-ink"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-3 py-2">
                      <span className="block truncate text-sm font-semibold text-plum">
                        {user.name ?? "Luma member"}
                      </span>
                      <span className="block truncate text-xs font-normal text-luma-muted">
                        {user.email}
                      </span>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-blush" />
                  <DropdownMenuItem
                    render={<Link href="/profile" />}
                    className="gap-2"
                  >
                    <HiUserCircle className="size-4 text-plum" aria-hidden="true" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href={dashboardHref} />}
                    className="gap-2"
                  >
                    <HiSquares2X2
                      className="size-4 text-plum"
                      aria-hidden="true"
                    />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blush" />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <HiArrowLeftEndOnRectangle
                      className="size-4"
                      aria-hidden="true"
                    />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden rounded-full px-4 text-ink hover:text-plum sm:inline-flex"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full bg-plum px-5 text-cream hover:bg-plum-deep"
                )}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Open menu"
                  className="border-blush text-plum md:hidden"
                />
              }
            >
              <HiBars3 className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-r border-blush bg-cream p-0 text-ink"
            >
              <SheetHeader className="border-b border-blush px-5 py-4">
                <SheetTitle className="flex items-center gap-2 text-plum">
                  <span className="flex size-8 items-center justify-center rounded-full bg-plum text-cream">
                    <HiSparkles className="size-4" aria-hidden="true" />
                  </span>
                  Luma
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-1 p-4">
                {publicLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <SheetClose
                      key={link.href}
                      nativeButton={false}
                      render={<Link href={link.href} />}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-rose-soft/70",
                          isActive(link.href)
                            ? "bg-rose-soft text-plum"
                            : "text-ink"
                        )}
                      >
                        <Icon className="size-5 shrink-0" aria-hidden="true" />
                        {link.label}
                      </span>
                    </SheetClose>
                  );
                })}

                <Separator className="my-2 bg-blush" />

                {user ? (
                  <>
                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/profile" />}
                    >
                      <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-rose-soft/70">
                        <HiUser
                          className="size-5 shrink-0"
                          aria-hidden="true"
                        />
                        My Profile
                      </span>
                    </SheetClose>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="justify-start gap-3 px-3 py-2.5 text-sm font-medium text-plum hover:bg-rose-soft/70"
                    >
                      <HiArrowLeftEndOnRectangle
                        className="size-5 shrink-0"
                        aria-hidden="true"
                      />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/sign-in" />}
                    >
                      <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-rose-soft/70">
                        <HiUser
                          className="size-5 shrink-0"
                          aria-hidden="true"
                        />
                        Sign In
                      </span>
                    </SheetClose>
                    <SheetClose
                      nativeButton={false}
                      render={<Link href="/sign-up" />}
                    >
                      <span className="flex items-center gap-3 rounded-lg bg-plum px-3 py-2.5 text-sm font-medium text-cream">
                        <HiUserCircle
                          className="size-5 shrink-0"
                          aria-hidden="true"
                        />
                        Sign Up
                      </span>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
