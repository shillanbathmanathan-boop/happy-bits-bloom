import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials: any[] = [];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.2, 1] },
  }),
};

const TestimonialSection = () => (
  <section className="py-20 bg-background">
    <div className="container">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Trusted by Professionals
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          See what our clients say about hiring drone pilots through DroneHire.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="relative rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              "{t.quote}"
            </p>
            <div className="mt-5 border-t pt-4">
              <p className="font-heading text-sm font-semibold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">
                {t.role} · {t.company}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSection;
