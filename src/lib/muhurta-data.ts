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

export const DAY_NIGHT_MUHURTAS: MuhurtaInfo[] = [
  {
    index: 1,
    name: "Rudra",
    devanagari: "रुद्र",
    meaning: "The fierce one",
    quality: "inauspicious",
    notes: "Best avoided for new beginnings; suited for introspection or endings.",
  },
  {
    index: 2,
    name: "Āhi",
    devanagari: "आहि",
    meaning: "Serpent",
    quality: "neutral",
    notes: "A subtle, hidden time; good for research and uncovering secrets.",
  },
  {
    index: 3,
    name: "Mitra",
    devanagari: "मित्र",
    meaning: "Friendship",
    quality: "auspicious",
    notes: "Favorable for agreements, friendships, and harmonious dealings.",
  },
  {
    index: 4,
    name: "Pitṛ",
    devanagari: "पितृ",
    meaning: "Ancestors",
    quality: "auspicious",
    notes: "A time to honor lineage; suitable for remembrance and gratitude.",
  },
  {
    index: 5,
    name: "Vasu",
    devanagari: "वसु",
    meaning: "Shining one / wealth",
    quality: "auspicious",
    notes: "Good for material activities, commerce, and nourishment.",
  },
  {
    index: 6,
    name: "Vāruṇa",
    devanagari: "वारुण",
    meaning: "Lord of waters / order",
    quality: "auspicious",
    notes: "Favorable for discipline, contracts, and maintaining order.",
  },
  {
    index: 7,
    name: "Vāyu",
    devanagari: "वायु",
    meaning: "Wind",
    quality: "auspicious",
    notes: "A mobile, energetic period; good for travel and swift tasks.",
  },
  {
    index: 8,
    name: "Savitṛ",
    devanagari: "सवितृ",
    meaning: "The impeller / sun",
    quality: "auspicious",
    notes: "Midday vitality; excellent for creative and illuminating work.",
  },
  {
    index: 9,
    name: "Viśvedevāḥ",
    devanagari: "विश्वेदेवाः",
    meaning: "All gods",
    quality: "auspicious",
    notes: "A balanced, universal time; suitable for most undertakings.",
  },
  {
    index: 10,
    name: "Indra",
    devanagari: "इन्द्र",
    meaning: "Lord of power",
    quality: "auspicious",
    notes: "Favorable for leadership, decisive action, and protection.",
  },
  {
    index: 11,
    name: "Indrāgni",
    devanagari: "इन्द्राग्नि",
    meaning: "Indra and Agni",
    quality: "auspicious",
    notes: "A fiery, transformative period; good for rituals and purification.",
  },
  {
    index: 12,
    name: "Dhātṛ",
    devanagari: "धातृ",
    meaning: "The establisher",
    quality: "auspicious",
    notes: "Excellent for starting ventures that need stability and growth.",
  },
  {
    index: 13,
    name: "Puṣan",
    devanagari: "पुषन्",
    meaning: "The nourisher",
    quality: "auspicious",
    notes: "Favorable for journeys, finding guidance, and prosperity.",
  },
  {
    index: 14,
    name: "Tvasṭṛ",
    devanagari: "त्वष्टृ",
    meaning: "The craftsman",
    quality: "auspicious",
    notes: "Good for creative work, building, and detailed craftsmanship.",
  },
  {
    index: 15,
    name: "Yama",
    devanagari: "यम",
    meaning: "Restraint / lord of justice",
    quality: "neutral",
    notes: "A period for duty, discipline, and completing obligations.",
  },
  {
    index: 16,
    name: "Gandharva",
    devanagari: "गन्धर्व",
    meaning: "Celestial musician",
    quality: "auspicious",
    notes: "Favorable for arts, music, romance, and beauty.",
  },
  {
    index: 17,
    name: "Kṛttikā",
    devanagari: "कृत्तिका",
    meaning: "The cutters",
    quality: "auspicious",
    notes: "A sharp, clarifying energy; good for decisive cuts and new starts.",
  },
  {
    index: 18,
    name: "Rohiṇī",
    devanagari: "रोहिणी",
    meaning: "The red one / growth",
    quality: "auspicious",
    notes: "Excellent for growth, planting, and nurturing endeavors.",
  },
  {
    index: 19,
    name: "Mṛgaśīrṣa",
    devanagari: "मृगशीर्ष",
    meaning: "Deer's head",
    quality: "auspicious",
    notes: "Gentle, seeking energy; good for exploration and learning.",
  },
  {
    index: 20,
    name: "Ārdrā",
    devanagari: "आर्द्रा",
    meaning: "The moist one",
    quality: "variable",
    notes: "Intense and purifying; can bring breakthroughs or turbulence.",
  },
  {
    index: 21,
    name: "Punarvasu",
    devanagari: "पुनर्वसु",
    meaning: "Return of the light",
    quality: "auspicious",
    notes: "Good for renewal, second chances, and returning home.",
  },
  {
    index: 22,
    name: "Puṣya",
    devanagari: "पुष्य",
    meaning: "The nourisher",
    quality: "auspicious",
    notes: "Highly favorable for teaching, learning, and spiritual growth.",
  },
  {
    index: 23,
    name: "Āśleṣā",
    devanagari: "आश्लेषा",
    meaning: "The entwiner",
    quality: "variable",
    notes: "Deep, hypnotic energy; handle with awareness and clear intent.",
  },
  {
    index: 24,
    name: "Maghā",
    devanagari: "मघा",
    meaning: "The great one",
    quality: "auspicious",
    notes: "Honoring ancestors and tradition; good for legacy work.",
  },
  {
    index: 25,
    name: "Pūrvaphālgunī",
    devanagari: "पूर्वफाल्गुनी",
    meaning: "Former red one",
    quality: "auspicious",
    notes: "Favorable for creativity, celebration, and relationships.",
  },
  {
    index: 26,
    name: "Uttaraphālgunī",
    devanagari: "उत्तरफाल्गुनी",
    meaning: "Latter red one",
    quality: "auspicious",
    notes: "Good for lasting commitments, marriage, and steady progress.",
  },
  {
    index: 27,
    name: "Hasta",
    devanagari: "हस्त",
    meaning: "The hand",
    quality: "auspicious",
    notes: "Skillful, dexterous period; excellent for craft and detailed work.",
  },
  {
    index: 28,
    name: "Citrā",
    devanagari: "चित्रा",
    meaning: "The bright one",
    quality: "auspicious",
    notes: "Favorable for design, architecture, and making things beautiful.",
  },
  {
    index: 29,
    name: "Svātī",
    devanagari: "स्वाती",
    meaning: "The independent one",
    quality: "auspicious",
    notes: "Good for independent action, trade, and self-reliance.",
  },
  {
    index: 30,
    name: "Viśākhā",
    devanagari: "विशाखा",
    meaning: "The forked one",
    quality: "auspicious",
    notes: "A time of purpose and determination; good for focused goals.",
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
      "One complete day-and-night cycle, divided into 30 muhūrtas: 15 from sunrise to sunset, and 15 from sunset to sunrise.",
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
      "Half a muhūrta. Traditional water clocks (ghaṭī) measured this unit by the flow of water.",
  },
  {
    id: "pala",
    name: "Pala",
    devanagari: "पल",
    plural: "Palas",
    modernEquivalent: "24 seconds",
    description:
      "One sixtieth of a ghaṭī. There are 60 palas in one ghaṭī and 120 palas in one muhūrta.",
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
