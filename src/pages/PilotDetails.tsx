import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPilotById, getWhatsappUrl } from "@/lib/pilots";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ShieldCheck, MapPin, ArrowLeft, Star, Globe, Facebook, Instagram, Youtube } from "lucide-react";

const PilotDetails = () => {
  const { id } = useParams();
  const { data: pilot, isLoading, error } = useQuery({
    queryKey: ["pilot", id],
    queryFn: () => getPilotById(id || ""),
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !pilot) return <div className="min-h-screen flex items-center justify-center">Pilot not found.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-10 px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-6 pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
          </Button>
        </Link>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-6">
            <div className="aspect-square overflow-hidden rounded-2xl border shadow-md">
              {pilot.profile_photo ? (
                <img src={pilot.profile_photo} alt={pilot.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary text-6xl font-bold">
                  {pilot.name?.charAt(0)}
                </div>
              )}
            </div>
            <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] py-6 text-lg">
                <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp Pilot
              </Button>
            </a>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold">{pilot.name}</h1>
              {pilot.caam_verified && (
                <Badge className="bg-blue-50 text-blue-700 py-1 border-blue-100">
                  <ShieldCheck className="mr-1 h-4 w-4" /> CAAM Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center"><MapPin className="mr-1 h-4 w-4" /> {pilot.location}</div>
              <div className="flex items-center text-amber-500">
                <Star className="mr-1 h-4 w-4 fill-current" />
                {pilot.rating?.toFixed(1) || "5.0"} ({pilot.review_count || 0} reviews)
              </div>
            </div>

            <section>
              <h2 className="text-xl font-bold mb-3">About</h2>
              <p className="text-slate-600 leading-relaxed">{pilot.description || "No description provided."}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {(pilot.specialties || []).map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </section>

            {/* Social Links */}
            {(pilot.website || pilot.facebook || pilot.instagram || pilot.youtube || pilot.tiktok) && (
              <section>
                <h2 className="text-xl font-bold mb-3">Links</h2>
                <div className="flex flex-wrap gap-3">
                  {pilot.website && (
                    <a href={pilot.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Globe className="h-4 w-4" /> Website</Button>
                    </a>
                  )}
                  {pilot.facebook && (
                    <a href={pilot.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Facebook className="h-4 w-4" /> Facebook</Button>
                    </a>
                  )}
                  {pilot.instagram && (
                    <a href={pilot.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Instagram className="h-4 w-4" /> Instagram</Button>
                    </a>
                  )}
                  {pilot.youtube && (
                    <a href={pilot.youtube} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Youtube className="h-4 w-4" /> YouTube</Button>
                    </a>
                  )}
                  {pilot.tiktok && (
                    <a href={pilot.tiktok} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.23V9.12a8.16 8.16 0 0 0 3.85.96V6.69Z"/></svg>
                        TikTok
                      </Button>
                    </a>
                  )}
                </div>
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
