import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PilotCard from "@/components/PilotCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialSection from "@/components/TestimonialSection";
import FAQSection from "@/components/FAQSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getPilots } from "@/lib/pilots";
import heroBg from "@/assets/hero-bg.jpg";
import { ShieldCheck, Users, MapPin, Zap, Search, MessageCircle, Plane } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stats = [
  { icon: Users, value: "50+", label: "Verified Pilots" },
  { icon: MapPin, value: "13", label: "States Covered" },
  { icon: ShieldCheck, value: "100%", label: "CAAM Certified" },
  { icon: Zap, value: "24h", label: "Avg. Response Time" },
];

const steps = [
  { icon: Search, step: "01", title: "Search", desc: "Browse verified drone pilots by location and specialty." },
  { icon: MessageCircle, step: "02", title: "Connect", desc: "Reach out directly via WhatsApp — no middleman." },
  { icon: Plane, step: "03", title: "Fly", desc: "Get your aerial work done by a certified professional." },
];

const Index = () => {
  const pilots = getPilots().slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <motion.img
            src={heroBg}
            alt="Aerial view of Malaysian cityscape"
            width={1920}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="container relative z-10 flex min-h-[560px] flex-col items-center justify-center py-20 text-center">
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShieldCheck className="h-4 w-4" />
              100% CAAM Certified Pilots
            </motion.div>
            <motion.h1
              className="max-w-3xl font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Find Certified Drone Specialists in Malaysia
            </motion.h1>
            <motion.p
              className="mt-4 max-w-xl text-lg text-primary-foreground/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Connecting construction, agriculture, and real estate professionals with CAAM-certified drone pilots.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Button asChild size="lg" className="px-8 text-base">
                <Link to="/pilots">Find a Pilot</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-primary-foreground/10 px-8 text-base text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <Link to="/register">List Your Service</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Animated Stats */}
        <section className="border-b bg-background py-14">
          <div className="container grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center text-center"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="font-heading text-3xl font-bold text-foreground">
                  <AnimatedCounter target={stat.value} />
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container">
            <motion.h2
              className="text-center font-heading text-2xl font-bold text-foreground md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="mx-auto mt-2 max-w-lg text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Three simple steps to get your drone job done.
            </motion.p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  className="group relative rounded-xl border bg-card p-8 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <s.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
                    Step {s.step}
                  </span>
                  <h3 className="mt-2 font-heading text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Pilots */}
        <section className="bg-muted/50 py-20">
          <div className="container">
            <motion.h2
              className="text-center font-heading text-2xl font-bold text-foreground md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Featured Verified Pilots
            </motion.h2>
            <motion.p
              className="mx-auto mt-2 max-w-lg text-center text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Trusted professionals with verified CAAM Remote Operator Certificates.
            </motion.p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pilots.map((pilot, i) => (
                <motion.div
                  key={pilot.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                >
                  <PilotCard pilot={pilot} />
                </motion.div>
              ))}
            </div>
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Button asChild size="lg" variant="outline">
                <Link to="/pilots">View All Pilots →</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialSection />

        {/* FAQ */}
        <FAQSection />

        {/* CTA */}
        <section className="bg-primary py-20">
          <div className="container text-center">
            <motion.h2
              className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Are You a Drone Pilot?
            </motion.h2>
            <motion.p
              className="mx-auto mt-3 max-w-md text-primary-foreground/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              List your services for free and connect with clients across Malaysia.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-6 px-10 font-semibold"
              >
                <Link to="/register">Get Listed — It's Free</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
