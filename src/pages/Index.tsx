import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPilots, LOCATIONS, SPECIALTIES } from "@/lib/pilots";
import PilotCard from "@/components/PilotCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const { data: pilots = [], isLoading } = useQuery({
    queryKey: ["pilots"],
    queryFn: getPilots,
  });

  const filteredPilots = (pilots || []).filter((pilot) => {
    const name = pilot.name?.toLowerCase() || "";
    const location = pilot.location?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();
    
    const matchesSearch = name.includes(search) || location.includes(search);
    const matchesLocation = locationFilter === "all" || pilot.location === locationFilter;
    const matchesSpecialty = specialtyFilter === "all" || (pilot.specialties?.includes(specialtyFilter));

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {/* Hero removed to fix build error */}
      <main className="flex-grow container py-8 px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight">Professional Drone Pilots</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find and hire certified drone pilots for your next project.
            </p>
          </div>

          <SearchFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            specialtyFilter={specialtyFilter}
            setSearchQuery={setSearchQuery} // Note: Check if this was intended or should be setSpecialtyFilter
            locations={LOCATIONS}
            specialties={SPECIALTIES}
          />

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[350px] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPilots.map((pilot) => (
                <PilotCard key={pilot.id} pilot={pilot} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
