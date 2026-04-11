import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t bg-muted/30 py-12">
    <div className="container">
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="DroneHire" className="h-7 w-auto" />
            <h3 className="font-heading text-lg font-bold text-foreground">DroneHire</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Malaysia's trusted directory for CAAM-certified drone professionals.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground">Quick Links</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/pilots" className="hover:text-foreground">Find Pilots</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Get Listed</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground">Resources</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li><a href="https://www.caam.gov.my" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Safety Regulations (CAAM)</a></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            <li><span className="cursor-default">Contact Support</span></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © 2026 DroneHire — All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
