import { supabase } from "@/integrations/supabase/client";

// 1. Define the TypeScript interface to keep the data structured
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

// 2. Fetch all pilots from the cloud
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

// 3. Register a new pilot
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

// 4. THE FIX: Add the missing helper function required by PilotCard.tsx
export function getWhatsappUrl(input: string): string {
  // Removes all non-digit characters
  const digits = input.replace(/\D/g, "");
  
  // Ensures it starts with '60' for Malaysia if it doesn't already
  const normalized = digits.startsWith("60") ? digits : `6${digits}`;
  
  return `https://wa.me/${normalized}`;
}
