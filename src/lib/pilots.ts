import { supabase } from "@/integrations/supabase/client";

export interface Pilot {
  id: string;
  name: string;
  location: string;
  whatsapp: string;
  specialties: string[];
  caam_verified: boolean; // Matches SQL: caam_verified
  profile_photo?: string; // Matches SQL: profile_photo
  description?: string;
  review_count?: number;  // FIXED: Was reviewCount (must match SQL review_count)
  rating?: number;
  available?: boolean;
  equipment?: string[];
  website?: string;
  created_at?: string;
}

export const LOCATIONS = [
  "Penang", "Kuala Lumpur", "Selangor", "Johor", "Perak", 
  "Melaka", "Pahang", "Terengganu", "Kelantan", "Kedah", 
  "Perlis", "Negeri Sembilan", "Sabah", "Sarawak"
];

export const SPECIALTIES = [
  "Aerial Photography", "Videography", "Mapping & Surveying", 
  "Agricultural Spraying", "Infrastructure Inspection", 
  "Real Estate", "Events", "FPV Racing"
];

export async function getPilots(): Promise<Pilot[]> {
  try {
    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
      throw error;
    }
    
    // Explicitly return data or empty array to prevent .slice() errors
    return (data as Pilot[]) || [];
  } catch (err) {
    console.error("Error fetching pilots:", err);
    return [];
  }
}

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

export async function addPilot(pilot: Omit<Pilot, 'id' | 'created_at'>): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pilots')
      .insert([pilot])
      .select();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export function normalizeWhatsappNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  // Standard Malaysian format: 60123456789
  if (digits.startsWith("0")) return `6${digits}`;
  if (digits.length > 0 && !digits.startsWith("60")) return `60${digits}`;
  return digits;
}

export function getWhatsappUrl(input: string): string {
  if (!input) return "#";
  const normalized = normalizeWhatsappNumber(input);
  return `https://wa.me/${normalized}`;
}
