export interface Pilot {
  id: string;
  name: string;
  profilePhoto?: string;
  location: string;
  specialties: string[];
  whatsapp: string;
  caamVerified: boolean;
  certificationNumber?: string;
  certificateFile?: string; // base64 data URL of uploaded certificate
  equipment?: string[];
  description?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  available?: boolean;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

const STORAGE_KEY = "dronehire_pilots";

const defaultPilots: Pilot[] = [
  {
    id: "1",
    name: "Ahmad Zulkar",
    profilePhoto: undefined,
    location: "Penang",
    specialties: ["Roof Inspection", "Mapping & Survey", "Construction"],
    whatsapp: "60123456789",
    caamVerified: true,
    certificationNumber: "CAAM-2024-001",
    equipment: ["DJI Mavic 3 Enterprise", "DJI Matrice 300 RTK", "DJI Zenmuse L2"],
    description: "Experienced drone pilot with 5+ years in industrial inspections and mapping. Specializing in high-precision surveys for construction and agriculture across northern Malaysia. Trusted by property developers and government agencies for large-scale site assessments.",
    website: "https://ahmadzulkar.com",
    rating: 4.9,
    reviewCount: 23,
    available: true,
    socialMedia: {
      instagram: "ahmadzulkar_drones",
      facebook: "ahmadzulkardrones",
      youtube: "AhmadZulkarDrones",
    },
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    profilePhoto: undefined,
    location: "Selangor",
    specialties: ["Agriculture", "Mapping & Survey", "Environmental"],
    whatsapp: "60198765432",
    caamVerified: true,
    certificationNumber: "CAAM-2024-015",
    equipment: ["DJI Agras T30", "DJI Phantom 4 RTK", "senseFly eBee X"],
    description: "Precision agriculture specialist helping farmers optimize crop yields through drone-based analysis and spraying services. Covering over 500 hectares monthly across Selangor, Perak, and Kedah with multispectral imaging and variable-rate spraying.",
    website: "https://sitinurhaliza-agri.my",
    rating: 4.8,
    reviewCount: 17,
    available: true,
    socialMedia: {
      instagram: "siti_agridrones",
      tiktok: "sitiagridrones",
      facebook: "SitiNurhalizaAgriDrones",
    },
  },
  {
    id: "3",
    name: "Raj Kumar",
    profilePhoto: undefined,
    location: "Johor",
    specialties: ["Real Estate", "Film & Media", "Infrastructure"],
    whatsapp: "60171234567",
    caamVerified: true,
    certificationNumber: "CAAM-2023-042",
    equipment: ["DJI Inspire 3", "DJI Mini 4 Pro", "DJI Mavic 3 Cine"],
    description: "Cinematic drone videographer creating stunning aerial content for real estate, events, and commercials. Featured in multiple award-winning documentaries and trusted by top property firms in Johor Bahru and Singapore border region.",
    website: "https://rajkumaraerials.com",
    rating: 5.0,
    reviewCount: 31,
    available: false,
    socialMedia: {
      youtube: "RajKumarAerials",
      instagram: "rajkumar.drones",
      tiktok: "rajkumardrones",
      facebook: "RajKumarAerialsMY",
    },
  },
];

export function getPilots(): Pilot[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPilots;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPilots));
  return defaultPilots;
}

export function addPilot(pilot: Omit<Pilot, "id">): Pilot {
  const pilots = getPilots();
  const newPilot: Pilot = { ...pilot, id: crypto.randomUUID() };
  pilots.push(newPilot);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pilots));
  return newPilot;
}

export function normalizeWhatsappNumber(input: string): string {
  const digits = input.replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("60")) return digits;
  if (digits.startsWith("0")) return `6${digits}`;

  return digits;
}

export function getWhatsappUrl(input: string): string {
  const normalized = normalizeWhatsappNumber(input);
  return `https://wa.me/${normalized}`;
}

export function getPilotById(id: string): Pilot | undefined {
  return getPilots().find((p) => p.id === id);
}

export const SPECIALTIES = [
  "Roof Inspection",
  "Mapping & Survey",
  "Agriculture",
  "Real Estate",
  "Film & Media",
  "Construction",
  "Infrastructure",
  "Environmental",
];

export const LOCATIONS = [
  "Kuala Lumpur", "Selangor", "Penang", "Johor", "Perak",
  "Sabah", "Sarawak", "Melaka", "Kedah", "Kelantan",
  "Pahang", "Terengganu", "Negeri Sembilan", "Perlis", "Putrajaya",
];
