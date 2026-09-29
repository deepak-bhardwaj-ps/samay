export interface MuhurtaInfo {
  index: number;
  name: string;
  devanagari?: string;
  meaning: string;
  quality: "auspicious" | "neutral" | "inauspicious" | "variable";
  notes?: string;
}

export interface VedicUnit {
  id: string;
  name: string;
  devanagari?: string;
  plural?: string;
  modernEquivalent: string;
  description: string;
}

// Named sequence and qualities: Drik Panchang Do Ghati Muhurat reference.
// https://www.drikpanchang.com/muhurat/daily/do-ghati-muhurat.html
export const DAY_NIGHT_MUHURTAS: MuhurtaInfo[] = [
  {
    index: 1,
    name: "Rudra",
    devanagari: "रुद्र",
    meaning: "The fierce one",
    quality: "inauspicious",
  },
  { index: 2, name: "Uraga", devanagari: "उरग", meaning: "Serpent", quality: "inauspicious" },
  { index: 3, name: "Mitra", devanagari: "मित्र", meaning: "Friendship", quality: "auspicious" },
  { index: 4, name: "Pitara", devanagari: "पितर", meaning: "Ancestors", quality: "inauspicious" },
  { index: 5, name: "Vasu", devanagari: "वसु", meaning: "Radiance", quality: "auspicious" },
  { index: 6, name: "Ambu", devanagari: "अम्बु", meaning: "Water", quality: "auspicious" },
  {
    index: 7,
    name: "Viśvedeva",
    devanagari: "विश्वेदेव",
    meaning: "The universal deities",
    quality: "auspicious",
  },
  { index: 8, name: "Vidhi", devanagari: "विधि", meaning: "Order", quality: "auspicious" },
  {
    index: 9,
    name: "Brahmā",
    devanagari: "ब्रह्मा",
    meaning: "The creator",
    quality: "auspicious",
  },
  {
    index: 10,
    name: "Indra",
    devanagari: "इन्द्र",
    meaning: "Lord of the heavens",
    quality: "auspicious",
  },
  {
    index: 11,
    name: "Indrāgni",
    devanagari: "इन्द्राग्नी",
    meaning: "Indra and Agni",
    quality: "inauspicious",
  },
  {
    index: 12,
    name: "Daitya",
    devanagari: "दैत्य",
    meaning: "Descendant of Diti",
    quality: "inauspicious",
  },
  {
    index: 13,
    name: "Varuṇa",
    devanagari: "वरुण",
    meaning: "Lord of waters",
    quality: "auspicious",
  },
  {
    index: 14,
    name: "Aryamā",
    devanagari: "अर्यमा",
    meaning: "Companionship",
    quality: "auspicious",
  },
  { index: 15, name: "Bhaga", devanagari: "भग", meaning: "The bestower", quality: "inauspicious" },
  {
    index: 16,
    name: "Īśvara",
    devanagari: "ईश्वर",
    meaning: "The sovereign",
    quality: "inauspicious",
  },
  {
    index: 17,
    name: "Ajaikapāda",
    devanagari: "अजैकपाद",
    meaning: "The one-footed one",
    quality: "inauspicious",
  },
  {
    index: 18,
    name: "Ahirbudhnya",
    devanagari: "अहिर्बुध्न्य",
    meaning: "Serpent of the deep",
    quality: "auspicious",
  },
  { index: 19, name: "Pūṣā", devanagari: "पूषा", meaning: "The nourisher", quality: "auspicious" },
  {
    index: 20,
    name: "Aśvinī",
    devanagari: "अश्विनी",
    meaning: "The divine twins",
    quality: "auspicious",
  },
  { index: 21, name: "Yama", devanagari: "यम", meaning: "Restraint", quality: "inauspicious" },
  { index: 22, name: "Agni", devanagari: "अग्नि", meaning: "Fire", quality: "inauspicious" },
  {
    index: 23,
    name: "Brahmā",
    devanagari: "ब्रह्मा",
    meaning: "The creator",
    quality: "auspicious",
  },
  { index: 24, name: "Candra", devanagari: "चन्द्र", meaning: "The Moon", quality: "auspicious" },
  {
    index: 25,
    name: "Aditi",
    devanagari: "अदिति",
    meaning: "The boundless",
    quality: "auspicious",
  },
  {
    index: 26,
    name: "Bṛhaspati",
    devanagari: "बृहस्पति",
    meaning: "The teacher",
    quality: "auspicious",
  },
  {
    index: 27,
    name: "Viṣṇu",
    devanagari: "विष्णु",
    meaning: "The preserver",
    quality: "auspicious",
  },
  { index: 28, name: "Sūrya", devanagari: "सूर्य", meaning: "The Sun", quality: "auspicious" },
  {
    index: 29,
    name: "Tvaṣṭā",
    devanagari: "त्वष्टा",
    meaning: "The craftsman",
    quality: "auspicious",
  },
  {
    index: 30,
    name: "Samīraṇa",
    devanagari: "समीरण",
    meaning: "The breeze",
    quality: "auspicious",
  },
];

