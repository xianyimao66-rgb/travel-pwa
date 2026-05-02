import Link from "next/link";
import { notFound } from "next/navigation";

const destinations: Record<string, { name: string; description: string; highlights: string[] }> = {
  beijing: {
    name: "北京",
    description: "北京，中华人民共和国的首都，是一座有着三千多年历史的古都。这里既有故宫、天坛等世界文化遗产，也有鸟巢、国贸等现代建筑地标。烤鸭、涮羊肉、豆汁等美食让人流连忘返。",
    highlights: ["故宫博物院", "长城（八达岭/慕田峪）", "天坛", "颐和园", "南锣鼓巷", "798艺术区"],
  },
  shanghai: {
    name: "上海",
    description: "上海，中国的经济中心，是一座兼具现代繁华与历史韵味的国际大都市。外滩的万国建筑群、陆家嘴的摩天大楼、弄堂里的市井生活，构成了这座城市的独特魅力。",
    highlights: ["外滩", "东方明珠塔", "豫园", "南京路步行街", "迪士尼乐园", "武康路"],
  },
  chengdu: {
    name: "成都",
    description: "成都，四川省省会，被誉为天府之国。这里是国宝大熊猫的故乡，也是联合国教科文组织命名的美食之都。悠闲的生活节奏、麻辣鲜香的川菜、古老的宽窄巷子，让这座城市充满了独特的魅力。",
    highlights: ["大熊猫繁育研究基地", "宽窄巷子", "锦里", "都江堰", "青城山", "人民公园"],
  },
  xiamen: {
    name: "厦门",
    description: "厦门，福建省东南沿海的城市，被誉为海上花园。鼓浪屿的万国建筑、环岛路的椰风海韵、曾厝垵的文艺小店，让这座海滨城市充满了浪漫气息。",
    highlights: ["鼓浪屿", "厦门大学", "南普陀寺", "环岛路", "曾厝垵", "中山路步行街"],
  },
  guilin: {
    name: "桂林",
    description: "桂林，广西壮族自治区东北部，以山水甲天下闻名于世。漓江两岸的喀斯特峰林、阳朔的田园风光，构成了一幅幅如诗如画的山水画卷。",
    highlights: ["漓江竹筏", "阳朔西街", "象鼻山", "龙脊梯田", "银子岩", "十里画廊"],
  },
  dali: {
    name: "大理",
    description: "大理，云南西部，以风花雪月（下关风、上关花、苍山雪、洱海月）闻名。古城里的白族建筑、苍山洱海的壮丽景色，让这里成为无数人心中的诗和远方。",
    highlights: ["大理古城", "洱海骑行", "苍山", "崇圣寺三塔", "喜洲古镇", "双廊"],
  },
  hangzhou: {
    name: "杭州",
    description: "杭州，浙江省省会，自古就有上有天堂下有苏杭的美誉。西湖美景、龙井茶香、灵隐钟声，这座江南名城处处散发着温婉的诗意。",
    highlights: ["西湖", "雷峰塔", "灵隐寺", "宋城", "西溪湿地", "龙井村"],
  },
  chongqing: {
    name: "重庆",
    description: "重庆，中国四大直辖市之一，被称为8D魔幻城市。依山而建的建筑、穿楼而过的轻轨、热气腾腾的火锅、璀璨的夜景，无一不让人惊叹。",
    highlights: ["洪崖洞", "解放碑", "长江索道", "磁器口古镇", "李子坝轻轨站", "南山一棵树"],
  },
  sanya: {
    name: "三亚",
    description: "三亚，海南岛最南端的热带滨海城市，被誉为东方夏威夷。洁白沙滩、碧蓝海水、椰林婆娑，是度假休闲的绝佳选择。",
    highlights: ["亚龙湾", "天涯海角", "蜈支洲岛", "南山寺", "大小洞天", "鹿回头"],
  },
};

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dest = destinations[id];
  if (!dest) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/destinations" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← 返回目的地
        </Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-md">
        <h1 className="text-3xl font-bold">{dest.name}</h1>
        <p className="mt-4 text-blue-100 leading-relaxed">{dest.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">热门景点</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dest.highlights.map((spot) => (
            <div
              key={spot}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <p className="font-medium text-gray-900">{spot}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href={`/trip-planner?destination=${encodeURIComponent(dest.name)}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-600"
        >
          ✨ 用 AI 规划{dest.name}行程
        </Link>
      </div>
    </div>
  );
}
