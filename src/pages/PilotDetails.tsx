import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPilotById, getWhatsappUrl } from "@/lib/pilots";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  ArrowLeft, 
  Star,
  ExternalLink 
} from "lucide-react";

const PilotDetails = () => {
  const { id } = useParams();

  const { data: pilot, isLoading, error } = useQuery({
    queryKey: ["pilot", id],
    queryFn: () => getPilotById(id || ""),
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-20 text-center">Loading pilot profile...</div>;
  if (error || !pilot) return <div className="container py-20 text-center">Pilot not found.</div>;

  return (
    <div className="container max-w-5xl py-10">
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
        </Button>
      </Link>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted border">
            {pilot.profile_photo ? (
              <img src={pilot.profile_photo} alt={pilot.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-6xl font-bold">
                {pilot.name.charAt(0)}
              </div>
            )}
          </div>
          
          <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 text-lg">
              <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp Pilot
            </Button>
          </a>

          {pilot.website && (
            <a href={pilot.website} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" /> Visit Website
              </Button>
            </a>
          )}
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{pilot.name}</h1>
              {pilot.caam_verified && (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 py-1">
                  <ShieldCheck className="mr-1 h-4 w-4" /> CAAM Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" /> {pilot.location}
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="mr-1 h-4 w-4 fill-current" />
                {pilot.rating?.toFixed(1) || "5.0"} ({pilot.review_count || 0} reviews)
              </div>
            </div>
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {pilot.description || `${pilot.name} is a professional drone pilot based in ${pilot.location}.`}
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {pilot.specialties && pilot.specialties.length > 0 ? (
                pilot.specialties.map((s) => (
                  <Badge key={s} variant="secondary" className="px-3 py-1">{s}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground italic">No specialties listed</span>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Equipment</h3>
            {pilot.equipment && pilot.equipment.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground">
                {pilot.equipment.map((item) => (
                  <li key={item} className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No equipment listed</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PilotDetails;
