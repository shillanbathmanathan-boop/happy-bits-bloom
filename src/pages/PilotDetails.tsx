import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getPilotById, getWhatsappUrl, getFullLocation } from "@/lib/pilots";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, ShieldCheck, MapPin, ArrowLeft, Globe,
  Facebook, Instagram, Youtube, Briefcase, Cpu, CheckCircle2, XCircle,
} from "lucide-react";
import PilotAvatar from "@/components/PilotAvatar";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.23V9.12a8.16 8.16 0 0 0 3.85.96V6.69Z" />
  </svg>
);

const socialLinks = (pilot: any) =>
  [
    { url: pilot.website, icon: Globe, label: "Website" },
    { url: pilot.facebook, icon: Facebook, label: "Facebook" },
    { url: pilot.instagram, icon: Instagram, label: "Instagram" },
    { url: pilot.youtube, icon: Youtube, label: "YouTube" },
    { url: pilot.tiktok, icon: TikTokIcon, label: "TikTok" },
  ].filter((l) => l.url);

const PilotDetails = () => {
  const { id } = useParams();
  const [reviewRefresh, setReviewRefresh] = useState(0);

  const { data: pilot, isLoading, error, refetch } = useQuery({
    queryKey: ["pilot", id],
    queryFn: () => getPilotById(id || ""),
    enabled: !!id,
  });

  const handleReviewChanged = () => {
    setReviewRefresh((r) => r + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !pilot) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-lg font-medium text-foreground">Pilot not found</p>
            <Link to="/pilots"><Button variant="outline">Back to Directory</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const links = socialLinks(pilot);
  const fullLocation = getFullLocation(pilot);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero header */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 pt-6 pb-0">
          <Link to="/pilots">
            <Button variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground hover:text-foreground -ml-2">
              <ArrowLeft className="h-4 w-4" /> Back to Directory
            </Button>
          </Link>
        </div>

        <motion.div
          className="container px-4 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-2xl border-4 border-background shadow-lg">
                {pilot.profile_photo ? (
                  <img src={pilot.profile_photo} alt={pilot.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                    {pilot.name?.charAt(0)}
                  </div>
                )}
              </div>
              {pilot.available !== false && (
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Name & meta */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground truncate">
                  {pilot.name}
                </h1>
                {pilot.caam_verified && (
                  <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/5 text-primary shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" /> CAAM Verified
                  </Badge>
                )}
                {pilot.available === false && (
                  <Badge variant="outline" className="gap-1 border-destructive/30 text-destructive shrink-0">
                    <XCircle className="h-3.5 w-3.5" /> Unavailable
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {fullLocation}
                </span>
                <span className="flex items-center gap-1.5">
                  <StarRating rating={Math.round(pilot.rating || 0)} size="sm" />
                  <span className="font-medium text-foreground">{pilot.rating?.toFixed(1) || "0.0"}</span>
                  <span>({pilot.review_count || 0})</span>
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-[#25D366] hover:bg-[#128C7E] shadow-sm">
                    <MessageSquare className="h-4 w-4" /> WhatsApp
                  </Button>
                </a>
                {links.length > 0 && links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Icon className="h-4 w-4" />
                      </Button>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <main className="flex-grow container px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column — info cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.section
              className="rounded-xl border bg-card p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                <Briefcase className="h-5 w-5 text-primary" /> About
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {pilot.description || "No description provided yet."}
              </p>
            </motion.section>

            {/* Specialties */}
            <motion.section
              className="rounded-xl border bg-card p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {(pilot.specialties || []).map((s) => (
                  <Badge key={s} variant="secondary" className="px-3 py-1 text-sm">
                    {s}
                  </Badge>
                ))}
              </div>
            </motion.section>

            {/* Equipment */}
            {pilot.equipment && pilot.equipment.length > 0 && (
              <motion.section
                className="rounded-xl border bg-card p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-3">
                  <Cpu className="h-5 w-5 text-primary" /> Equipment
                </h2>
                <div className="flex flex-wrap gap-2">
                  {pilot.equipment.map((item) => (
                    <Badge key={item} variant="outline" className="px-3 py-1 text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Reviews */}
            <motion.section
              className="rounded-xl border bg-card p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Reviews ({pilot.review_count || 0})
              </h2>
              <div className="space-y-5">
                <ReviewForm pilotId={pilot.id} onReviewSubmitted={handleReviewChanged} />
                <ReviewList pilotId={pilot.id} refreshKey={reviewRefresh} onReviewChanged={handleReviewChanged} />
              </div>
            </motion.section>
          </div>

          {/* Right sidebar — sticky contact card */}
          <div className="order-first lg:order-last">
            <motion.div
              className="sticky top-24 rounded-xl border bg-card p-6 space-y-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-foreground">Contact {pilot.name?.split(" ")[0]}</h3>

              <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] py-5 text-base font-semibold shadow-sm">
                  <MessageSquare className="h-5 w-5" /> WhatsApp Now
                </Button>
              </a>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground">{fullLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium text-foreground">{pilot.rating?.toFixed(1) || "0.0"} / 5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-medium text-foreground">{pilot.review_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CAAM Certified</span>
                  <span className="font-medium text-foreground">{pilot.caam_verified ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {pilot.available !== false ? (
                    <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent text-xs">Available</Badge>
                  ) : (
                    <Badge variant="outline" className="border-destructive/30 text-destructive text-xs">Unavailable</Badge>
                  )}
                </div>
              </div>

              {links.length > 0 && (
                <>
                  <div className="border-t" />
                  <div className="flex flex-wrap gap-2">
                    {links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label}>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                            <Icon className="h-4 w-4" />
                          </Button>
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PilotDetails;
