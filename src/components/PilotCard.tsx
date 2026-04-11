import { MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PilotAvatar from "@/components/PilotAvatar";
import { getWhatsappUrl, type Pilot } from "@/lib/pilots";

const PilotCard = ({ pilot }: { pilot: Pilot }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <PilotAvatar name={pilot.name} profilePhoto={pilot.profilePhoto} size="sm" />
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-lg font-semibold text-foreground">{pilot.name}</h3>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {pilot.location}
            </p>
          </div>
        </div>

        {pilot.caamVerified && (
          <Badge className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" /> CAAM Verified
          </Badge>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {pilot.specialties.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
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

export default PilotCard;
