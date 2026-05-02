import type { Destination } from "./types";

export const destinations: Destination[] = [
  {
    id: "shanghai",
    name: "上海",
    nameEn: "Shanghai",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "China's most cosmopolitan city. A dazzling fusion of futuristic skyscrapers in Pudong, colonial-era architecture along the Bund, and hidden lane houses in the French Concession. Shanghai is where East meets West at full speed.",
    descriptionZh:
      "魔都上海，外滩万国建筑群与浦东摩天大楼隔江相望，弄堂里的烟火气和法租界的梧桐树交织出独一无二的城市风情。",
    shortDescription: "The Pearl of the Orient",
    tags: ["Skyline", "Shopping", "Nightlife", "Food", "Architecture"],
    rating: 4.7,
    bestSeason: "Spring (Mar-May) & Autumn (Sep-Nov)",
    avgBudget: 1000,
    highlights: [
      "Stroll the Bund at sunset — Pudong's skyline is unforgettable",
      "Explore Yuyuan Garden, a 400-year-old classical Chinese garden",
      "Walk through the French Concession's tree-lined streets and Art Deco buildings",
      "Ride the Maglev train — world's fastest commercial train at 431 km/h",
      "Taste xiaolongbao (soup dumplings) at their birthplace",
    ],
    quickFacts: {
      population: "24.87 million",
      language: "Mandarin Chinese, Shanghainese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8 (same all year)",
      airport: "Shanghai Pudong (PVG) + Shanghai Hongqiao (SHA)",
      bestFor: "First-time visitors, urban explorers, foodies, shoppers",
    },
  },
  {
    id: "guangzhou",
    name: "广州",
    nameEn: "Guangzhou",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "A 2,200-year-old trading port that has been China's gateway to the world for centuries. Known for its world-class Cantonese cuisine, the iconic Canton Tower, and the massive Canton Fair, Guangzhou is a vibrant blend of business and food culture.",
    descriptionZh:
      "千年商都，食在广州。珠江畔灯火璀璨，早茶文化深入骨髓，既有现代化的天际线，也有充满烟火气的老街小巷。",
    shortDescription: "Canton — trade, food, and culture",
    tags: ["Food", "Shopping", "History", "Business"],
    rating: 4.6,
    bestSeason: "Autumn (Oct-Dec) & Spring (Mar-May)",
    avgBudget: 700,
    highlights: [
      "Experience yum cha (dim sum breakfast) — a UNESCO-recognized food tradition",
      "Visit Canton Tower at night — the tallest TV tower in China",
      "Walk Shamian Island's colonial-era boulevards",
      "Shop at Shangxiajiu Pedestrian Street, a century-old commercial district",
      "Explore Chen Clan Ancestral Hall, a masterpiece of Lingnan architecture",
    ],
    quickFacts: {
      population: "18.68 million",
      language: "Cantonese, Mandarin Chinese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Guangzhou Baiyun (CAN)",
      bestFor: "Food lovers, business travelers, culture explorers",
    },
  },
  {
    id: "beijing",
    name: "北京",
    nameEn: "Beijing",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "A city where 3,000 years of history meets cutting-edge modernity. From the Forbidden City to futuristic skyscrapers, Beijing is China's political, cultural, and historical heart.",
    descriptionZh:
      "三千年古城与现代化大都市的完美融合。故宫、长城、胡同，每一处都诉说着这座城市的传奇。",
    shortDescription: "Ancient capital, modern marvel",
    tags: ["History", "Culture", "Food", "Architecture"],
    rating: 4.8,
    bestSeason: "Spring (Mar-May) & Autumn (Sep-Nov)",
    avgBudget: 800,
    highlights: [
      "Walk the Great Wall — one of the New Seven Wonders of the World",
      "Explore the Forbidden City, the world's largest palace complex",
      "Cycle through ancient Hutongs (traditional alleyways)",
      "Savor authentic Peking Duck, a culinary masterpiece",
      "Visit the Temple of Heaven, where emperors prayed for harvest",
    ],
    quickFacts: {
      population: "21.54 million",
      language: "Mandarin Chinese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8 (same all year)",
      airport: "Beijing Capital (PEK) + Beijing Daxing (PKX)",
      bestFor: "History buffs, culture seekers, first-time visitors",
    },
  },
  {
    id: "shenzhen",
    name: "深圳",
    nameEn: "Shenzhen",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "From a fishing village to a 20-million-person tech metropolis in 40 years. Shenzhen is China's Silicon Valley — a city of innovation, sleek modern architecture, and youthful energy. Gateway to Hong Kong and a window into China's future.",
    descriptionZh:
      "从小渔村到世界级创新之都，深圳用40年书写了城市发展奇迹。科技、设计、创业精神贯穿这座年轻城市的每个角落。",
    shortDescription: "China's Silicon Valley",
    tags: ["Technology", "Innovation", "Modern", "Shopping"],
    rating: 4.5,
    bestSeason: "Autumn (Oct-Dec) & Spring (Mar-Apr)",
    avgBudget: 800,
    highlights: [
      "Visit OCT Loft Creative Park — Shenzhen's artistic soul",
      "See the city from Ping An Finance Centre, one of the world's tallest buildings",
      "Walk along Shenzhen Bay Park for stunning coastal views",
      "Explore the Huaqiangbei electronics markets — a tech shopper's paradise",
      "Take a day trip to nearby Hong Kong (30min by train)",
    ],
    quickFacts: {
      population: "17.56 million",
      language: "Mandarin Chinese, Cantonese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Shenzhen Bao'an (SZX)",
      bestFor: "Tech enthusiasts, entrepreneurs, Hong Kong transit travelers",
    },
  },
  {
    id: "chengdu",
    name: "成都",
    nameEn: "Chengdu",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "The land of pandas, Sichuan peppercorns, and laid-back teahouse culture. Chengdu is a city that knows how to enjoy life — fiery hotpot, ancient temples, and the world's most famous bears all live here.",
    descriptionZh:
      "天府之国，熊猫故乡。成都人把「巴适」过成了生活哲学，火锅、茶馆、麻将，慢节奏里藏着最浓烈的烟火气。",
    shortDescription: "Pandas, hotpot, and the good life",
    tags: ["Pandas", "Food", "Tea Culture", "Nature"],
    rating: 4.9,
    bestSeason: "Spring (Mar-Jun) & Autumn (Sep-Nov)",
    avgBudget: 600,
    highlights: [
      "Meet giant pandas at the Chengdu Research Base — the world's best panda facility",
      "Eat authentic Sichuan hotpot — fiery, numbing, and utterly addictive",
      "Sip tea in a traditional teahouse tucked inside People's Park",
      "Wander Jinli Ancient Street for folk arts and street food",
      "Visit Leshan Giant Buddha — a 71m-tall UNESCO world heritage site (2h drive)",
    ],
    quickFacts: {
      population: "21.4 million",
      language: "Mandarin Chinese, Sichuanese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Chengdu Tianfu (TFU) + Chengdu Shuangliu (CTU)",
      bestFor: "Family travelers, food lovers, panda fans, culture explorers",
    },
  },
  {
    id: "hangzhou",
    name: "杭州",
    nameEn: "Hangzhou",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "The city that inspired Marco Polo and Chinese poets for centuries. West Lake is China's most iconic scenic spot — a perfect composition of pagodas, lotus flowers, weeping willows, and misty mountains. Also home to Alibaba and China's digital economy.",
    descriptionZh:
      "上有天堂，下有苏杭。西湖的烟雨朦胧与钱塘江的壮阔交相辉映，千年诗意与现代科技在杭州完美共存。",
    shortDescription: "Paradise on earth",
    tags: ["Nature", "Tea", "History", "Digital"],
    rating: 4.7,
    bestSeason: "Spring (Mar-May) & Autumn (Sep-Nov)",
    avgBudget: 700,
    highlights: [
      "Cycle or boat around West Lake — China's most famous scenic lake",
      "Visit Longjing (Dragon Well) tea village and taste China's finest green tea",
      "Explore Lingyin Temple, one of China's most important Buddhist temples",
      "Walk Hefang Street for traditional crafts and snacks",
      "See Alibaba's global headquarters — a glimpse into China's tech future",
    ],
    quickFacts: {
      population: "12.37 million",
      language: "Mandarin Chinese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Hangzhou Xiaoshan (HGH)",
      bestFor: "Nature lovers, tea enthusiasts, culture seekers, tech visitors",
    },
  },
  {
    id: "zhangjiajie",
    name: "张家界",
    nameEn: "Zhangjiajie",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "The inspiration for Avatar's floating Hallelujah Mountains. Zhangjiajie's towering quartz-sandstone pillars pierce through clouds in one of Earth's most surreal landscapes. Glass bridges, misty peaks, and deep valleys make this a must-see for nature lovers.",
    descriptionZh:
      "阿凡达悬浮山的灵感来源。三千多根石柱拔地而起，云雾缭绕间宛如仙境。玻璃栈道、天门洞，每一处都让人惊叹大自然的鬼斧神工。",
    shortDescription: "Avatar's floating mountains",
    tags: ["Nature", "Hiking", "Photography", "Adventure"],
    rating: 4.6,
    bestSeason: "Spring (Apr-Jun) & Autumn (Sep-Nov)",
    avgBudget: 500,
    highlights: [
      "Walk through Zhangjiajie National Forest Park — China's first UNESCO World Heritage national park",
      "Stand on the Glass Skywalk on Tianmen Mountain — 1,430m above the valley floor",
      "Ride the world's longest cable car up Tianmen Mountain (7.5km)",
      "Cross the Zhangjiajie Glass Bridge — the world's highest and longest glass bridge",
      "Watch clouds wrap around the iconic Southern Sky Column (inspiration for Avatar)",
    ],
    quickFacts: {
      population: "1.52 million",
      language: "Mandarin Chinese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Zhangjiajie Hehua (DYG)",
      bestFor: "Nature lovers, photographers, adventure travelers, Avatar fans",
    },
  },
  {
    id: "suzhou",
    name: "苏州",
    nameEn: "Suzhou",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "Known as the 'Venice of the East' for its network of canals and classical gardens. Suzhou's UNESCO-listed gardens are masterpieces of Chinese landscape design — every rock, pavilion, and pond is deliberately placed to create harmony.",
    descriptionZh:
      "东方威尼斯，园林甲天下。拙政园的曲径通幽、平江路的小桥流水、评弹的吴侬软语，苏州把中国古典美学做到极致。",
    shortDescription: "Classical gardens and Venice-like canals",
    tags: ["Gardens", "Water Towns", "Silk", "History"],
    rating: 4.5,
    bestSeason: "Spring (Mar-May) & Autumn (Sep-Oct)",
    avgBudget: 600,
    highlights: [
      "Visit the Humble Administrator's Garden — the largest and finest classical garden in Suzhou",
      "Walk Pingjiang Road, a 2,500-year-old street along a willow-lined canal",
      "Take a boat ride through Zhouzhuang or Tongli water towns — 'Venice of the East'",
      "See Suzhou Museum, designed by world-famous architect I.M. Pei",
      "Watch a Kunqu Opera performance — UNESCO Intangible Cultural Heritage",
    ],
    quickFacts: {
      population: "12.74 million",
      language: "Mandarin Chinese, Suzhou dialect",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Sunan Shuofang (WUX, near Suzhou)",
      bestFor: "Culture enthusiasts, art lovers, romantic getaways",
    },
  },
  {
    id: "xiamen",
    name: "厦门",
    nameEn: "Xiamen",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "A coastal gem where colonial architecture meets subtropical beaches. Xiamen's Gulangyu Island is a car-free paradise of winding lanes, piano music drifting from windows, and elegant European villas. Laid-back, artistic, and effortlessly beautiful.",
    descriptionZh:
      "海上花园，鼓浪屿的琴声与海浪声交织。万国建筑群在三角梅的映衬下格外迷人，环岛路骑行是体验这座城市最好的方式。",
    shortDescription: "Island charm and colonial elegance",
    tags: ["Beach", "Architecture", "Art", "Food"],
    rating: 4.6,
    bestSeason: "Oct-Dec & Mar-May",
    avgBudget: 600,
    highlights: [
      "Explore Gulangyu Island — a UNESCO World Heritage car-free island with 1,000+ historic villas",
      "Cycle the island ring road along pristine coastline",
      "Visit Nanputuo Temple, a 1,000-year-old Buddhist complex by the sea",
      "Wander Shapowei — Xiamen's coolest art and cafe district",
      "Try oyster omelet (oh-ah-jian) and other Fujian street foods",
    ],
    quickFacts: {
      population: "5.28 million",
      language: "Mandarin Chinese, Minnan (Hokkien)",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Xiamen Gaoqi (XMN)",
      bestFor: "Leisure travelers, photographers, couples, long-stay visitors",
    },
  },
  {
    id: "nanjing",
    name: "南京",
    nameEn: "Nanjing",
    country: "中国",
    countryEn: "China",
    image: "",
    description:
      "One of China's Four Great Ancient Capitals, Nanjing carries the weight of 2,500 years of history. Ancient city walls, Ming dynasty mausoleums, and vast tree-lined avenues make it one of China's most dignified and beautiful cities.",
    descriptionZh:
      "六朝古都，十朝都会。明孝陵的石象路、梧桐成荫的中山路、秦淮河的桨声灯影，南京的历史厚度和人文气息无可比拟。",
    shortDescription: "Ancient capital under a canopy of trees",
    tags: ["History", "Culture", "Architecture", "Food"],
    rating: 4.5,
    bestSeason: "Spring (Mar-May) & Autumn (Sep-Nov)",
    avgBudget: 600,
    highlights: [
      "Visit Sun Yat-sen Mausoleum — a monumental tribute to modern China's founder",
      "Walk the Ming Dynasty City Wall — the longest city wall ever built (35km)",
      "Explore Confucius Temple (Fuzimiao) and the Qinhuai River night scene",
      "See the Memorial Hall of the Victims in the Nanjing Massacre — a powerful historical site",
      "Eat Nanjing's famous salted duck and duck blood vermicelli soup",
    ],
    quickFacts: {
      population: "9.49 million",
      language: "Mandarin Chinese",
      currency: "Chinese Yuan (CNY / RMB)",
      timezone: "UTC+8",
      airport: "Nanjing Lukou (NKG)",
      bestFor: "History enthusiasts, academic visitors, food explorers",
    },
  },
];

// 排序：按 rating 降序（首页用）
export function getPopularDestinations(count: number = 6): Destination[] {
  return [...destinations].sort((a, b) => b.rating - a.rating).slice(0, count);
}

// 获取单个目的地
export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}

// 获取所有目的地
export function getAllDestinations(): Destination[] {
  return destinations;
}

// 获取所有目的地ID（用于静态生成）
export function getDestinationIds(): string[] {
  return destinations.map((d) => d.id);
}
