import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPilotById, getWhatsappUrl, getFullLocation } from "@/lib/pilots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PilotAvatar from "@/components/PilotAvatar";
import { MapPin, ShieldCheck, ArrowLeft, Globe, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PilotProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: pilot, isLoading } = useQuery({
    queryKey: ["pilot", id],
    queryFn: () => getPilotById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container max-w-2xl space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="rounded-2xl border bg-card p-8 space-y-6">
              <div className="flex items-center gap-5">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pilot) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/pilots"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pilots</Link>
          </Button>

          <motion.div
            className="rounded-2xl border bg-card p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-5">
              <PilotAvatar name={pilot.name} profilePhoto={pilot.profile_photo} size="md" />
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">{pilot.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {pilot.location}
                </p>
                {pilot.rating !== undefined && (
                  <div className="mt-1 flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">{pilot.rating.toFixed(1)}</span>
                    {pilot.review_count !== undefined && (
                      <span className="text-xs text-muted-foreground">({pilot.review_count} reviews)</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {pilot.caam_verified && (
              <motion.div
                className="mt-4 flex flex-wrap items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" /> CAAM Verified
                </Badge>
              </motion.div>
            )}

            {pilot.description && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-heading text-sm font-semibold text-foreground">About</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pilot.description}</p>
              </motion.div>
            )}

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <h2 className="font-heading text-sm font-semibold text-foreground">Specialties</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {(pilot.specialties || []).map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </motion.div>

            {pilot.equipment && pilot.equipment.length > 0 && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="font-heading text-sm font-semibold text-foreground">Equipment</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pilot.equipment.map((e) => (
                    <Badge key={e} variant="outline">{e}</Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {pilot.website && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <h2 className="font-heading text-sm font-semibold text-foreground">Online</h2>
                <div className="mt-2">
                  <a href={pilot.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <Globe className="h-4 w-4" /> Website
                  </a>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button className="mt-8 w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-0" size="lg" asChild>
                <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer">
                  Contact via WhatsApp
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PilotProfile;
