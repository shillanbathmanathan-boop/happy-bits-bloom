import { useState } from "react";
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
          <h1 className="font-heading text-3xl font-bold text-foreground">Find Drone Pilots</h1>
          <p className="mt-2 text-muted-foreground">Browse CAAM-certified drone professionals across Malaysia.</p>

          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pilot) => (
              <PilotCard key={pilot.id} pilot={pilot} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">No pilots found matching your search.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pilots;
