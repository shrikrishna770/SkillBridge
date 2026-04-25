import { Sparkles, X, Code2, Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">SkillBridge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bridging the gap between knowledge and expertise through instant, peer-to-peer mentoring sessions. Learn from pros, in real-time.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Platform</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/requests/new" className="hover:text-primary transition-colors">Start a Session</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">My Expertise</Link></li>
              <li><Link href="/success-stories" className="hover:text-primary transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/community-rules" className="hover:text-primary transition-colors">Community Rules</Link></li>
              <li><Link href="/safety-center" className="hover:text-primary transition-colors">Safety Center</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Connect</h3>
            <div className="flex gap-4">
              {[
                { icon: X, href: "#" },
                { icon: Code2, href: "#" },
                { icon: Globe, href: "#" }
              ].map((social, idx) => (
                <Link 
                  key={idx} 
                  href={social.href} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/50 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
            © {new Date().getFullYear()} SkillBridge. Built for the future of learning.
          </p>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">/</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
