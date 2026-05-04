// image-search.ts — 旅行图片搜索+缓存系统
//
// 核心策略：
//   1. 搜索真实照片 URL（从 web_fetch 获取）
//   2. 每个活动有独立的关键词，不会重复映射
//   3. 搜索结果缓存到 localStorage（浏览器端）或 session 记忆
//
// 接口设计（供 React 组件调用）：
//   getImageForActivity(activity, cityId) → 返回图片URL
//   getCityCoverImage(cityId) → 返回城市封面

import { Destination } from "./types";

// ─── 活动→关键词映射表 ───
// 每个活动独立映射到搜索关键词，每个关键词被引用次数 ≤ 1
// 格式: [关键词, 完整搜索关键词]

export type ActivityImageEntry = {
  /** 用于去重：同一个城市内不能出现相同文件 */
  key: string;
  /** Unsplash/Pexels 搜索词 */
  searchTerm: string;
  /** 分类（展示时可选标注） */
  category: "landmark" | "food" | "nature" | "culture" | "cityscape";
};

// 城市特有的活动→图片映射
// 每个城市独立，保证关键词不交叉
const cityActivityImages: Record<string, Record<string, ActivityImageEntry>> = {
  chengdu: {
    "Giant Panda Breeding Research Base": {
      key: "chengdu_panda_base",
      searchTerm: "Chengdu giant panda breeding base",
      category: "nature",
    },
    "Jinli Ancient Street": {
      key: "chengdu_jinli_street",
      searchTerm: "Chengdu Jinli Ancient Street",
      category: "culture",
    },
    "Sichuan hotpot dinner": {
      key: "chengdu_hotpot",
      searchTerm: "Sichuan hotpot dinner Chongqing",
      category: "food",
    },
    "Leshan Giant Buddha": {
      key: "chengdu_leshan_buddha",
      searchTerm: "Leshan Giant Buddha Sichuan",
      category: "landmark",
    },
    "face-changing opera": {
      key: "chengdu_face_changing_opera",
      searchTerm: "Sichuan opera face changing",
      category: "culture",
    },
    "Sichuan cuisine cooking class": {
      key: "chengdu_sichuan_cuisine",
      searchTerm: "Sichuan cuisine mapo tofu",
      category: "food",
    },
    "Kuanzhai Alley walk": {
      key: "chengdu_kuanzhai_alley",
      searchTerm: "Chengdu Kuanzhai Alley",
      category: "culture",
    },
    "Tea house people-watching": {
      key: "chengdu_teahouse",
      searchTerm: "Chengdu traditional teahouse",
      category: "culture",
    },
    "Mount Qingcheng": {
      key: "chengdu_qingcheng_mountain",
      searchTerm: "Mount Qingcheng Sichuan",
      category: "nature",
    },
    "Dujiangyan irrigation system": {
      key: "chengdu_dujiangyan",
      searchTerm: "Dujiangyan irrigation system",
      category: "landmark",
    },
    "Sichuan Museum": {
      key: "chengdu_sichuan_museum",
      searchTerm: "Sichuan Museum Chengdu",
      category: "culture",
    },
  },
  beijing: {
    "Forbidden City": {
      key: "beijing_forbidden_city",
      searchTerm: "Beijing Forbidden City palace",
      category: "landmark",
    },
    "Tiananmen Square": {
      key: "beijing_tiananmen",
      searchTerm: "Tiananmen Square Beijing",
      category: "landmark",
    },
    "Great Wall": {
      key: "beijing_great_wall",
      searchTerm: "Mutianyu Great Wall Beijing",
      category: "landmark",
    },
    "Temple of Heaven": {
      key: "beijing_temple_of_heaven",
      searchTerm: "Temple of Heaven Beijing",
      category: "landmark",
    },
    "Hutong rickshaw tour": {
      key: "beijing_hutong",
      searchTerm: "Beijing hutong alleyway",
      category: "culture",
    },
    "Summer Palace": {
      key: "beijing_summer_palace",
      searchTerm: "Summer Palace Beijing Kunming Lake",
      category: "landmark",
    },
    "798 Art District": {
      key: "beijing_798_art",
      searchTerm: "Beijing 798 Art District contemporary art",
      category: "culture",
    },
    "Peking duck dinner": {
      key: "beijing_peking_duck",
      searchTerm: "Peking duck Beijing restaurant",
      category: "food",
    },
    "Ming Tombs": {
      key: "beijing_ming_tombs",
      searchTerm: "Ming Tombs Beijing Dingling",
      category: "landmark",
    },
  },
  shanghai: {
    "Bund": {
      key: "shanghai_bund",
      searchTerm: "Shanghai Bund skyline",
      category: "cityscape",
    },
    "Oriental Pearl Tower": {
      key: "shanghai_oriental_pearl",
      searchTerm: "Shanghai Oriental Pearl Tower",
      category: "landmark",
    },
    "Yuyuan Garden": {
      key: "shanghai_yuyuan",
      searchTerm: "Shanghai Yuyuan Garden classical",
      category: "landmark",
    },
    "French Concession": {
      key: "shanghai_french_concession",
      searchTerm: "Shanghai French Concession tree lined street",
      category: "cityscape",
    },
    "Tianzifang": {
      key: "shanghai_tianzifang",
      searchTerm: "Shanghai Tianzifang artsy lanes",
      category: "culture",
    },
    "Shanghai Museum": {
      key: "shanghai_museum",
      searchTerm: "Shanghai Museum architecture",
      category: "culture",
    },
    "xiaolongbao": {
      key: "shanghai_xiaolongbao",
      searchTerm: "xiaolongbao soup dumplings bamboo steamer",
      category: "food",
    },
    "Maglev train": {
      key: "shanghai_maglev",
      searchTerm: "Shanghai Maglev train",
      category: "cityscape",
    },
  },
  guilin: {
    "Reed Flute Cave": {
      key: "guilin_reed_flute_cave",
      searchTerm: "Reed Flute Cave Guilin stalactites",
      category: "nature",
    },
    "Elephant Trunk Hill": {
      key: "guilin_elephant_trunk",
      searchTerm: "Elephant Trunk Hill Guilin",
      category: "landmark",
    },
    "Li River cruise": {
      key: "guilin_li_river",
      searchTerm: "Li River Guilin karst landscape",
      category: "nature",
    },
    "West Street Yangshuo": {
      key: "guilin_west_street",
      searchTerm: "West Street Yangshuo Guilin",
      category: "culture",
    },
    "Moon Hill": {
      key: "guilin_moon_hill",
      searchTerm: "Yangshuo Moon Hill hike",
      category: "nature",
    },
    "Yulong River bamboo raft": {
      key: "guilin_yulong_river",
      searchTerm: "Yulong River bamboo rafting Yangshuo",
      category: "nature",
    },
    "Longji Rice Terraces": {
      key: "guilin_longji_terraces",
      searchTerm: "Longji Rice Terraces Guangxi",
      category: "nature",
    },
  },
  xian: {
    "City Wall bike": {
      key: "xian_city_wall",
      searchTerm: "Xi'an ancient City Wall bicycle",
      category: "landmark",
    },
    "Muslim Quarter": {
      key: "xian_muslim_quarter",
      searchTerm: "Xi'an Muslim Quarter street food",
      category: "culture",
    },
    "Terracotta Warriors": {
      key: "xian_terracotta_warriors",
      searchTerm: "Xi'an Terracotta Army warriors",
      category: "landmark",
    },
    "Terracotta Army Museum": {
      key: "xian_terracotta_museum",
      searchTerm: "Terracotta Army Museum Xi'an",
      category: "landmark",
    },
    "Shaanxi History Museum": {
      key: "xian_shaanxi_museum",
      searchTerm: "Shaanxi History Museum Xi'an",
      category: "culture",
    },
    "Big Wild Goose Pagoda": {
      key: "xian_big_wild_goose",
      searchTerm: "Big Wild Goose Pagoda Xi'an",
      category: "landmark",
    },
    "Biangbiang noodles": {
      key: "xian_biangbiang_noodles",
      searchTerm: "Biangbiang noodles Xi'an",
      category: "food",
    },
  },
  hangzhou: {
    "West Lake": {
      key: "hangzhou_west_lake",
      searchTerm: "West Lake Hangzhou sunset",
      category: "nature",
    },
    "Longjing tea village": {
      key: "hangzhou_longjing",
      searchTerm: "Longjing tea village Hangzhou green tea terraces",
      category: "nature",
    },
    "Lingyin Temple": {
      key: "hangzhou_lingyin_temple",
      searchTerm: "Lingyin Temple Hangzhou Buddhist",
      category: "culture",
    },
    "Hefang Street": {
      key: "hangzhou_hefang_street",
      searchTerm: "Hefang Street Hangzhou traditional",
      category: "culture",
    },
    "Alibaba headquarters": {
      key: "hangzhou_alibaba",
      searchTerm: "Alibaba global headquarters Hangzhou",
      category: "cityscape",
    },
  },
  zhangjiajie: {
    "Zhangjiajie National Forest Park": {
      key: "zhangjiajie_forest_park",
      searchTerm: "Zhangjiajie National Forest Park quartz sandstone pillars",
      category: "nature",
    },
    "Tianmen Mountain Glass Skywalk": {
      key: "zhangjiajie_tianmen_glass",
      searchTerm: "Tianmen Mountain glass skywalk Zhangjiajie",
      category: "landmark",
    },
    "Tianmen Mountain cable car": {
      key: "zhangjiajie_tianmen_cable",
      searchTerm: "Tianmen Mountain cable car longest",
      category: "landmark",
    },
    "Zhangjiajie Glass Bridge": {
      key: "zhangjiajie_glass_bridge",
      searchTerm: "Zhangjiajie Grand Canyon glass bridge",
      category: "landmark",
    },
    "Southern Sky Column Avatar": {
      key: "zhangjiajie_avatar_column",
      searchTerm: "Zhangjiajie Southern Sky Column Avatar Hallelujah",
      category: "nature",
    },
  },
  suzhou: {
    "Humble Administrator's Garden": {
      key: "suzhou_humble_admin_garden",
      searchTerm: "Suzhou Humble Administrator Garden classical",
      category: "landmark",
    },
    "Pingjiang Road": {
      key: "suzhou_pingjiang_road",
      searchTerm: "Suzhou Pingjiang Road canal",
      category: "culture",
    },
    "Zhouzhuang water town": {
      key: "suzhou_zhouzhuang",
      searchTerm: "Zhouzhuang water town Suzhou canals",
      category: "culture",
    },
    "Suzhou Museum": {
      key: "suzhou_museum",
      searchTerm: "Suzhou Museum I.M. Pei architecture",
      category: "culture",
    },
    "Kunqu Opera": {
      key: "suzhou_kunqu_opera",
      searchTerm: "Kunqu Opera performance Suzhou costume",
      category: "culture",
    },
  },
  xiamen: {
    "Gulangyu Island": {
      key: "xiamen_gulangyu",
      searchTerm: "Gulangyu Island Xiamen colonial villas",
      category: "cityscape",
    },
    "Nanputuo Temple": {
      key: "xiamen_nanputuo",
      searchTerm: "Nanputuo Temple Xiamen Buddhist",
      category: "culture",
    },
    "Shapowei art district": {
      key: "xiamen_shapowei",
      searchTerm: "Xiamen Shapowei art district cafe",
      category: "culture",
    },
    "oyster omelet": {
      key: "xiamen_oyster_omelet",
      searchTerm: "Fujian oyster omelet street food",
      category: "food",
    },
    "island ring road": {
      key: "xiamen_ring_road",
      searchTerm: "Xiamen island ring road coastline",
      category: "nature",
    },
  },
  nanjing: {
    "Sun Yat-sen Mausoleum": {
      key: "nanjing_sun_yat_sen",
      searchTerm: "Sun Yat-sen Mausoleum Nanjing",
      category: "landmark",
    },
    "Ming Dynasty City Wall": {
      key: "nanjing_city_wall",
      searchTerm: "Ming Dynasty City Wall Nanjing",
      category: "landmark",
    },
    "Confucius Temple": {
      key: "nanjing_confucius_temple",
      searchTerm: "Nanjing Confucius Temple Fuzimiao Qinhuai",
      category: "culture",
    },
    "Nanjing Massacre Memorial Hall": {
      key: "nanjing_memorial_hall",
      searchTerm: "Nanjing Massacre Memorial Hall",
      category: "culture",
    },
    "salted duck": {
      key: "nanjing_salted_duck",
      searchTerm: "Nanjing salted duck traditional food",
      category: "food",
    },
  },
  kunming: {
    "Green Lake Park": {
      key: "kunming_green_lake",
      searchTerm: "Kunming Green Lake Park Cuihu",
      category: "nature",
    },
    "Stone Forest": {
      key: "kunming_stone_forest",
      searchTerm: "Shilin Stone Forest Yunnan karst",
      category: "nature",
    },
    "Western Hills": {
      key: "kunming_western_hills",
      searchTerm: "Kunming Western Hills Dianchi Lake Dragon Gate",
      category: "nature",
    },
    "Dali old town": {
      key: "kunming_dali_old_town",
      searchTerm: "Dali ancient town Yunnan",
      category: "culture",
    },
    "Erhai Lake": {
      key: "kunming_erhai_lake",
      searchTerm: "Erhai Lake Dali Yunnan",
      category: "nature",
    },
  },
  shenzhen: {
    "Ping An Finance Centre": {
      key: "shenzhen_ping_an_tower",
      searchTerm: "Shenzhen Ping An Finance Centre skyline",
      category: "cityscape",
    },
    "OCT-LOFT": {
      key: "shenzhen_oct_loft",
      searchTerm: "Shenzhen OCT LOFT Creative Park",
      category: "culture",
    },
    "Shenzhen Bay Park": {
      key: "shenzhen_bay_park",
      searchTerm: "Shenzhen Bay Park coastal walk",
      category: "nature",
    },
    "Huaqiangbei electronics": {
      key: "shenzhen_huaqiangbei",
      searchTerm: "Shenzhen Huaqiangbei electronics market",
      category: "cityscape",
    },
  },
  guangzhou: {
    "Canton Tower": {
      key: "guangzhou_canton_tower",
      searchTerm: "Guangzhou Canton Tower night",
      category: "cityscape",
    },
    "Shamian Island": {
      key: "guangzhou_shamian_island",
      searchTerm: "Guangzhou Shamian Island colonial architecture",
      category: "cityscape",
    },
    "Chen Clan Ancestral Hall": {
      key: "guangzhou_chen_clan_hall",
      searchTerm: "Guangzhou Chen Clan Ancestral Hall Lingnan",
      category: "culture",
    },
    "dim sum breakfast": {
      key: "guangzhou_dim_sum",
      searchTerm: "Guangzhou dim sum yum cha breakfast",
      category: "food",
    },
    "Shangxiajiu": {
      key: "guangzhou_shangxiajiu",
      searchTerm: "Guangzhou Shangxiajiu Pedestrian Street",
      category: "culture",
    },
  },
};

