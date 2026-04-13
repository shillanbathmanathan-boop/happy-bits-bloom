
import { supabase } from "@/integrations/supabase/client";

export interface Pilot {
  id: string;
  user_id?: string;
  name: string;
  location: string;
  district?: string;
  whatsapp: string;
  specialties: string[];
  caam_verified: boolean;
  caam_cert_number?: string;
  caam_cert_file?: string;
  profile_photo?: string;
  description?: string;
  review_count?: number; 
  rating?: number;
  available?: boolean;
  equipment?: string[];
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  created_at?: string;
}

export const LOCATIONS = [
  "Penang", "Kuala Lumpur", "Selangor", "Johor", "Perak", 
  "Melaka", "Pahang", "Terengganu", "Kelantan", "Kedah", 
  "Perlis", "Negeri Sembilan", "Sabah", "Sarawak"
];

export const DISTRICTS: Record<string, string[]> = {
  "Penang": ["George Town", "Butterworth", "Bayan Lepas", "Nibong Tebal", "Balik Pulau"],
  "Kuala Lumpur": ["Bukit Bintang", "Cheras", "Wangsa Maju", "Kepong", "Bangsar", "Setapak"],
  "Selangor": ["Petaling Jaya", "Shah Alam", "Subang Jaya", "Klang", "Ampang", "Kajang", "Rawang", "Sepang"],
  "Johor": ["Johor Bahru", "Iskandar Puteri", "Batu Pahat", "Muar", "Kluang", "Pontian", "Kota Tinggi"],
  "Perak": ["Ipoh", "Taiping", "Teluk Intan", "Sitiawan", "Kampar", "Batu Gajah"],
  "Melaka": ["Melaka Tengah", "Alor Gajah", "Jasin"],
  "Pahang": ["Kuantan", "Temerloh", "Bentong", "Cameron Highlands", "Raub"],
  "Terengganu": ["Kuala Terengganu", "Kemaman", "Dungun", "Besut"],
  "Kelantan": ["Kota Bharu", "Pasir Mas", "Tumpat", "Tanah Merah"],
  "Kedah": ["Alor Setar", "Sungai Petani", "Kulim", "Langkawi"],
  "Perlis": ["Kangar", "Arau", "Padang Besar"],
  "Negeri Sembilan": ["Seremban", "Port Dickson", "Nilai", "Bahau"],
  "Sabah": ["Kota Kinabalu", "Sandakan", "Tawau", "Lahad Datu", "Keningau"],
  "Sarawak": ["Kuching", "Miri", "Sibu", "Bintulu", "Limbang"],
};

export const SPECIALTIES = [
  "Aerial Photography", "Videography", "Mapping & Surveying", 
  "Agricultural Spraying", "Infrastructure Inspection", 
  "Real Estate", "Events", "FPV Racing", "Drone Rental"
];

export function getFullLocation(pilot: Pilot): string {
  if (pilot.district) return `${pilot.district}, ${pilot.location}`;
  return pilot.location;
}

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

export async function addPilot(pilot: Omit<Pilot, 'id' | 'created_at'>): Promise<{ data: any; error: any }> {
  try {
    const payload: any = {
      name: pilot.name,
      location: pilot.location,
      district: pilot.district || null,
      whatsapp: pilot.whatsapp,
      specialties: pilot.specialties || [],
      caam_verified: pilot.caam_verified ?? false,
      caam_cert_number: pilot.caam_cert_number || null,
      caam_cert_file: pilot.caam_cert_file || null,
      profile_photo: pilot.profile_photo || null,
      description: pilot.description || null,
      equipment: pilot.equipment || [],
      website: pilot.website || null,
      rating: pilot.rating || 0,
      review_count: pilot.review_count || 0,
      available: pilot.available ?? true
    };

    if ((pilot as any).user_id) {
      payload.user_id = (pilot as any).user_id;
    }

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
