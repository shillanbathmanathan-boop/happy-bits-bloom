// src/lib/pilots.ts

// ... (keep imports and interfaces the same)

export const getPilots = async (): Promise<Pilot[]> => {
  try {
    // Safety check: if Supabase isn't initialized, return empty array instead of crashing
    if (!supabase) {
      console.error("Supabase client not initialized");
      return [];
    }

    const { data, error } = await supabase
      .from('pilots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Ensure we always return an array, even if data is null
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching pilots:", err);
    return [];
  }
};
