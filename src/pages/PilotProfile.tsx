import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPilotById, getWhatsappUrl, getFullLocation } from "@/lib/pilots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, ArrowLeft, Globe, Star, MessageCircle, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const PilotProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: pilot, isLoading } = useQuery({
    queryKey: ["pilot", id],
    queryFn: () => getPilotById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container max-w-3xl space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pilot) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-2xl font-bold">Pilot Not Found</h1>
            <Button asChild className="mt-4">
              <Link to="/pilots">Back to Pilots</Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-3xl px-4">
          <Button variant="ghost" size="sm" asChild className="mb-6 text-muted-foreground hover:text-foreground">
            <Link to="/pilots"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pilots</Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-4"
          >
            {/* Header Card */}
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              {/* Cover area */}
              <div className="h-28 bg-gradient-to-r from-primary/80 to-primary relative">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }} />
              </div>

              {/* Profile info */}
              <div className="px-6 md:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {pilot.profile_photo ? (
                      <img
                        src={pilot.profile_photo}
                        alt={pilot.name}
                        className="h-24 w-24 rounded-2xl object-cover ring-4 ring-card shadow-lg"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary font-heading font-bold text-3xl ring-4 ring-card shadow-lg">
                        {pilot.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-2 sm:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="font-heading text-2xl font-bold text-foreground truncate">{pilot.name}</h1>
                      {pilot.caam_verified && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 shrink-0">
                          <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {getFullLocation(pilot)}
                      </span>
                      {pilot.rating !== undefined && (
                        <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                          <Star className="h-3.5 w-3.5 fill-current" /> {pilot.rating.toFixed(1)}
                          {pilot.review_count ? (
                            <span className="text-muted-foreground font-normal">({pilot.review_count})</span>
                          ) : null}
                        </span>
                      )}
                      {pilot.available !== false && (
                        <span className="flex items-center gap-1 text-xs text-accent font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white border-0 font-semibold gap-2" size="lg" asChild>
                    <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" /> Contact via WhatsApp
                    </a>
                  </Button>
                  {pilot.website && (
                    <Button variant="outline" size="lg" asChild className="gap-2 shrink-0">
                      <a href={pilot.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" /> Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="rounded-2xl border bg-card shadow-sm p-6 md:p-8 space-y-6">
              {/* About */}
              {pilot.description && (
                <>
                  <div>
                    <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">About</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pilot.description}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Specialties */}
              <div>
                <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
                  <Camera className="h-4 w-4 text-muted-foreground" /> Specialties
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(pilot.specialties || []).map((s) => (
                    <Badge key={s} variant="secondary" className="px-3 py-1 text-xs font-medium">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              {pilot.equipment && pilot.equipment.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wide">Equipment</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pilot.equipment.map((e) => (
                        <Badge key={e} variant="outline" className="px-3 py-1 text-xs">{e}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PilotProfile;
