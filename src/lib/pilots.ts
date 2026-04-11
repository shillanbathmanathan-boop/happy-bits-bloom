import { supabase } from "@/integrations/supabase/client";

// Fetch all verified pilots from the cloud
export const getPilots = async () => {
  const { data, error } = await supabase
    .from('pilots')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching pilots:", error);
    return [];
  }
  return data;
};

// Register a new pilot to the cloud
export const addPilot = async (pilotData: any) => {
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
