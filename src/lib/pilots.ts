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

/**
 * Fetches all pilots from Supabase.
 * Matches the import expected by Index.tsx and Pilots.tsx
 */
export async function getPilots(): Promise<Pilot[]> {
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching pilots:", error);
    return [];
  }

  return data as Pilot[];
}

/**
 * Fetches a single pilot by ID.
 * Matches the import expected by PilotProfile.tsx
 */
export async function getPilotById(id: string): Promise<Pilot | null> {
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching pilot:", error);
    return null;
  }

  return data as Pilot;
}

/**
 * Utility to format WhatsApp numbers into a clickable URL.
 * Matches the import expected by PilotCard.tsx
 */
export function getWhatsappUrl(input: string): string {
  if (!input) return "#";
  const digits = input.replace(/\D/g, "");
  
  // Standard Malaysian format: 601xxxxxxx
  let normalized = digits;
  if (digits.startsWith("0")) {
    normalized = `6${digits}`;
  } else if (!digits.startsWith("60")) {
    normalized = `60${digits}`;
  }
  
  return `https://wa.me/${normalized}`;
}
