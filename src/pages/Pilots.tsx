import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PilotCard from "@/components/PilotCard";
import { getPilots, SPECIALTIES, LOCATIONS } from "@/lib/pilots";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Pilots = () => {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getPilots();
      setPilots(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const filtered = pilots.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.district?.toLowerCase().includes(search.toLowerCase()) ||
      p.specialties?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesLocation = !selectedLocation || p.location === selectedLocation;
    const matchesSpecialty = !selectedSpecialty || p.specialties?.includes(selectedSpecialty);
    const matchesCertified = !certifiedOnly || p.caam_verified;

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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-heading text-3xl font-bold text-foreground">Find Drone Pilots</h1>
            <p className="text-muted-foreground mt-1">Browse certified drone professionals across Malaysia</p>
          </motion.div>
          
          <motion.div
            className="relative mt-6 max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, state, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </motion.div>

          <motion.div
            className="mt-4 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All States</option>
              {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={certifiedOnly}
                onChange={(e) => setCertifiedOnly(e.target.checked)}
                className="rounded"
              />
              CAAM Certified
            </label>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <X className="h-3 w-3" /> Clear filters
              </button>
            )}
          </motion.div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedLocation && <Badge variant="secondary">{selectedLocation} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedLocation("")} /></Badge>}
              {selectedSpecialty && <Badge variant="secondary">{selectedSpecialty} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedSpecialty("")} /></Badge>}
              {certifiedOnly && <Badge variant="secondary">CAAM Only <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setCertifiedOnly(false)} /></Badge>}
            </div>
          )}

          <p className="mt-4 text-sm text-muted-foreground">{filtered.length} pilot{filtered.length !== 1 ? "s" : ""} found</p>

          {loading ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[420px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((pilot) => (
                  <motion.div key={pilot.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                    <PilotCard pilot={pilot} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div
              className="text-center py-20 mt-6 bg-card rounded-2xl border-2 border-dashed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground text-lg font-medium">No pilots found.</p>
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pilots;
