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
    if (error) throw error;
    return data as Pilot[];
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
 * Required by Register.tsx
 */
export async function addPilot(pilot: Omit<Pilot, 'id'>): Promise<{ data: any; error: any }> {
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

/**
 * Normalizes WhatsApp numbers for the database.
 * Required by Register.tsx
 */
export function normalizeWhatsappNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("0")) return `6${digits}`;
  if (!digits.startsWith("60")) return `60${digits}`;
  return digits;
}

/**
 * Utility to format WhatsApp numbers into a clickable URL.
 */
export function getWhatsappUrl(input: string): string {
  if (!input) return "#";
  const normalized = normalizeWhatsappNumber(input);
  return `https://wa.me/${normalized}`;
}
