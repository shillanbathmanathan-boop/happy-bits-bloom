import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is CAAM certification?",
    a: "CAAM (Civil Aviation Authority of Malaysia) certification ensures drone pilots meet national safety and operational standards. All pilots listed on DroneHire hold valid Remote Operator Certificates issued by CAAM.",
  },
  {
    q: "How do I hire a drone pilot?",
    a: "Simply browse our directory, filter by location and specialty, then contact the pilot directly via WhatsApp. There's no middleman — you negotiate scope, pricing, and schedule directly with the professional.",
  },
  {
    q: "How much does a drone service cost?",
    a: "Pricing varies by service type, duration, and complexity. Roof inspections typically range from RM 300–800, while aerial videography for events starts around RM 500. Contact pilots directly for accurate quotes.",
  },
  {
    q: "Is it legal to fly drones in Malaysia?",
    a: "Yes, but operators must comply with CAAM regulations. Commercial drone operations require a valid Remote Operator Certificate. All pilots on DroneHire are verified to meet these requirements.",
  },
  {
    q: "Can I list my drone services for free?",
    a: "Absolutely! DroneHire is free for CAAM-certified pilots. Register through our Get Listed page, and your profile will be visible to potential clients across Malaysia.",
  },
  {
    q: "What types of drone services are available?",
    a: "Our pilots offer a wide range of services including roof inspection, agricultural spraying & mapping, real estate photography, construction monitoring, film & media production, environmental surveys, and more.",
  },
];

const FAQSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="container max-w-3xl">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          Everything you need to know about hiring drone pilots in Malaysia.
        </p>
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-heading text-sm font-semibold">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
