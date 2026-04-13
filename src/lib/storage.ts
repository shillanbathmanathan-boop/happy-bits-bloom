import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "crypto";

const BUCKET_NAME = "pilot-files";

/**
 * Upload a file to Supabase Storage and return the public URL.
 * Uses a unique filename to avoid collisions.
 */
export async function uploadToStorage(
  file: File,
  folder: "photos" | "certificates"
): Promise<{ url: string | null; error: string | null }> {
  try {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const uniqueName = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError.message);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniqueName);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    console.error("Upload exception:", err);
    return { url: null, error: err.message || "Upload failed" };
  }
}

/**
 * Upload a resized profile photo (from canvas) to storage.
 * Converts canvas dataURL to a Blob first.
 */
export async function uploadProfilePhoto(
  canvas: HTMLCanvasElement
): Promise<{ url: string | null; error: string | null }> {
  return new Promise((resolve) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          resolve({ url: null, error: "Failed to create image blob" });
          return;
        }
        const file = new File([blob], `profile.jpg`, { type: "image/jpeg" });
        const result = await uploadToStorage(file, "photos");
        resolve(result);
      },
      "image/jpeg",
      0.8
    );
  });
}

/**
 * Delete a file from storage by its public URL.
 */
export async function deleteFromStorage(publicUrl: string): Promise<void> {
  try {
    const url = new URL(publicUrl);
    // Extract path after /object/public/pilot-files/
    const match = url.pathname.match(/\/object\/public\/pilot-files\/(.+)/);
    if (match) {
      await supabase.storage.from(BUCKET_NAME).remove([match[1]]);
    }
  } catch {
    // Silently fail - old file cleanup is best-effort
  }
}
