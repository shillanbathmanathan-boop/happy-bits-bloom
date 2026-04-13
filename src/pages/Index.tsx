import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getPilots, LOCATIONS, SPECIALTIES } from "@/lib/pilots";
import PilotCard from "@/components/PilotCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Shield, Zap } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

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
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
          <div className="container relative text-center px-4 md:px-6">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Find Expert Drone Pilots{" "}
              <span className="text-primary">in Malaysia</span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              The premier directory to find and hire CAAM-certified drone pilots for aerial photography, mapping, and industrial inspection.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" asChild className="font-bold shadow-lg shadow-primary/20">
                <Link to="/pilots">Browse Pilots</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="font-bold">
                <Link to="/register">Get Listed Free</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-card py-10">
          <div className="container grid grid-cols-3 gap-6 text-center px-4">
            {[
              { target: `${pilots.length || 50}+`, label: "Registered Pilots" },
              { target: "14", label: "States Covered" },
              { target: "8", label: "Specialties" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-center text-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Search, title: "Search", desc: "Browse pilots by location, specialty, or equipment." },
                { icon: Shield, title: "Verify", desc: "Check CAAM certification and ratings from past clients." },
                { icon: Zap, title: "Connect", desc: "Contact pilots directly via WhatsApp — no middleman." },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  className="text-center p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow duration-300"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Results */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Featured Pilots
            </motion.h2>

            <motion.div
              className="grid gap-4 md:grid-cols-4 items-end bg-card p-6 rounded-2xl border shadow-sm mb-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or location..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Location</label>
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
                <label className="text-sm font-semibold text-foreground">Specialty</label>
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
            </motion.div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[350px] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPilots.map((pilot, i) => (
                  <motion.div
                    key={pilot.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <PilotCard pilot={pilot} />
                  </motion.div>
                ))}
              </div>
            )}
            
            {!isLoading && filteredPilots.length === 0 && (
              <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed">
                <p className="text-muted-foreground text-lg">No pilots found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
