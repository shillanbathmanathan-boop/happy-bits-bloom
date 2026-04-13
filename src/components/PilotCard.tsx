import { Pilot } from "@/lib/pilots";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface PilotCardProps {
  pilot: Pilot;
}

const PilotCard = ({ pilot }: PilotCardProps) => {
  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {pilot.profile_photo ? (
          <img src={pilot.profile_photo} alt={pilot.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary font-bold text-3xl">
            {pilot.name.charAt(0)}
          </div>
        )}
        {pilot.caam_verified && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-blue-600 hover:bg-white border-none backdrop-blur-sm shadow-sm">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl leading-tight line-clamp-1">{pilot.name}</h3>
          <div className="flex items-center text-amber-500 font-medium">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span>{pilot.rating?.toFixed(1) || "5.0"}</span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1.5" />
          <span className="text-sm">{pilot.location}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {/* SAFE MAP: Optional chaining and fallback array */}
          {(pilot.specialties?.slice(0, 3) || []).map((s) => (
            <Badge key={s} variant="secondary" className="bg-secondary/50 font-normal text-[11px]">
              {s}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Link to={`/pilot/${pilot.id}`} className="w-full">
          <Button className="w-full font-semibold transition-all">View Full Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PilotCard;
