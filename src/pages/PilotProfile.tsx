import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPilotById, getWhatsappUrl } from "@/lib/pilots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PilotAvatar from "@/components/PilotAvatar";
import { MapPin, ShieldCheck, ArrowLeft, Globe, Instagram, Youtube, Facebook } from "lucide-react";




const PilotProfile = () => {
  const { id } = useParams<{ id: string }>();
  const pilot = id ? getPilotById(id) : undefined;

  if (!pilot) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold">Pilot Not Found</h1>
            <Button asChild className="mt-4">
              <Link to="/pilots">Back to Pilots</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/pilots"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pilots</Link>
          </Button>

          <div className="rounded-lg border bg-card p-8">
            <div className="flex items-center gap-5">
              <PilotAvatar name={pilot.name} profilePhoto={pilot.profilePhoto} size="md" />
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">{pilot.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {pilot.location}
                </p>
              </div>
            </div>

            {pilot.caamVerified && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" /> CAAM Verified
                </Badge>
                {pilot.certificationNumber && (
                  <span className="text-sm font-medium text-foreground">#{pilot.certificationNumber}</span>
                )}
                {pilot.certificateFile && (
                  <a
                    href={pilot.certificateFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            )}

            {pilot.description && (
              <div className="mt-6">
                <h2 className="font-heading text-sm font-semibold text-foreground">About</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pilot.description}</p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="font-heading text-sm font-semibold text-foreground">Specialties</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {pilot.specialties.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>

            {pilot.equipment && pilot.equipment.length > 0 && (
              <div className="mt-6">
                <h2 className="font-heading text-sm font-semibold text-foreground">Equipment</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pilot.equipment.map((e) => (
                    <Badge key={e} variant="outline">{e}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Website & Social */}
            {(pilot.website || pilot.socialMedia) && (
              <div className="mt-6">
                <h2 className="font-heading text-sm font-semibold text-foreground">Online</h2>
                <div className="mt-2 flex flex-wrap gap-3">
                  {pilot.website && (
                    <a href={pilot.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                  {pilot.socialMedia?.facebook && (
                    <a href={`https://facebook.com/${pilot.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <Facebook className="h-4 w-4" /> Facebook
                    </a>
                  )}
                  {pilot.socialMedia?.instagram && (
                    <a href={`https://instagram.com/${pilot.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                  )}
                  {pilot.socialMedia?.youtube && (
                    <a href={`https://youtube.com/@${pilot.socialMedia.youtube}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <Youtube className="h-4 w-4" /> YouTube
                    </a>
                  )}
                  {pilot.socialMedia?.tiktok && (
                    <a href={`https://tiktok.com/@${pilot.socialMedia.tiktok}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.72a8.19 8.19 0 0 0 3.76.92V6.69Z"/></svg>
                      TikTok
                    </a>
                  )}
                </div>
              </div>
            )}

            <Button className="mt-8 w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-0" size="lg" asChild>
                <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer">
                Contact via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PilotProfile;
