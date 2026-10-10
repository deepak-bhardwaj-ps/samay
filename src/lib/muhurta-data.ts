export interface MuhurtaInfo {
  index: number;
  name: string;
  devanagari?: string;
  meaning: string;
  quality: "auspicious" | "highly-auspicious" | "neutral" | "inauspicious" | "variable";
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

// Named sequence and qualities follow the BooksFact day/night list.
// https://www.booksfact.com/puranas/muhurtas-described-ramayana.html
export const DAY_NIGHT_MUHURTAS: MuhurtaInfo[] = [
  {
    index: 1,
    name: "Rudra",
    devanagari: "रुद्र",
    meaning: "Cryer; howler",
    quality: "inauspicious",
  },
  {
    index: 2,
    name: "Āhi / Sarpa",
    devanagari: "आहि / सर्प",
    meaning: "Serpent",
    quality: "inauspicious",
  },
  { index: 3, name: "Mitra", devanagari: "मित्र", meaning: "Friend", quality: "auspicious" },
  { index: 4, name: "Pitṛ", devanagari: "पितृ", meaning: "Ancestor", quality: "inauspicious" },
  { index: 5, name: "Vasu", devanagari: "वसु", meaning: "Bright", quality: "auspicious" },
  { index: 6, name: "Vārāha", devanagari: "वाराह / वराह", meaning: "Boar", quality: "auspicious" },
  {
    index: 7,
    name: "Viśvedevā",
    devanagari: "विश्वेदेवा",
    meaning: "The universal deities",
    quality: "auspicious",
  },
  {
    index: 8,
    name: "Vidhi / Abhijit",
    devanagari: "विधि / अभिजित",
    meaning: "Insight; midday",
    quality: "highly-auspicious",
  },
  {
    index: 9,
    name: "Sutamukhī",
    devanagari: "सतमुखी",
    meaning: "Goat or charioteer face",
    quality: "auspicious",
  },
  {
    index: 10,
    name: "Puruhūta / Indra",
    devanagari: "पुरुहूत / इन्द्र",
    meaning: "Many offerings",
    quality: "inauspicious",
  },
  {
    index: 11,
    name: "Vāhinī / Vinda",
    devanagari: "वाहिनी / विन्दा",
    meaning: "Possessed of a chariot",
    quality: "inauspicious",
  },
  {
    index: 12,
    name: "Naktanakarā",
    devanagari: "नक्तनकरा",
    meaning: "Night maker",
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
    name: "Aryamā / Aryaman",
    devanagari: "अर्यमा / अर्यमन्",
    meaning: "Nobility",
    quality: "auspicious",
  },
  { index: 15, name: "Bhaga", devanagari: "भग", meaning: "The bestower", quality: "inauspicious" },
  {
    index: 16,
    name: "Girīśa / Īśa",
    devanagari: "गिरीश / ईश",
    meaning: "Lord of the mountain",
    quality: "inauspicious",
  },
  {
    index: 17,
    name: "Ajapāda / Ajaikapāda",
    devanagari: "अजपाद / अजैकपाद",
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
  {
    index: 19,
    name: "Puṣya / Pūṣan",
    devanagari: "पुष्य / पूषा",
    meaning: "The nourisher",
    quality: "auspicious",
  },
  {
    index: 20,
    name: "Aśvinī",
    devanagari: "अश्विनी",
    meaning: "The divine twins",
    quality: "auspicious",
  },
  { index: 21, name: "Yama", devanagari: "यम", meaning: "Restraint", quality: "inauspicious" },
  { index: 22, name: "Agni", devanagari: "अग्नि", meaning: "Fire", quality: "auspicious" },
  {
    index: 23,
    name: "Vidhātṛ",
    devanagari: "विधातृ",
    meaning: "The ordainer",
    quality: "auspicious",
  },
  { index: 24, name: "Kaṇḍa", devanagari: "कण्ड", meaning: "The cluster", quality: "auspicious" },
  {
    index: 25,
    name: "Aditi",
    devanagari: "अदिति",
    meaning: "The boundless",
    quality: "auspicious",
  },
  {
    index: 26,
    name: "Jīva / Amṛta",
    devanagari: "जीव / अमृत",
    meaning: "Life; nectar",
    quality: "highly-auspicious",
    notes: "Atiśubha — especially auspicious.",
  },
  {
    index: 27,
    name: "Viṣṇu",
    devanagari: "विष्णु",
    meaning: "The preserver",
    quality: "auspicious",
  },
  {
    index: 28,
    name: "Dyumadgadyuti / Arka",
    devanagari: "द्युमद्गद्युति / अर्क",
    meaning: "Radiant Sun",
    quality: "auspicious",
  },
  {
    index: 29,
    name: "Brahma",
    devanagari: "ब्रह्म",
    meaning: "The creator",
    quality: "auspicious",
  },
  {
    index: 30,
    name: "Samudram / Vāyu",
    devanagari: "समुद्रम / वायु",
    meaning: "Ocean; wind",
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
    modernEquivalent: "Varies with daylight or night length",
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
    description: "One sixtieth of a ghaṭī. Also called pala; 60 vighaṭīs make one ghaṭī.",
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
    case "highly-auspicious":
      return "Atiśubha — highly auspicious";
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
    case "highly-auspicious":
      return "text-emerald-700 dark:text-emerald-400";
    case "inauspicious":
      return "text-rose-700 dark:text-rose-400";
    case "variable":
      return "text-amber-700 dark:text-amber-400";
    default:
      return "text-muted-foreground";
  }
}
