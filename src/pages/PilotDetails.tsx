import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPilotById, getWhatsappUrl } from "@/lib/pilots";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ShieldCheck, MapPin, ArrowLeft, Star } from "lucide-react";

const PilotDetails = () => {
  const { id } = useParams();
  const { data: pilot, isLoading, error } = useQuery({
    queryKey: ["pilot", id],
    queryFn: () => getPilotById(id || ""),
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  if (error || !pilot) return <div className="min-h-screen flex items-center justify-center">Pilot not found.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Directory
          </Button>
        </Link>

        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden rounded-2xl border shadow-lg">
              {pilot.profile_photo ? (
                <img src={pilot.profile_photo} alt={pilot.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary text-7xl font-bold">
                  {pilot.name.charAt(0)}
                </div>
              )}
            </div>
            <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] py-7 text-lg shadow-lg">
                <MessageSquare className="mr-2 h-5 w-5" /> Contact via WhatsApp
              </Button>
            </a>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="border-b pb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-5xl font-bold tracking-tight">{pilot.name}</h1>
                {pilot.caam_verified && (
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200 py-1.5 px-3">
                    <ShieldCheck className="mr-1.5 h-4 w-4" /> CAAM Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> {pilot.location}</div>
                <div className="flex items-center text-amber-500 font-semibold">
                  <Star className="mr-1.5 h-5 w-5 fill-current" />
                  {pilot.rating?.toFixed(1) || "5.0"} ({pilot.review_count || 0} reviews)
                </div>
              </div>
            </div>

            <section>
              <h3 className="text-2xl font-bold mb-4">Professional Bio</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{pilot.description || "Information coming soon."}</p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2.5">
                {(pilot.specialties || []).map((s) => (
                  <Badge key={s} variant="secondary" className="px-4 py-1.5 text-sm">{s}</Badge>
                ))}
              </div>
            </section>

            {pilot.equipment && pilot.equipment.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-4">Gear & Equipment</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground text-lg">
                  {pilot.equipment.map((item) => <li key={item} className="flex items-center"><span className="mr-3 h-2 w-2 rounded-full bg-primary" /> {item}</li>)}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PilotDetails;
