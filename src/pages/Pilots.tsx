import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PilotCard from "@/components/PilotCard";
import { getPilots } from "@/lib/pilots";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Pilots = () => {
  const [search, setSearch] = useState("");
  const pilots = getPilots();

  const filtered = pilots.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <motion.h1
            className="font-heading text-3xl font-bold text-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find Drone Pilots
          </motion.h1>
          <motion.p
            className="mt-2 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Browse CAAM-certified drone professionals across Malaysia.
          </motion.p>

          <motion.div
            className="relative mt-6 max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </motion.div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((pilot, i) => (
                <motion.div
                  key={pilot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <PilotCard pilot={pilot} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <motion.p
              className="mt-12 text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No pilots found matching your search.
            </motion.p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pilots;
