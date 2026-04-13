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
    <Card className="group overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
        {pilot.profile_photo ? (
          <img 
            src={pilot.profile_photo} 
            alt={pilot.name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary font-bold text-3xl">
            {pilot.name.charAt(0)}
          </div>
        )}
        {pilot.caam_verified && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/95 text-blue-600 border-none shadow-sm font-semibold">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl leading-tight line-clamp-1 text-slate-900">{pilot.name}</h3>
          <div className="flex items-center text-amber-500 font-medium">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span>{pilot.rating?.toFixed(1) || "5.0"}</span>
          </div>
        </div>
        <div className="flex items-center text-slate-500 mb-4 text-sm font-medium">
          <MapPin className="h-4 w-4 mr-1" />
          {pilot.location}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(pilot.specialties?.slice(0, 3) || []).map((s) => (
            <Badge key={s} variant="secondary" className="bg-slate-100 text-slate-700 font-normal text-[11px] px-2 py-0">
              {s}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Link to={`/pilot/${pilot.id}`} className="w-full">
          <Button className="w-full font-bold bg-primary hover:bg-primary/90">View Full Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PilotCard;
