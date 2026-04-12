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
