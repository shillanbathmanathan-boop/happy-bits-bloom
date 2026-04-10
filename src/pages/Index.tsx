import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PilotCard from "@/components/PilotCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPilots } from "@/lib/pilots";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const pilots = getPilots().slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <img
            src={heroBg}
            alt="Aerial view of Malaysian cityscape"
            width={1920}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="container relative z-10 flex min-h-[480px] flex-col items-center justify-center py-20 text-center">
            <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Find Certified Drone Specialists in Malaysia
            </h1>
            <p className="mt-4 max-w-xl text-lg text-primary-foreground/80">
              Connecting construction, agriculture, and real estate professionals with CAAM-certified drone pilots.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="px-8">
                <Link to="/pilots">Find a Pilot</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-primary-foreground/10 px-8 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <Link to="/register">List Your Service</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Pilots */}
        <section className="bg-muted/50 py-16">
          <div className="container">
            <h2 className="text-center font-heading text-2xl font-bold text-foreground md:text-3xl">
              Featured Verified Pilots
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">
              Trusted professionals with verified CAAM Remote Operator Certificates.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pilots.map((pilot) => (
                <PilotCard key={pilot.id} pilot={pilot} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
