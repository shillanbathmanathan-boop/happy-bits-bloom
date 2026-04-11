import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoIcon from "@/assets/logo-icon.png";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing! We'll keep you updated.");
    setEmail("");
  };

  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logoIcon} alt="DroneHire" className="h-8 w-8 object-contain" />
              <h3 className="font-heading text-lg font-bold text-foreground">
                drone<span className="text-primary">hire</span>
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Malaysia's trusted directory for CAAM-certified drone professionals.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li><Link to="/pilots" className="hover:text-foreground transition-colors">Find Pilots</Link></li>
              <li><Link to="/register" className="hover:text-foreground transition-colors">Get Listed</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Resources</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li><a href="https://www.caam.gov.my" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Safety Regulations (CAAM)</a></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><span className="cursor-default">Contact Support</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground">Stay Updated</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Get notified about new pilots and features.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 text-sm"
                required
              />
              <Button type="submit" size="sm" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © 2026 DroneHire — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
