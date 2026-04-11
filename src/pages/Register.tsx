import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { addPilot, SPECIALTIES, LOCATIONS } from "@/lib/pilots";
import { toast } from "sonner";
import { Plus, X, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PilotAvatar from "@/components/PilotAvatar";

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [caamVerified, setCaamVerified] = useState(false);
  const [certificationNumber, setCertificationNumber] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [equipmentInput, setEquipmentInput] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 300;
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * maxSize; w = maxSize; }
        else { w = (w / h) * maxSize; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setProfilePhoto(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addEquipment = () => {
    const trimmed = equipmentInput.trim();
    if (trimmed && !equipment.includes(trimmed)) {
      setEquipment((prev) => [...prev, trimmed]);
      setEquipmentInput("");
    }
  };

  const removeEquipment = (item: string) => {
    setEquipment((prev) => prev.filter((e) => e !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location || !whatsapp.trim() || selectedSpecialties.length === 0) {
      toast.error("Please fill in all required fields and select at least one specialty.");
      return;
    }

    if (caamVerified && !certificationNumber.trim()) {
      toast.error("Please enter your CAAM certification number.");
      return;
    }

    const socialMedia: { facebook?: string; instagram?: string; youtube?: string } = {};
    if (facebook.trim()) socialMedia.facebook = facebook.trim();
    if (instagram.trim()) socialMedia.instagram = instagram.trim();
    if (youtube.trim()) socialMedia.youtube = youtube.trim();

    addPilot({
      name: name.trim(),
      location,
      whatsapp: whatsapp.trim().replace(/[^0-9]/g, ""),
      specialties: selectedSpecialties,
      caamVerified,
      certificationNumber: caamVerified ? certificationNumber.trim() : undefined,
      equipment: equipment.length > 0 ? equipment : undefined,
      description: description.trim() || undefined,
      website: website.trim() || undefined,
      socialMedia: Object.keys(socialMedia).length > 0 ? socialMedia : undefined,
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
            {/* Basic Info */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmad Zulkar" maxLength={100} required />
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
              <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="e.g. 60123456789" maxLength={15} required />
              <p className="mt-1 text-xs text-muted-foreground">Include country code (e.g. 60 for Malaysia)</p>
            </div>

            {/* Specialties */}
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
                    <Checkbox checked={selectedSpecialties.includes(s)} onCheckedChange={() => toggleSpecialty(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* CAAM Certification */}
            <div className="space-y-3 rounded-lg border border-input p-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox checked={caamVerified} onCheckedChange={(checked) => setCaamVerified(checked === true)} />
                I have a valid CAAM Remote Operator Certificate
              </label>
              {caamVerified && (
                <div>
                  <Label htmlFor="certNumber">Certification Number *</Label>
                  <Input
                    id="certNumber"
                    value={certificationNumber}
                    onChange={(e) => setCertificationNumber(e.target.value)}
                    placeholder="e.g. CAAM-2024-001"
                    maxLength={50}
                  />
                </div>
              )}
            </div>

            {/* Equipment */}
            <div>
              <Label>Equipment / Drones</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  placeholder="e.g. DJI Mavic 3 Enterprise"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEquipment(); } }}
                />
                <Button type="button" variant="outline" size="icon" onClick={addEquipment}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {equipment.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {equipment.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1 pr-1">
                      {item}
                      <button type="button" onClick={() => removeEquipment(item)} className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">About You</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell clients about your experience, services, and what makes you stand out..."
                maxLength={500}
                rows={4}
              />
              <p className="mt-1 text-xs text-muted-foreground">{description.length}/500 characters</p>
            </div>

            {/* Website & Social Media */}
            <div className="space-y-3">
              <Label className="text-base">Online Presence</Label>
              <div>
                <Label htmlFor="website" className="text-xs text-muted-foreground">Website</Label>
                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" maxLength={200} />
              </div>
              <div>
                <Label htmlFor="facebook" className="text-xs text-muted-foreground">Facebook</Label>
                <Input id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Facebook profile or page URL" maxLength={200} />
              </div>
              <div>
                <Label htmlFor="instagram" className="text-xs text-muted-foreground">Instagram</Label>
                <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram username" maxLength={100} />
              </div>
              <div>
                <Label htmlFor="youtube" className="text-xs text-muted-foreground">YouTube</Label>
                <Input id="youtube" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="YouTube channel name or URL" maxLength={200} />
              </div>
            </div>

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
