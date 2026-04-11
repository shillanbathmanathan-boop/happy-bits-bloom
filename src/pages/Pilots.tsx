// ... imports
const Pilots = () => {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  
  // 1. FIXED: Initialize as an empty array
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. FIXED: Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getPilots();
      setPilots(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  // 3. Filter logic stays mostly the same, but add safety checks
  const filtered = pilots.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.specialties?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesLocation = !selectedLocation || p.location === selectedLocation;
    const matchesSpecialty = !selectedSpecialty || p.specialties?.includes(selectedSpecialty);
    
    // Check your DB column name: is it caam_verified or caamVerified?
    const matchesCertified = !certifiedOnly || p.caam_verified; 

    return matchesSearch && matchesLocation && matchesSpecialty && matchesCertified;
  });

  // ... (rest of your UI code)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          {/* ... heading & search UI ... */}

          {loading ? (
            <div className="mt-12 text-center text-muted-foreground">Loading local pilots...</div>
          ) : (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                {filtered.length} pilot{filtered.length !== 1 ? "s" : ""} found
              </p>
              
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((pilot, i) => (
                    <motion.div key={pilot.id} /* ... animation props ... */>
                      <PilotCard pilot={pilot} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
          {/* ... empty state ... */}
        </div>
      </main>
      <Footer />
    </div>
  );
};
