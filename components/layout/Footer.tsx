import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border mt-auto py-5 sm:py-6 bg-card/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <span className="font-semibold text-foreground">SlothTriage</span>
          <span className="hidden sm:inline">•</span>
          <span>International Sloth Day Edition</span>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors py-1">
            Triage
          </Link>
          <Link href="/archive" className="hover:text-foreground transition-colors py-1">
            Archive
          </Link>
          <Link href="/analytics" className="hover:text-foreground transition-colors py-1">
            Analytics
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors py-1">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
