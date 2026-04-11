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
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching pilots:", error);
    return [];
  }
  return data as Pilot[];
};

export const getPilotById = async (id: string): Promise<Pilot | null> => {
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching pilot by ID:", error);
    return null;
  }
  return data as Pilot;
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
  return data[0];
};

// 4. Helper Functions (Fixes both Register.tsx and PilotCard.tsx)
export function normalizeWhatsappNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  // Ensures it starts with '60' for Malaysia
  return digits.startsWith("60") ? digits : `60${digits.startsWith("0") ? digits.slice(1) : digits}`;
}

export function getWhatsappUrl(input: string): string {
  const normalized = normalizeWhatsappNumber(input);
  return `https://wa.me/${normalized}`;
}
