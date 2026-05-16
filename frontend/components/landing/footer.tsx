import Link from "next/link";
import { Shield, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-success p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-bg">
                <Shield className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <span className="font-semibold">Fake News Detector</span>
          </Link>
          <p className="mt-4 text-sm text-text-muted max-w-sm">
            Production-grade ML for misinformation detection. Open architecture,
            calibrated confidence, polished analytics.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-text-dim mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#features" className="text-text-muted hover:text-text">Features</Link></li>
            <li><Link href="#workflow" className="text-text-muted hover:text-text">How it works</Link></li>
            <li><Link href="#faq" className="text-text-muted hover:text-text">FAQ</Link></li>
            <li><Link href="/dashboard" className="text-text-muted hover:text-text">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-text-dim mb-3">
            Resources
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login" className="text-text-muted hover:text-text">Sign in</Link></li>
            <li><Link href="/register" className="text-text-muted hover:text-text">Create account</Link></li>
            <li>
              <a
                href="https://github.com/kapilsinghnegi/Fake-News-Detection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text inline-flex items-center gap-1"
              >
                <Github className="h-3.5 w-3.5" /> ML reference
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-dim">
            © {new Date().getFullYear()} Fake News Detector AI · Built with Next.js, FastAPI, and scikit-learn.
          </p>
          <p className="text-xs text-text-dim">
            For research and editorial use. Always verify with primary sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
