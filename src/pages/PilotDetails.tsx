import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPilotById, getWhatsappUrl } from "@/lib/pilots";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ShieldCheck, MapPin, ArrowLeft, Star, Share2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container py-12 px-4 md:px-6">
        <Link to="/">
          <Button variant="ghost" className="mb-8 group hover:bg-transparent pl-0">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Directory
          </Button>
        </Link>

        <div className="grid gap-12 lg:grid-cols-3 items-start">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200 shadow-md">
              {pilot.profile_photo ? (
                <img src={pilot.profile_photo} alt={pilot.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary text-8xl font-bold">
                  {pilot.name.charAt(0)}
                </div>
              )}
            </div>
            <a href={getWhatsappUrl(pilot.whatsapp)} target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] py-7 text-lg font-bold shadow-md rounded-2xl">
                <MessageSquare className="mr-2 h-5 w-5" /> Chat via WhatsApp
              </Button>
            </a>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">{pilot.name}</h1>
                {pilot.caam_verified && (
                  <Badge className="bg-blue-50 text-blue-600 border border-blue-100 py-1.5 px-4 rounded-full">
                    <ShieldCheck className="mr-1.5 h-4 w-4" /> CAAM Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-600 text-lg">
                <div className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" /> {pilot.location}</div>
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="mr-1.5 h-5 w-5 fill-current" />
                  {pilot.rating?.toFixed(1) || "5.0"} <span className="text-slate-400 font-normal ml-1">({pilot.review_count || 0} reviews)</span>
                </div>
              </div>
            </div>

            <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">About the Pilot</h3>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {pilot.description || `${pilot.name} is a professional drone operator serving the ${pilot.location} area with custom aerial solutions.`}
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {(pilot.specialties || []).map((s) => (
                  <Badge key={s} variant="secondary" className="px-5 py-2 text-md rounded-xl bg-slate-100 text-slate-800">
                    {s}
                  </Badge>
                ))}
              </div>
            </section>

            {pilot.equipment && pilot.equipment.length > 0 && (
              <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="text-2xl font-bold mb-4 text-slate-900">Fleet & Technology</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 text-lg">
                  {pilot.equipment.map((item) => (
                    <li key={item} className="flex items-center">
                      <div className="mr-3 h-2 w-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
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
