'use client';

export default function GalleryPage() {
  const cities = [
    { id: 'beijing', name: '北京·天坛祈年殿' },
    { id: 'chengdu', name: '成都·大熊猫吃竹子' },
    { id: 'guangzhou', name: '广州·广州塔' },
    { id: 'hangzhou', name: '杭州·西湖雷峰塔' },
    { id: 'nanjing', name: '南京·中山陵' },
    { id: 'shanghai', name: '上海·外滩陆家嘴' },
    { id: 'shenzhen', name: '深圳·平安大厦天际线' },
    { id: 'suzhou', name: '苏州·拙政园' },
    { id: 'xiamen', name: '厦门·鼓浪屿' },
    { id: 'zhangjiajie', name: '张家界·武陵源峰林' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">城市配图检查</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cities.map((c) => (
          <div key={c.id} className="border rounded-lg overflow-hidden">
            <img
              src={`/images/destinations/${c.id}.jpg`}
              alt={c.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-3 bg-gray-50">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-500">
                {c.id}.jpg · 来源: 699pic.com (摄图网)
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-400">
        访问 http://localhost:7788/gallery 查看所有配图
      </p>
    </div>
  );
}
