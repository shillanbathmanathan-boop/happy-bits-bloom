import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SPECIALTIES, LOCATIONS, DISTRICTS, normalizeWhatsappNumber } from "@/lib/pilots";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, X, Camera, Upload, FileCheck, Loader2, Trash2 } from "lucide-react";
import PilotAvatar from "@/components/PilotAvatar";
import { uploadProfilePhoto, uploadToStorage, deleteFromStorage } from "@/lib/storage";
import SEO from "@/components/SEO";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certFileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pilotId, setPilotId] = useState<string | null>(null);

  const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
  const [profilePhotoCanvas, setProfilePhotoCanvas] = useState<HTMLCanvasElement | null>(null);
  const [originalProfilePhotoUrl, setOriginalProfilePhotoUrl] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [caamVerified, setCaamVerified] = useState(false);
  const [caamCertNumber, setCaamCertNumber] = useState("");
  const [certFile, setCertFile] = useState<File | null>(null);
  const [originalCertUrl, setOriginalCertUrl] = useState<string | undefined>();
  const [caamCertFileName, setCaamCertFileName] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [equipmentInput, setEquipmentInput] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    if (user) loadPilotData();
  }, [user, authLoading]);

  const loadPilotData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pilots")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load profile.");
      setLoading(false);
      return;
    }

    if (!data) {
      toast.info("You don't have a listing yet. Create one first!");
      navigate("/register");
      return;
    }

    setPilotId(data.id);
    setName(data.name || "");
    setProfilePhoto(data.profile_photo || undefined);
    setOriginalProfilePhotoUrl(data.profile_photo || undefined);
    setState(data.location || "");
    setDistrict(data.district || "");
    setWhatsapp(data.whatsapp || "");
    setSelectedSpecialties(data.specialties || []);
    setCaamVerified(data.caam_verified || false);
    setCaamCertNumber(data.caam_cert_number || "");
    setOriginalCertUrl(data.caam_cert_file || undefined);
    setCaamCertFileName(data.caam_cert_file ? "Certificate uploaded" : "");
    setEquipment(data.equipment || []);
    setDescription(data.description || "");
    setWebsite(data.website || "");
    setFacebook(data.facebook || "");
    setInstagram(data.instagram || "");
    setYoutube(data.youtube || "");
    setTiktok(data.tiktok || "");
    setAvailable(data.available ?? true);
    setLoading(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Photo must be under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 300;
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * maxSize; w = maxSize; } else { w = (w / h) * maxSize; h = maxSize; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        setProfilePhoto(canvas.toDataURL("image/jpeg", 0.8));
        setProfilePhotoCanvas(canvas);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const addEquipment = () => {
    const trimmed = equipmentInput.trim();
    if (trimmed && !equipment.includes(trimmed)) { setEquipment((prev) => [...prev, trimmed]); setEquipmentInput(""); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !state || !whatsapp.trim() || selectedSpecialties.length === 0) {
      toast.error("Please fill in all required fields."); return;
    }
    if (caamVerified && !caamCertNumber.trim()) { toast.error("Enter your CAAM certification number."); return; }

    setSaving(true);

    // Upload new profile photo if changed
    let profilePhotoUrl = profilePhoto;
    if (profilePhotoCanvas) {
      const { url, error: photoErr } = await uploadProfilePhoto(profilePhotoCanvas);
      if (photoErr || !url) { toast.error("Failed to upload photo."); setSaving(false); return; }
      profilePhotoUrl = url;
      // Clean up old photo
      if (originalProfilePhotoUrl) deleteFromStorage(originalProfilePhotoUrl);
    }

    // Upload new cert if changed
    let certFileUrl = originalCertUrl;
    if (certFile) {
      const { url, error: certErr } = await uploadToStorage(certFile, "certificates");
      if (certErr || !url) { toast.error("Failed to upload certificate."); setSaving(false); return; }
      certFileUrl = url;
      if (originalCertUrl) deleteFromStorage(originalCertUrl);
    }

    const { error } = await supabase
      .from("pilots")
      .update({
        name: name.trim(),
        profile_photo: profilePhotoUrl || null,
        location: state,
        district: district || null,
        whatsapp: normalizeWhatsappNumber(whatsapp.trim()),
        specialties: selectedSpecialties,
        caam_verified: caamVerified,
        caam_cert_number: caamVerified ? caamCertNumber.trim() : null,
        caam_cert_file: caamVerified ? certFileUrl || null : null,
        equipment: equipment.length > 0 ? equipment : [],
        description: description.trim() || null,
        website: website.trim() || null,
        facebook: facebook.trim() || null,
        instagram: instagram.trim() || null,
        youtube: youtube.trim() || null,
        tiktok: tiktok.trim() || null,
        available,
      })
      .eq("id", pilotId!);

    setSaving(false);
    if (error) { toast.error("Failed to save changes."); return; }
    toast.success("Profile updated!");
    navigate(`/pilot/${pilotId}`);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("pilots").delete().eq("id", pilotId!);
    if (error) { toast.error("Failed to delete listing."); return; }
    toast.success("Your listing has been removed.");
    navigate("/pilots");
  };

  const availableDistricts = state ? (DISTRICTS[state] || []) : [];

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <motion.div className="container max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl font-bold text-foreground">Edit Your Profile</h1>
          <p className="mt-2 text-muted-foreground">Update your listing details below.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Photo */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                <PilotAvatar name={name || "Your Name"} profilePhoto={profilePhoto} size="lg" />
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>

            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>State *</Label>
                <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                  <option value="">Select state</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <Label>District</Label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!state}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50">
                  <option value="">Select district</option>
                  {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <Label>WhatsApp Number *</Label>
              <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={15} required />
            </div>

            <div>
              <Label>Specialties *</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {SPECIALTIES.map((s) => (
                  <label key={s} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-all ${
                    selectedSpecialties.includes(s) ? "border-primary bg-primary/5 text-foreground shadow-sm" : "border-input text-muted-foreground hover:border-primary/50"
                  }`}>
                    <Checkbox checked={selectedSpecialties.includes(s)} onCheckedChange={() => toggleSpecialty(s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* CAAM */}
            <div className="space-y-3 rounded-lg border border-input p-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox checked={caamVerified} onCheckedChange={(c) => setCaamVerified(c === true)} />
                CAAM Remote Operator Certificate
              </label>
              {caamVerified && (
                <div className="space-y-3 pt-2 border-t">
                  <div>
                    <Label>Certification Number *</Label>
                    <Input value={caamCertNumber} onChange={(e) => setCaamCertNumber(e.target.value)} maxLength={50} />
                  </div>
                  <div>
                    <Label>Upload Certificate *</Label>
                    <p className="mb-2 text-xs text-muted-foreground">PDF, JPG, or PNG — max 1MB</p>
                    <input ref={certFileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 1024 * 1024) { toast.error("Certificate must be under 1MB."); return; }
                        setCertFile(file);
                        setCaamCertFileName(file.name);
                      }}
                    />
                    {(certFile || originalCertUrl) ? (
                      <div className="flex items-center gap-2 rounded-md border border-accent/30 bg-accent/5 px-3 py-2">
                        <FileCheck className="h-4 w-4 text-accent" />
                        <span className="flex-1 truncate text-sm">{caamCertFileName}</span>
                        <button type="button" onClick={() => { setCertFile(null); setOriginalCertUrl(undefined); setCaamCertFileName(""); }} className="rounded-full p-0.5 hover:bg-muted-foreground/20">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" className="w-full" onClick={() => certFileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Choose File
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Availability */}
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={available} onCheckedChange={(c) => setAvailable(c === true)} />
              I'm currently available for hire
            </label>

            {/* Equipment */}
            <div>
              <Label>Equipment / Drones</Label>
              <div className="mt-2 flex gap-2">
                <Input value={equipmentInput} onChange={(e) => setEquipmentInput(e.target.value)} placeholder="e.g. DJI Mavic 3"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEquipment(); } }} />
                <Button type="button" variant="outline" size="icon" onClick={addEquipment}><Plus className="h-4 w-4" /></Button>
              </div>
              {equipment.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {equipment.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1 pr-1">
                      {item}
                      <button type="button" onClick={() => setEquipment((p) => p.filter((e) => e !== item))} className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>About You</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} rows={4} />
              <p className="mt-1 text-xs text-muted-foreground">{description.length}/500</p>
            </div>

            <div>
              <Label>Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={200} />
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <Label>Social Media Links</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Facebook</Label>
                  <Input value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/yourpage" maxLength={200} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Instagram</Label>
                  <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/yourhandle" maxLength={200} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">YouTube</Label>
                  <Input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/@yourchannel" maxLength={200} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">TikTok</Label>
                  <Input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/@yourhandle" maxLength={200} />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full font-bold" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>

          <div className="mt-10 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
            <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
            <p className="mt-1 text-xs text-muted-foreground">Once deleted, your listing cannot be recovered.</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="mt-3 gap-1.5">
                  <Trash2 className="h-4 w-4" /> Delete My Listing
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your listing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove your pilot profile from DroneHire. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;
