import { supabase } from "@/integrations/supabase/client";

export interface Pilot {
  id: string;
  name: string;
  location: string;
  whatsapp: string;
  specialties: string[];
  caam_verified: boolean;
  profile_photo?: string;
  description?: string;
  reviewCount?: number;
  rating?: number;
  available?: boolean;
  equipment?: string[];
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

// Added missing constants required by Pilots.tsx
export const LOCATIONS = [
  "Penang",
  "Kuala Lumpur",
  "Selangor",
  "Johor",
  "Perak",
  "Melaka",
  "Pahang",
  "Terengganu",
  "Kelantan",
  "Kedah",
  "Perlis",
  "Negeri Sembilan",
  "Sabah",
  "Sarawak"
];

export const SPECIALTIES = [
  "Aerial Photography",
  "Videography",
  "Mapping & Surveying",
  "Agricultural Spraying",
  "Infrastructure Inspection",
  "Real Estate",
  "Events",
  "FPV Racing"
];

/**
 * Fetches all pilots from Supabase.
 */
export async function getPilots(): Promise<Pilot[]> {
  try {
    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Pilot[];
  } catch (err) {
    console.error("Error fetching pilots:", err);
    return [];
  }
}

/**
 * Fetches a single pilot by ID.
 */
export async function getPilotById(id: string): Promise<Pilot | null> {
  try {
    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Pilot;
  } catch (err) {
    console.error("Error fetching pilot:", err);
    return null;
  }
}

/**
 * Utility to format WhatsApp numbers into a clickable URL.
 */
export function getWhatsappUrl(input: string): string {
  if (!input) return "#";
  const digits = input.replace(/\D/g, "");
  
  let normalized = digits;
  if (digits.startsWith("0")) {
    normalized = `6${digits}`;
  } else if (!digits.startsWith("60")) {
    normalized = `60${digits}`;
  }
  
  return `https://wa.me/${normalized}`;
}
