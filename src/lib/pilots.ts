import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PilotCard from "@/components/PilotCard";
import { getPilots, SPECIALTIES, LOCATIONS } from "@/lib/pilots";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";

const Pilots = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPilots = async () => {
      setLoading(true);
      const data = await getPilots();
      // Safety check: Ensure data is always an array
      setPilots(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchPilots();
  }, []);

  // Filter logic with safety checks
  const filteredPilots = (pilots || []).filter((pilot) => {
    const matchesSearch = pilot.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pilot.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || pilot.specialties?.includes(selectedSpecialty);
    const matchesLocation = !selectedLocation || pilot.location === selectedLocation;
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Drone Pilots in Malaysia</h1>
        
        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 space-y-4">
           {/* ... existing search UI ... */}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading pilots...</div>
        ) : filteredPilots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPilots.map((pilot) => (
              <PilotCard key={pilot.id} pilot={pilot} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No pilots found matching your criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Pilots;
