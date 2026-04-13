import { Link } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import logoIcon from "@/assets/logo-icon.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoIcon} alt="DroneHire" className="h-9 w-9 object-contain" />
          <span className="font-heading text-xl font-bold text-foreground">
            drone<span className="text-primary">hire</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">Home</Link>
          <Link to="/pilots" className="text-sm font-medium text-foreground transition-colors hover:text-primary">Find Pilots</Link>
          <Link to="/register" className="text-sm font-medium text-foreground transition-colors hover:text-primary">Get Listed</Link>
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="gap-1.5">
            <Link to="/login">
              <LogIn className="h-4 w-4" /> Sign In
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">List Your Service</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="border-t bg-background px-4 pb-4 md:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-3 pt-3">
              <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium">Home</Link>
              <Link to="/pilots" onClick={() => setOpen(false)} className="text-sm font-medium">Find Pilots</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium">Get Listed</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium flex items-center gap-1.5">
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
              <Button asChild size="sm">
                <Link to="/register" onClick={() => setOpen(false)}>List Your Service</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
