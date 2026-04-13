import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getPilots, LOCATIONS, SPECIALTIES } from "@/lib/pilots";
import PilotCard from "@/components/PilotCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Shield, Zap, ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import SEO from "@/components/SEO";

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
    const district = pilot.district?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();
    
    const matchesSearch = name.includes(search) || location.includes(search) || district.includes(search);
    const matchesLocation = locationFilter === "all" || pilot.location === locationFilter;
    const matchesSpecialty = specialtyFilter === "all" || (pilot.specialties?.includes(specialtyFilter));

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Find Expert Drone Pilots in Malaysia"
        description="The premier directory to find and hire CAAM-certified drone pilots for aerial photography, mapping, and industrial inspection across Malaysia."
        canonicalPath="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "DroneHire Malaysia",
          url: "https://happy-bits-bloom.lovable.app",
          description: "Malaysia's premier drone pilot directory",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://happy-bits-bloom.lovable.app/pilots?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with Background Image */}
        <section className="relative overflow-hidden min-h-[520px] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <img 
              src={heroBg} 
              alt="" 
              className="h-full w-full object-cover"
              width={1920}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <div className="container relative z-10 py-20 md:py-28 px-4 md:px-6">
            <div className="max-w-2xl">
              <motion.div
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary font-medium mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Shield className="h-3.5 w-3.5" /> CAAM-Certified Professionals
              </motion.div>
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Find Expert Drone Pilots{" "}
                <span className="text-primary">in Malaysia</span>
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-lg md:text-xl max-w-xl mt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                The premier directory to find and hire CAAM-certified drone pilots for aerial photography, mapping, and industrial inspection.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button size="lg" asChild className="font-bold shadow-lg shadow-primary/25 gap-2">
                  <Link to="/pilots">Browse Pilots <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="font-bold bg-background/80 backdrop-blur-sm">
                  <Link to="/register">Get Listed Free</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-card py-10">
          <div className="container grid grid-cols-3 gap-6 text-center px-4">
            {[
              { target: `${pilots.length}+`, label: "Registered Pilots" },
              { target: "14", label: "States Covered" },
              { target: "9", label: "Specialties" },
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
                  <AnimatedCounter target={stat.target} />
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
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-center text-muted-foreground mt-2 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Three simple steps to connect with the perfect drone pilot for your project.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Search, title: "Search", desc: "Browse pilots by state, district, specialty, or equipment.", step: "01" },
                { icon: Shield, title: "Verify", desc: "Check CAAM certification and ratings from past clients.", step: "02" },
                { icon: Zap, title: "Connect", desc: "Contact pilots directly via WhatsApp — no middleman.", step: "03" },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  className="relative text-center p-8 rounded-2xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="absolute top-4 right-4 text-4xl font-extrabold text-muted/50 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </span>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
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
              className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Featured Pilots
            </motion.h2>
            <motion.p
              className="text-center text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Discover top-rated drone professionals across Malaysia
            </motion.p>

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
                    placeholder="Search by name, state, or district..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">State</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
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
                  <div key={i} className="h-[420px] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPilots.map((pilot, i) => (
                  <motion.div
                    key={pilot.id}
                    custom={i % 6}
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
              <motion.div
                className="text-center py-20 bg-card rounded-2xl border-2 border-dashed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-lg font-medium">No pilots found matching your criteria.</p>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <motion.div
              className="relative overflow-hidden rounded-3xl border bg-card p-10 md:p-16 text-center"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary font-medium mb-5">
                  <Zap className="h-3.5 w-3.5" /> Join the Community
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-foreground">Are You a Drone Pilot?</h2>
                <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-lg">
                  Join Malaysia's fastest-growing drone pilot directory. Get discovered by clients across all 14 states.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  <Button size="lg" asChild className="font-bold gap-2 shadow-lg shadow-primary/20">
                    <Link to="/register">Get Listed Now — It's Free <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="font-bold gap-2">
                    <Link to="/pilots">Browse Pilots</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
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