export const VEDIC_UNITS: VedicUnit[] = [
  {
    id: "ahoratra",
    name: "Ahorātra",
    devanagari: "अहोरात्र",
    plural: "Ahorātras",
    modernEquivalent: "24 hours",
    description:
      "One sunrise-to-sunrise cycle, divided into 30 seasonal muhūrtas: 15 from sunrise to sunset and 15 from sunset to sunrise.",
  },
  {
    id: "muhurta",
    name: "Muhūrta",
    devanagari: "मुहूर्त",
    plural: "Muhūrtas",
    modernEquivalent: "~48 minutes (varies with sunrise/sunset)",
    description:
      "The fundamental Vedic hour. Daylight is divided into 15 muhūrtas and the night into 15 more, measured separately, so a day muhūrta and a night muhūrta are rarely the same length.",
  },
  {
    id: "ghati",
    name: "Ghaṭī / Ghaṭikā",
    devanagari: "घटी",
    plural: "Ghaṭīs",
    modernEquivalent: "24 minutes",
    description:
      "A fixed 24-minute unit associated with traditional water clocks. A conventional 24-hour day holds 60 ghaṭīs; the interval from one local sunrise to the next may differ slightly.",
  },
  {
    id: "pala",
    name: "Vighaṭī / Pala",
    devanagari: "विघटी / पल",
    plural: "Vighaṭīs",
    modernEquivalent: "24 seconds",
    description:
      "One sixtieth of a ghaṭī. Also called pala; 60 vighaṭīs make a ghaṭī and 120 make a fixed 48-minute muhūrta.",
  },
  {
    id: "vipala",
    name: "Vipala",
    devanagari: "विपल",
    plural: "Vipalas",
    modernEquivalent: "0.4 seconds",
    description: "One sixtieth of a pala. The smallest practical unit in this system.",
  },
];

export function getMuhurtaByIndex(index: number): MuhurtaInfo {
  const normalized = (((index - 1) % 30) + 30) % 30;
  return DAY_NIGHT_MUHURTAS[normalized]!;
}

export function qualityLabel(quality: MuhurtaInfo["quality"]): string {
  switch (quality) {
    case "auspicious":
      return "Śubha — auspicious";
    case "inauspicious":
      return "Aśubha — avoid beginnings";
    case "variable":
      return "Anitya — use with awareness";
    default:
      return "Samāna — neutral";
  }
}

export function qualityColorClass(quality: MuhurtaInfo["quality"]): string {
  switch (quality) {
    case "auspicious":
      return "text-emerald-700 dark:text-emerald-400";
    case "inauspicious":
      return "text-rose-700 dark:text-rose-400";
    case "variable":
      return "text-amber-700 dark:text-amber-400";
    default:
      return "text-muted-foreground";
  }
}
