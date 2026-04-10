import { MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Pilot } from "@/lib/pilots";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

const PilotCard = ({ pilot }: { pilot: Pilot }) => (
  <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-lg font-bold text-primary">
          {getInitials(pilot.name)}
        </div>
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
        <Button size="sm" className="flex-1" asChild>
          <a href={`https://wa.me/${pilot.whatsapp}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default PilotCard;
