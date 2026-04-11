import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PilotCard from "@/components/PilotCard";
import { getPilots, SPECIALTIES, LOCATIONS } from "@/lib/pilots";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ADDED 'export' here
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
          <motion.h1 className="font-heading text-3xl font-bold">Find Drone Pilots</motion.h1>
          
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
            >
              <option value="">All States</option>
              {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            {/* ... other filters ... */}
          </div>

          {loading ? (
            <div className="mt-12 text-center">Loading local pilots...</div>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((pilot) => (
                  <motion.div key={pilot.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PilotCard pilot={pilot} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// ADDED THIS to match your App.tsx imports
export default Pilots;
