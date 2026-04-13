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
    <Card className="overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow rounded-xl">
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        {pilot.profile_photo ? (
          <img src={pilot.profile_photo} alt={pilot.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary text-2xl font-bold">
            {pilot.name?.charAt(0)}
          </div>
        )}
        {pilot.caam_verified && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-white/90 text-blue-600 border-none shadow-sm">
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{pilot.name}</h3>
          <div className="flex items-center text-amber-500 text-sm">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span>{pilot.rating?.toFixed(1) || "5.0"}</span>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-3 w-3 mr-1" />
          {pilot.location}
        </div>
        <div className="flex flex-wrap gap-1">
          {(pilot.specialties || []).slice(0, 3).map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0">
              {s}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/pilot/${pilot.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PilotCard;
