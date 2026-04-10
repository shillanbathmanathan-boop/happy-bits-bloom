export interface Pilot {
  id: string;
  name: string;
  location: string;
  specialties: string[];
  whatsapp: string;
  caamVerified: boolean;
}

const STORAGE_KEY = "dronehire_pilots";

const defaultPilots: Pilot[] = [
  {
    id: "1",
    name: "Ahmad Zulkar",
    location: "Penang",
    specialties: ["Roof Inspection", "Mapping & Survey"],
    whatsapp: "60123456789",
    caamVerified: true,
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    location: "Selangor",
    specialties: ["Agriculture", "Mapping & Survey"],
    whatsapp: "60198765432",
    caamVerified: true,
  },
  {
    id: "3",
    name: "Raj Kumar",
    location: "Johor",
    specialties: ["Real Estate", "Film & Media"],
    whatsapp: "60171234567",
    caamVerified: true,
  },
];

export function getPilots(): Pilot[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPilots;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPilots));
  return defaultPilots;
}

export function addPilot(pilot: Omit<Pilot, "id">): Pilot {
  const pilots = getPilots();
  const newPilot: Pilot = { ...pilot, id: crypto.randomUUID() };
  pilots.push(newPilot);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pilots));
  return newPilot;
}

export function getPilotById(id: string): Pilot | undefined {
  return getPilots().find((p) => p.id === id);
}
