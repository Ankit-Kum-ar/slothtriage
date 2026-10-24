"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Archive, BarChart3, Info, Menu } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Triage", icon: Inbox },
    { href: "/archive", label: "Archive", icon: Archive },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="text-2xl transition-transform group-hover:scale-110" role="img" aria-label="sloth">
            🦥
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg tracking-tight text-foreground">
              <span>SlothTriage</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                Async
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              The Cognitive Dread Buffer
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Tabs + Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="h-4 w-px bg-border mx-0.5" />
          <ThemeToggle />
        </div>

        {/* Mobile Navigation Drawer (shadcn Sheet) + Mobile Theme Toggle */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open mobile navigation"
              className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-foreground cursor-pointer transition-colors border border-border"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 bg-card border-border">
              <SheetHeader className="p-0 pb-4 border-b border-border text-left">
                <SheetTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                  <span className="text-xl">🦥</span>
                  <span>SlothTriage</span>
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  The Async Cognitive Buffer
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-2 pt-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
