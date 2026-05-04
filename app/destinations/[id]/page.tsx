import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestination, getDestinationIds } from "@/lib/destinations";
import { isValidImage, getCoverImageUrl, getDayActivityImages } from "@/lib/images";
import { destinations } from "@/lib/destinations";
import { getCityActivityImageMap } from "@/lib/image-search";

export function generateStaticParams() {
  return getDestinationIds().map((id) => ({ id }));
}

// Sample itinerary templates for each destination
function getSampleItinerary(id: string) {
  const templates: Record<string, { days: number; title: string; daily: { day: number; title: string; activities: string[] }[]; highlights: string[] }> = {
    shanghai: {
      days: 5,
      title: "Classic Shanghai — Modern & Traditional",
      daily: [
        { day: 1, title: "The Bund & Pudong Skyline", activities: ["Walk the Bund at golden hour", "Visit the Oriental Pearl Tower", "Dinner with a view at Jade on 36"] },
        { day: 2, title: "Old Shanghai Charm", activities: ["Morning at Yuyuan Garden", "Lunch at the City God Temple food street", "Afternoon walk in the French Concession"] },
        { day: 3, title: "Art & Culture Immersion", activities: ["Power Station of Art", "Tianzifang artsy lanes", "Shanghai Museum at People's Square"] },
        { day: 4, title: "Zhujiajiao Water Town Day Trip", activities: ["Ancient water town canals", "Visit Kezhi Garden", "Traditional river boat ride"] },
        { day: 5, title: "Modern Life & Departure", activities: ["Nanjing Road shopping", "Final xiaolongbao feast at Din Tai Fung", "Maglev train to airport"] },
      ],
      highlights: ["Pudong skyline from the Bund", "Xiaolongbao (soup dumplings)", "French Concession architecture", "Maglev train experience"],
    },
    beijing: {
      days: 6,
      title: "Imperial Beijing — Emperors & Hutongs",
      daily: [
        { day: 1, title: "Forbidden City & Tiananmen", activities: ["Full morning at the Forbidden City", "Tiananmen Square", "Jingshan Park for rooftop view"] },
        { day: 2, title: "The Great Wall (Mutianyu)", activities: ["Early departure to Mutianyu", "Toboggan ride down the wall", "Back to Beijing by afternoon"] },
        { day: 3, title: "Temple of Heaven & Hutongs", activities: ["Temple of Heaven park at sunrise", "Hutong rickshaw tour", "Lunch at a courtyard restaurant"] },
        { day: 4, title: "Summer Palace & Art Zone", activities: ["Summer Palace lake walk", "798 Art District", "Peking duck dinner"] },
        { day: 5, title: "Ming Tombs & Spirit Way", activities: ["Dingling tomb exploration", "Sacred Way stroll", "Night market snack crawl"] },
        { day: 6, title: "Last Morning & Departure", activities: ["Jingshan Park morning", "Silk Market souvenirs", "Airport express train"] },
      ],
      highlights: ["Forbidden City", "Great Wall (Mutianyu)", "Peking duck", "Hutong alleyways"],
    },
    chengdu: {
      days: 5,
      title: "Chengdu — Pandas, Spice & Ancient Shu",
      daily: [
        { day: 1, title: "Giant Pandas & Hotpot", activities: ["Giant Panda Breeding Research Base (morning)", "Jinli Ancient Street", "Sichuan hotpot dinner"] },
        { day: 2, title: "Leshan Giant Buddha Day Trip", activities: ["Leshan Giant Buddha", "Boat ride for full view", "Back to Chengdu for face-changing opera"] },
        { day: 3, title: "Kuanzhai Alley & Tea Culture", activities: ["Kuanzhai Alley walk", "Tea house people-watching", "Sichuan cuisine cooking class"] },
        { day: 4, title: "Mount Qingcheng & Dujiangyan", activities: ["Taoist mountain temple hike", "Dujiangyan irrigation system", "Local farmhouse dinner"] },
        { day: 5, title: "Museum & Departure", activities: ["Sichuan Museum", "Final spicy feast", "Departure"] },
      ],
      highlights: ["Giant pandas", "Sichuan hotpot", "Leshan Giant Buddha", "Sichuan opera"],
    },
    guilin: {
      days: 5,
      title: "Guilin & Yangshuo — Peaks & Rivers",
      daily: [
        { day: 1, title: "Reed Flutes & Elephant Trunk", activities: ["Reed Flute Cave", "Elephant Trunk Hill", "Night market along Zhengyang Street"] },
        { day: 2, title: "Li River to Yangshuo", activities: ["Li River cruise (4-5 hrs)", "West Street in Yangshuo", "Impression Liu Sanjie show"] },
        { day: 3, title: "Yangshuo Countryside", activities: ["Bike through rice paddies", "Moon Hill hike", "Bamboo raft on Yulong River"] },
        { day: 4, title: "Longji Rice Terraces", activities: ["2hr drive to Longji", "Viewpoint trek", "Stay in Yao ethnic village guesthouse"] },
        { day: 5, title: "Terraces Sunrise & Departure", activities: ["Sunrise at the terraces", "Drive back to Guilin", "Departure"] },
      ],
      highlights: ["Li River karst landscape", "Yangshuo countryside biking", "Longji rice terraces", "Bamboo rafting"],
    },
    xian: {
      days: 4,
      title: "Xi'an — Ancient Capital & Warriors",
      daily: [
        { day: 1, title: "City Wall & Muslim Quarter", activities: ["Ride a bike on the City Wall", "Muslim Quarter food crawl", "Drum & Bell Towers at night"] },
        { day: 2, title: "Terracotta Warriors", activities: ["Terracotta Army Museum", "Option: Huaqing Hot Springs", "Biangbiang noodles for dinner"] },
        { day: 3, title: "History Deep Dive", activities: ["Shaanxi History Museum", "Big Wild Goose Pagoda", "Tang Dynasty show at night"] },
        { day: 4, title: "Last Morning & Departure", activities: ["Small Wild Goose Pagoda", "City Wall walk", "Departure"] },
      ],
      highlights: ["Terracotta Warriors", "City Wall cycling", "Muslim Quarter street food", "Shaanxi History Museum"],
    },
    kunming: {
      days: 5,
      title: "Yunnan Discovery — Kunming & Beyond",
      daily: [
        { day: 1, title: "Spring City Arrival", activities: ["Green Lake Park (Cuihu)", "Yunnan University campus", "Flowers & Birds Market"] },
        { day: 2, title: "Stone Forest Day Trip", activities: ["Shilin Stone Forest", "Sani ethnic village", "Back to Kunming for cross-bridge noodles"] },
        { day: 3, title: "Western Hills & Dianchi", activities: ["Dragon Gate hike on Western Hills", "Dianchi Lake cruise", "Yunnan cuisine dinner"] },
        { day: 4, title: "Dali or Jianshui Option", activities: ["Option A: 2hr train to Dali old town", "Erhai Lake view", "Bai architecture walk"] },
        { day: 5, title: "Departure", activities: ["Morning tea at a local tea house", "Butterfly Spring if in Dali", "Departure"] },
      ],
      highlights: ["Stone Forest", "Fresh flowers market", "Cross-bridge rice noodles", "Spring city climate"],
    },
    shenzhen: {
      days: 4,
      title: "Shenzhen — Innovation & Coastline",
      daily: [
        { day: 1, title: "Modern Skyline", activities: ["Ping An Finance Centre observation deck", "Lianhua Mountain Park", "Coco Park nightlife"] },
        { day: 2, title: "Tech & Creativity", activities: ["Huawei/腾讯 tour (by appt)", "OCT-LOFT creative district", "Seafood dinner in Shekou"] },
        { day: 3, title: "Dameisha & Dapeng", activities: ["Dameisha Beach", "Dapeng Fortress village", "Coastal hiking trail"] },
        { day: 4, title: "Splendid China & Departure", activities: ["Splendid China folk park", "Window of the World", "Departure"] },
      ],
      highlights: ["Tech hub visit", "Coastal hiking", "OCT-LOFT art district", "Shekou seafood"],
    },
    suzhou: {
      days: 3,
      title: "Suzhou — Gardens & Canals",
      daily: [
        { day: 1, title: "Classic Gardens", activities: ["Zhuozheng Yuan (Humble Admin's Garden)", "Lion Grove Garden", "Pingjiang Road canal walk"] },
        { day: 2, title: "Water Town & Silk", activities: ["Tongli or Zhouzhuang water town", "Silk museum", "Suzhou-style dinner"] },
        { day: 3, title: "Tiger Hill & Departure", activities: ["Tiger Hill pagoda", "Shantang Street canal", "High-speed train to Shanghai/next stop"] },
      ],
      highlights: ["Classical gardens (UNESCO)", "Water towns", "Silk embroidery", "Canal-side tea houses"],
    },
    guangzhou: {
      days: 4,
      title: "Guangzhou — Cantonese Food & Trade",
      daily: [
        { day: 1, title: "Canton Tower & Pearl River", activities: ["Canton Tower observation deck", "Pearl River night cruise", "Dinner in Zhujiang New Town"] },
        { day: 2, title: "Colonial & Traditional", activities: ["Shamian Island colonial walk", "Chen Clan Ancestral Hall", "Beijing Road shopping street"] },
        { day: 3, title: "Dim Sum & Food Tour", activities: ["Morning dim sum breakfast", "Shangxiajiu food street", "Huangsha seafood market"] },
        { day: 4, title: "Last Morning & Departure", activities: ["Baiyun Mountain hike", "Yuexiu Park & Zhenhai Tower", "Departure"] },
      ],
      highlights: ["Cantonese dim sum", "Canton Tower skyline", "Shamian Island architecture", "Pearl River night cruise"],
    },
    xiamen: {
      days: 4,
      title: "Xiamen — Island Living",
      daily: [
        { day: 1, title: "Gulangyu Island", activities: ["Ferry to Gulangyu Island", "Sunlight Rock viewpoint", "Piano Museum"] },
        { day: 2, title: "Coastal & Campus", activities: ["Cycle the island ring road", "Xiamen University campus", "Nanputuo Temple"] },
        { day: 3, title: "Art & Food", activities: ["Shapowei art district", "Try oyster omelet", "Huli Mountain Fort"] },
        { day: 4, title: "Last Day & Departure", activities: ["Zhongshan Road", "Hakka tulou day trip option", "Departure"] },
      ],
      highlights: ["Gulangyu Island", "Xiamen University", "Nanputuo Temple", "Fujian street food"],
    },
    nanjing: {
      days: 4,
      title: "Nanjing — Capital of Capitals",
      daily: [
        { day: 1, title: "Ming Dynasty Grandeur", activities: ["Ming Xiaoling Mausoleum", "Sacred Way stone statues", "Nanjing Museum"] },
        { day: 2, title: "Republican Era & River", activities: ["Sun Yat-sen Mausoleum", "Ming Dynasty City Wall at Zhonghua Gate", "Confucius Temple night market"] },
        { day: 3, title: "Modern Nanjing", activities: ["Nanjing Massacre Memorial Hall", "Xinjiekou shopping district", "Try Nanjing salted duck"] },
        { day: 4, title: "Last Morning & Departure", activities: ["Xuanwu Lake walk", "Jiming Temple", "Departure"] },
      ],
      highlights: ["Ming Xiaoling Mausoleum", "Ming Dynasty City Wall", "Sun Yat-sen Mausoleum", "Nanjing salted duck"],
    },
    zhangjiajie: {
      days: 3,
      title: "Zhangjiajie — Avatar Mountains",
      daily: [
        { day: 1, title: "National Forest Park", activities: ["Zhangjiajie National Forest Park", "Yuanjiajie scenic area", "Southern Sky Column (Avatar inspiration)"] },
        { day: 2, title: "Tianmen Mountain", activities: ["Tianmen Mountain cable car", "Glass Skywalk", "Heaven's Gate cave"] },
        { day: 3, title: "Grand Canyon & Departure", activities: ["Zhangjiajie Grand Canyon", "Glass Bridge walk", "Departure"] },
      ],
      highlights: ["Sandstone pillars", "Tianmen Mountain glass walkway", "Longest cable car in the world", "Zhangjiajie Glass Bridge"],
    },
  };

  return templates[id] || null;
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dest = getDestination(id);

  if (!dest) {
    notFound();
  }

  const hasImage = isValidImage(dest.id);
  const imageUrl = getCoverImageUrl(dest.id);
  const itinerary = getSampleItinerary(dest.id);

  // Find nearby destinations (same country, different city)
  const nearby = destinations
    .filter((d) => d.countryEn === dest.countryEn && d.id !== dest.id)
    .slice(0, 3);

  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={dest.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
            <span className="text-6xl">{dest.name[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {dest.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white">
            {dest.name}
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-1">
            {dest.nameEn} · {dest.country}
          </p>
        </div>
        <Link
          href="/destinations"
          className="absolute top-4 left-4 flex items-center gap-1 text-sm text-white/80 hover:text-white bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all"
        >
          ← Back
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Description */}
        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed">{dest.description}</p>
          <p className="text-gray-500 leading-relaxed mt-3 text-sm italic">
            {dest.descriptionZh}
          </p>
        </section>

        {/* Highlights */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            ✨ Highlights
          </h2>
          <div className="space-y-3">
            {dest.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1 text-blue-500 shrink-0">•</span>
                <p className="text-gray-700 text-sm leading-relaxed">{h}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample Itinerary */}
        {itinerary && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              🗺️ Suggested Itinerary
            </h2>
            <p className="text-sm text-gray-500 mb-4">{itinerary.title}</p>
            <div className="space-y-4">
              {itinerary.daily.map((day, dayIdx) => {
                // 预分配每张活动图，保证当天不重复
                const dayImages = getDayActivityImages(day.activities, dayIdx, dest.id);
                return (
                  <details
                    key={day.day}
                    className="group rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div>
                        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                          Day {day.day}
                        </span>
                        <p className="font-semibold text-gray-900 mt-0.5">
                          {day.title}
                        </p>
                      </div>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <div className="px-4 pb-4 space-y-3">
                      {day.activities.map((activity, actIdx) => {
                        const imgUrl = dayImages[actIdx];
                        return (
                          <div
                            key={actIdx}
                            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
                          >
                            {imgUrl ? (
                              <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                <img
                                  src={imgUrl}
                                  alt={activity}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="shrink-0 w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-lg">
                                📍
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900">{activity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick Facts */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: "Population", value: dest.quickFacts.population },
              { label: "Language", value: dest.quickFacts.language },
              { label: "Currency", value: dest.quickFacts.currency },
              { label: "Timezone", value: dest.quickFacts.timezone },
              { label: "Airport", value: dest.quickFacts.airport },
              { label: "Best for", value: dest.quickFacts.bestFor },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-gray-400 text-xs uppercase tracking-wide">{f.label}</p>
                <p className="mt-1 text-gray-800 font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Best Time & Budget */}
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold">Best Season</p>
            <p className="mt-1 font-medium text-gray-900">{dest.bestSeason || "Year-round"}</p>
          </div>
          {dest.avgBudget && (
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs uppercase tracking-wide text-green-500 font-semibold">Avg. Daily Budget</p>
              <p className="mt-1 font-medium text-gray-900">~¥{dest.avgBudget} (~${Math.round(dest.avgBudget / 7)})</p>
            </div>
          )}
        </section>

        {/* Trip.com CTA */}
        <section className="mb-10 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4 border border-orange-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-orange-800">🏨 Book Hotels for Your Trip</p>
              <p className="text-sm text-orange-600 mt-0.5">Find great deals on Trip.com</p>
            </div>
            <a
              href="https://trip.com"
              target="_blank"
              rel="nofollow sponsored noopener"
              className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              Search Hotels →
            </a>
          </div>
        </section>

        {/* Nearby Destinations */}
        {nearby.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Combine with Nearby Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nearby.map((n) => (
                <Link
                  key={n.id}
                  href={`/destinations/${n.id}`}
                  className="rounded-xl bg-white border border-gray-200 p-3 hover:border-blue-300 transition-colors"
                >
                  <p className="font-semibold text-gray-900 text-sm">{n.name}</p>
                  <p className="text-xs text-gray-500">{n.shortDescription}</p>
                  <p className="text-xs text-blue-500 mt-1">View itinerary →</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <Link
          href={`/trip-planner?destination=${encodeURIComponent(dest.name)}`}
          className="group block rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-5 text-white transition-all hover:shadow-lg text-center"
        >
          <p className="text-lg font-semibold group-hover:underline">
            ✨ Customize This {dest.name} Itinerary
          </p>
          <p className="text-sm text-blue-100 mt-1">
            Adjust days, budget, interests — get your perfect trip in seconds
          </p>
        </Link>
      </div>
    </div>
  );
}
