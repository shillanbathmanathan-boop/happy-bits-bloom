import { MapPin, ShieldCheck, Star, Globe, Instagram, Youtube, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PilotAvatar from "@/components/PilotAvatar";
import { getWhatsappUrl, type Pilot } from "@/lib/pilots";

const TikTokIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.72a8.19 8.19 0 0 0 3.76.92V6.69Z" />
  </svg>
);

const PilotCard = ({ pilot }: { pilot: Pilot }) => {
  const hasSocials = pilot.website || pilot.socialMedia;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-xl h-full">
        <CardContent className="flex flex-col p-6 h-full">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <PilotAvatar name={pilot.name} profilePhoto={pilot.profilePhoto} size="sm" />
              {pilot.available !== undefined && (
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
                    pilot.available ? "bg-accent" : "bg-muted-foreground/40"
                  }`}
                  title={pilot.available ? "Available" : "Busy"}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-lg font-semibold text-foreground">{pilot.name}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {pilot.location}
              </p>
            </div>
          </div>

          {/* Badges & Rating */}
          <div className="mt-3 flex items-center gap-3">
            {pilot.caamVerified && (
              <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> CAAM Verified
              </Badge>
            )}
            {pilot.rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{pilot.rating}</span>
                {pilot.reviewCount && (
                  <span className="text-muted-foreground">({pilot.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {pilot.available !== undefined && (
            <p className={`mt-2 text-xs font-medium ${pilot.available ? "text-accent" : "text-muted-foreground"}`}>
              {pilot.available ? "● Available now" : "● Currently busy"}
            </p>
          )}

          {/* Description preview */}
          {pilot.description && (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {pilot.description}
            </p>
          )}

          {/* Specialties */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pilot.specialties.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
            ))}
          </div>

          {/* Equipment */}
          {pilot.equipment && pilot.equipment.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pilot.equipment.slice(0, 3).map((e) => (
                <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
              ))}
              {pilot.equipment.length > 3 && (
                <Badge variant="outline" className="text-xs">+{pilot.equipment.length - 3} more</Badge>
              )}
            </div>
          )}

          {/* Social links */}
          {hasSocials && (
            <div className="mt-3 flex items-center gap-2">
              {pilot.website && (
                <a href={pilot.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Website">
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {pilot.socialMedia?.facebook && (
                <a href={`https://facebook.com/${pilot.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {pilot.socialMedia?.instagram && (
                <a href={`https://instagram.com/${pilot.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {pilot.socialMedia?.youtube && (
                <a href={`https://youtube.com/@${pilot.socialMedia.youtube}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="YouTube">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {pilot.socialMedia?.tiktok && (
                <a href={`https://tiktok.com/@${pilot.socialMedia.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="TikTok">
                  <TikTokIcon />
                </a>
              )}
            </div>
          )}

          {/* Actions — pushed to bottom */}
          <div className="mt-auto pt-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to={`/pilot/${pilot.id}`}>View Profile</Link>
            </Button>
            <Button size="sm" className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white border-0" asChild>
              <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PilotCard;
