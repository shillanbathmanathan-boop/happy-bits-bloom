import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPilots, LOCATIONS, SPECIALTIES } from "@/lib/pilots";
import PilotCard from "@/components/PilotCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

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
      
      <main className="flex-grow container py-8 px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          {/* Inline Hero Section */}
          <div className="text-center space-y-4 py-12 bg-slate-50 rounded-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              DroneHire Malaysia
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              The premier directory to find and hire CAAM-certified drone pilots for aerial photography, mapping, and industrial inspection.
            </p>
          </div>

          {/* Inline Search and Filters */}
          <div className="grid gap-4 md:grid-cols-4 items-end bg-white p-6 rounded-2xl border shadow-sm">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by name or location..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATIONS.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Specialty</label>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {SPECIALTIES.map(spec => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[350px] rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPilots.map((pilot) => (
                <PilotCard key={pilot.id} pilot={pilot} />
              ))}
            </div>
          )}
          
          {!isLoading && filteredPilots.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
              <p className="text-slate-500 text-lg">No pilots found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
