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

// Fetch all pilots
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

// NEW: Fetch a single pilot by ID (Fixes PilotProfile.tsx error)
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

// Register a new pilot
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

// 4. Helper Functions
export function getWhatsappUrl(input: string): string {
  const digits = input.replace(/\D/g, "");
  const normalized = digits.startsWith("60") ? digits : `6${digits}`;
  return `https://wa.me/${normalized}`;
}
