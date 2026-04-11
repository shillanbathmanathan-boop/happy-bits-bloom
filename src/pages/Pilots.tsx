import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PilotCard from "@/components/PilotCard";
import { getPilots, SPECIALTIES, LOCATIONS } from "@/lib/pilots";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Pilots = () => {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const pilots = getPilots();

  const filtered = pilots.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesLocation = !selectedLocation || p.location === selectedLocation;
    const matchesSpecialty = !selectedSpecialty || p.specialties.includes(selectedSpecialty);
    const matchesCertified = !certifiedOnly || p.caamVerified;

    return matchesSearch && matchesLocation && matchesSpecialty && matchesCertified;
  });

  const hasActiveFilters = selectedLocation || selectedSpecialty || certifiedOnly;

  const clearFilters = () => {
    setSelectedLocation("");
    setSelectedSpecialty("");
    setCertifiedOnly(false);
  };

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

          {/* Search */}
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

          {/* Filters */}
          <motion.div
            className="mt-4 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Filter className="h-4 w-4 text-muted-foreground" />

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All States</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary/50">
              <input
                type="checkbox"
                checked={certifiedOnly}
                onChange={(e) => setCertifiedOnly(e.target.checked)}
                className="accent-primary"
              />
              CAAM Certified Only
            </label>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </motion.div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedLocation && (
                <Badge variant="secondary" className="gap-1">
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation("")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {selectedSpecialty && (
                <Badge variant="secondary" className="gap-1">
                  {selectedSpecialty}
                  <button onClick={() => setSelectedSpecialty("")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              {certifiedOnly && (
                <Badge variant="secondary" className="gap-1">
                  CAAM Certified
                  <button onClick={() => setCertifiedOnly(false)}><X className="h-3 w-3" /></button>
                </Badge>
              )}
            </div>
          )}

          {/* Results count */}
          <p className="mt-4 text-sm text-muted-foreground">
            {filtered.length} pilot{filtered.length !== 1 ? "s" : ""} found
          </p>

          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
