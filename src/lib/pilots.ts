import { supabase } from "@/integrations/supabase/client";

export interface Pilot {
  id?: string;
  name: string;
  profile_photo?: string;
  location: string;
  specialties: string[];
  whatsapp: string;
  caam_verified: boolean;
  certification_number?: string;
  equipment?: string[];
  description?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  available?: boolean;
}

export const SPECIALTIES = [
  "Aerial Photography",
  "Videography",
  "Agricultural Spraying",
  "Mapping & Surveying",
  "Infrastructure Inspection",
  "Real Estate",
  "Events",
  "Search & Rescue"
];

export const LOCATIONS = [
  "Kuala Lumpur",
  "Selangor",
  "Penang",
  "Johor",
  "Perak",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Terengganu",
  "Kelantan",
  "Kedah",
  "Perlis",
  "Sabah",
  "Sarawak",
  "Putrajaya",
  "Labuan"
];

export const getPilots = async (): Promise<Pilot[]> => {
  try {
    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Pilot[]) || [];
  } catch (err) {
    console.error("Error fetching pilots:", err);
    return [];
  }
};

export function normalizeWhatsappNumber(input: string): string {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("60")) return digits;
  if (digits.startsWith("0")) return `6${digits}`;
  return `60${digits}`;
}

export function getWhatsappUrl(input: string): string {
  const normalized = normalizeWhatsappNumber(input);
  return normalized ? `https://wa.me/${normalized}` : "#";
}
