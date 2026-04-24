import { Sparkles, X, Code2, Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md premium-gradient flex items-center justify-center">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <span className="text-lg font-bold">SkillBridge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering learners world-wide with professional skills and career-ready certifications.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Courses</Link></li>
              <li><Link href="#" className="hover:text-foreground">Certifications</Link></li>
              <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground">Enterprise</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Code2 className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SkillBridge Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
