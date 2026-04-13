import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPilots, LOCATIONS, SPECIALTIES } from "@/lib/pilots";
import PilotCard from "@/components/PilotCard";
import { Input } from "@/components/ui/button"; // Adjust if your Input component path differs
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const { data: pilots = [], isLoading } = useQuery({
    queryKey: ["pilots"],
    queryFn: getPilots,
  });

  const filteredPilots = pilots.filter((pilot) => {
    const matchesSearch = pilot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pilot.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || pilot.location === locationFilter;
    const matchesSpecialty = specialtyFilter === "all" || (pilot.specialties?.includes(specialtyFilter));

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Drone Pilot Directory</h1>
            <p className="text-muted-foreground">Find verified drone professionals across Malaysia.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm"
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {SPECIALTIES.map((spec) => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[300px] rounded-xl bg-muted animate-pulse" />
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
    </div>
  );
};

export default Index;
