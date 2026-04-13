import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPilots, LOCATIONS, SPECIALTIES } from "@/lib/pilots";
import PilotCard from "@/components/PilotCard";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const { data: pilots = [], isLoading } = useQuery({
    queryKey: ["pilots"],
    queryFn: getPilots,
  });

  const filteredPilots = pilots.filter((pilot) => {
    const matchesSearch = 
      pilot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilot.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || pilot.location === locationFilter;
    const matchesSpecialty = specialtyFilter === "all" || (pilot.specialties?.includes(specialtyFilter));

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-8">
        <div className="flex flex-col space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Find Your Drone Expert</h1>
            <p className="text-xl text-muted-foreground">The premier directory for professional drone services in Malaysia.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or city..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map((loc) => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger><SelectValue placeholder="Specialty" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {SPECIALTIES.map((spec) => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <div key={i} className="h-[350px] rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPilots.map((pilot) => <PilotCard key={pilot.id} pilot={pilot} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
