import { supabase } from "@/integrations/supabase/client";

// 1. Data Structure
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

// 2. Filter Constants
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

// 3. Database Functions

export const getPilots = async (): Promise<Pilot[]> => {
  try {
    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // CRITICAL FIX: Ensure we always return an array to prevent .slice errors
    return (data as Pilot[]) || [];
  } catch (err) {
    console.error("Error fetching pilots:", err);
    return [];
  }
};

export const getPilotById = async (id: string): Promise<Pilot | null> => {
  try {
    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Pilot;
  } catch (err) {
    console.error("Error fetching pilot by ID:", err);
    return null;
  }
};

export const addPilot = async (pilotData: Partial<Pilot>) => {
  const { data, error } = await supabase
    .from('pilots')
    .insert([pilotData])
    .select();

  if (error) {
    console.error("Error adding pilot:", error);
    return null;
  }
  return data ? data[0] : null;
};

// 4. Helper Functions
export function normalizeWhatsappNumber(input: string): string {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  // Standard Malaysian format: 601xxxxxxx
  if (digits.startsWith("60")) return digits;
  if (digits.startsWith("0")) return `6${digits}`;
  return `60${digits}`;
}

export function getWhatsappUrl(input: string): string {
  const normalized = normalizeWhatsappNumber(input);
  return normalized ? `https://wa.me/${normalized}` : "#";
}
