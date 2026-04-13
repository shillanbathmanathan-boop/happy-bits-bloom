
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
  review_count?: number; 
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
      console.error("Supabase Fetch Error:", error.message);
      throw error;
    }
    
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

/**
 * Adds a new pilot to the database.
 * This version "cleans" the data before sending to prevent 400 errors
 * caused by extra fields from form state.
 */
export async function addPilot(pilot: Omit<Pilot, 'id' | 'created_at'>): Promise<{ data: any; error: any }> {
  try {
    // Only include keys that exist in your SQL 'create table' definition
    const payload = {
      name: pilot.name,
      location: pilot.location,
      whatsapp: pilot.whatsapp,
      specialties: pilot.specialties || [],
      caam_verified: pilot.caam_verified ?? false,
      profile_photo: pilot.profile_photo || null,
      description: pilot.description || null,
      equipment: pilot.equipment || [],
      website: pilot.website || null,
      rating: pilot.rating || 0,
      review_count: pilot.review_count || 0,
      available: pilot.available ?? true
    };

    const { data, error } = await supabase
      .from('pilots')
      .insert([payload])
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error.message);
    }

    return { data, error };
  } catch (err) {
    console.error("Add pilot exception:", err);
    return { data: null, error: err };
  }
}

export function normalizeWhatsappNumber(input: string): string {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) return `6${digits}`;
  if (digits.length > 0 && !digits.startsWith("60")) return `60${digits}`;
  return digits;
}

export function getWhatsappUrl(input: string): string {
  if (!input) return "#";
  const normalized = normalizeWhatsappNumber(input);
  return `https://wa.me/${normalized}`;
}
