import { Pilot, getFullLocation } from "@/lib/pilots";
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
    <Card className="group overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl hover:-translate-y-1">
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {pilot.profile_photo ? (
          <img 
            src={pilot.profile_photo} 
            alt={pilot.name} 
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary font-bold text-3xl">
            {pilot.name?.charAt(0)}
          </div>
        )}
        {pilot.caam_verified && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-amber-500/95 text-white border-none shadow-sm font-semibold backdrop-blur-sm">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> CAAM Certified
            </Badge>
          </div>
        )}
        {pilot.available !== false && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-bold text-accent-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground animate-pulse" />
              Available
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 text-foreground">{pilot.name}</h3>
          <div className="flex items-center text-amber-500 font-semibold text-sm shrink-0 ml-2">
            <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
            <span>{pilot.rating?.toFixed(1) || "5.0"}</span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground mb-3 text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
          <span className="truncate">{getFullLocation(pilot)}</span>
        </div>
        {pilot.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {pilot.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {(pilot.specialties || []).slice(0, 3).map((s) => (
            <Badge key={s} variant="secondary" className="font-normal text-[11px] px-2 py-0">
              {s}
            </Badge>
          ))}
          {(pilot.specialties || []).length > 3 && (
            <Badge variant="outline" className="font-normal text-[11px] px-2 py-0">
              +{pilot.specialties.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Link to={`/pilot/${pilot.id}`} className="w-full">
          <Button className="w-full font-bold" variant="default">View Full Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PilotCard;