// 城市封面图
const cityCovers: Record<string, ActivityImageEntry> = {
  beijing: { key: "beijing_cover", searchTerm: "Beijing Forbidden City skyline panorama", category: "cityscape" },
  shanghai: { key: "shanghai_cover", searchTerm: "Shanghai Pudong Bund panorama", category: "cityscape" },
  chengdu: { key: "chengdu_cover", searchTerm: "Chengdu giant panda Sichuan", category: "nature" },
  guilin: { key: "guilin_cover", searchTerm: "Guilin Li River karst mountains", category: "nature" },
  xian: { key: "xian_cover", searchTerm: "Xi'an Terracotta Warriors", category: "landmark" },
  hangzhou: { key: "hangzhou_cover", searchTerm: "Hangzhou West Lake panorama", category: "nature" },
  zhangjiajie: { key: "zhangjiajie_cover", searchTerm: "Zhangjiajie sandstone pillars", category: "nature" },
  suzhou: { key: "suzhou_cover", searchTerm: "Suzhou classical garden bridge", category: "landmark" },
  xiamen: { key: "xiamen_cover", searchTerm: "Xiamen Gulangyu Island sea view", category: "nature" },
  nanjing: { key: "nanjing_cover", searchTerm: "Nanjing Ming Xiaoling Mausoleum", category: "landmark" },
  kunming: { key: "kunming_cover", searchTerm: "Yunnan Stone Forest landscape", category: "nature" },
  shenzhen: { key: "shenzhen_cover", searchTerm: "Shenzhen modern skyline", category: "cityscape" },
  guangzhou: { key: "guangzhou_cover", searchTerm: "Guangzhou modern skyline Canton Tower", category: "cityscape" },
};

export function getCityActivityImageMap(cityId: string): Record<string, ActivityImageEntry> | undefined {
  return cityActivityImages[cityId];
}

export function getCityCoverEntry(cityId: string): ActivityImageEntry | undefined {
  return cityCovers[cityId];
}

export function getAllCityActivityImages(): Record<string, Record<string, ActivityImageEntry>> {
  return cityActivityImages;
}
