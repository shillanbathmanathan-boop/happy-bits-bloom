import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { addPilot, SPECIALTIES, LOCATIONS, DISTRICTS, normalizeWhatsappNumber } from "@/lib/pilots";
import { toast } from "sonner";
import { Plus, X, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PilotAvatar from "@/components/PilotAvatar";

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [caamVerified, setCaamVerified] = useState(false);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [equipmentInput, setEquipmentInput] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  const availableDistricts = state ? (DISTRICTS[state] || []) : [];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !state || !whatsapp.trim() || selectedSpecialties.length === 0) {
      toast.error("Please fill in all required fields and select at least one specialty.");
      return;
    }

    const { error } = await addPilot({
      name: name.trim(),
      profile_photo: profilePhoto,
      location: state,
      district: district || undefined,
      whatsapp: normalizeWhatsappNumber(whatsapp.trim()),
      specialties: selectedSpecialties,
      caam_verified: caamVerified,
      equipment: equipment.length > 0 ? equipment : undefined,
      description: description.trim() || undefined,
      website: website.trim() || undefined,
    });

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success("Your profile has been listed!");
    navigate("/pilots");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <motion.div
          className="container max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading text-3xl font-bold text-foreground">List Your Drone Service</h1>
          <p className="mt-2 text-muted-foreground">
            Fill in your details below and your profile will be listed immediately on DroneHire.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Profile Photo */}
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <PilotAvatar name={name || "Your Name"} profilePhoto={profilePhoto} size="lg" />
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              <p className="text-xs text-muted-foreground">Click to upload profile photo (max 2MB)</p>
            </motion.div>

            {/* Basic Info */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmad Zulkar" maxLength={100} required />
            </div>

            {/* State & District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => { setState(e.target.value); setDistrict(""); }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select state</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  disabled={!state}
                >
                  <option value="">Select district</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
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
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-all duration-200 ${
                      selectedSpecialties.includes(s)
                        ? "border-primary bg-primary/5 text-foreground shadow-sm"
                        : "border-input text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
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

            {/* Website */}
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" maxLength={200} />
            </div>

            <Button type="submit" size="lg" className="w-full font-bold">
              Submit & Get Listed
            </Button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
