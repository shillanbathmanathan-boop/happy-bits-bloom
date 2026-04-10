import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addPilot } from "@/lib/pilots";
import { toast } from "sonner";

const SPECIALTIES = [
  "Roof Inspection",
  "Mapping & Survey",
  "Agriculture",
  "Real Estate",
  "Film & Media",
  "Construction",
  "Infrastructure",
  "Environmental",
];

const LOCATIONS = [
  "Kuala Lumpur", "Selangor", "Penang", "Johor", "Perak",
  "Sabah", "Sarawak", "Melaka", "Kedah", "Kelantan",
  "Pahang", "Terengganu", "Negeri Sembilan", "Perlis", "Putrajaya",
];

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [caamVerified, setCaamVerified] = useState(false);

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location || !whatsapp.trim() || selectedSpecialties.length === 0) {
      toast.error("Please fill in all required fields and select at least one specialty.");
      return;
    }

    addPilot({
      name: name.trim(),
      location,
      whatsapp: whatsapp.trim().replace(/[^0-9]/g, ""),
      specialties: selectedSpecialties,
      caamVerified,
    });

    toast.success("Your profile has been listed!");
    navigate("/pilots");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-lg">
          <h1 className="font-heading text-3xl font-bold text-foreground">List Your Drone Service</h1>
          <p className="mt-2 text-muted-foreground">
            Fill in your details below and your profile will be listed immediately on DroneHire.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmad Zulkar"
                maxLength={100}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select your state</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 60123456789"
                maxLength={15}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">Include country code (e.g. 60 for Malaysia)</p>
            </div>

            <div>
              <Label>Specialties *</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SPECIALTIES.map((s) => (
                  <label
                    key={s}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                      selectedSpecialties.includes(s)
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-input text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedSpecialties.includes(s)}
                      onCheckedChange={() => toggleSpecialty(s)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={caamVerified}
                onCheckedChange={(checked) => setCaamVerified(checked === true)}
              />
              I have a valid CAAM Remote Operator Certificate
            </label>

            <Button type="submit" size="lg" className="w-full">
              Submit & Get Listed
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
