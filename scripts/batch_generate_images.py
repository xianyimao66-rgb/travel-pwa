#!/usr/bin/env python3
"""
batch_generate_images.py — 批量生成旅行景点图（通义万相 API）
用法: python3 batch_generate_images.py [city_id]
  不传参数 = 生成所有城市
  传 chengdu = 只生成成都
"""

import os, sys, json, time, base64, subprocess, shutil

# 强制 stdout 实时输出
sys.stdout = open(sys.stdout.fileno(), 'w', buffering=1)
sys.stderr = open(sys.stderr.fileno(), 'w', buffering=1)

API_KEY = "sk-f280a496102340ecb26098bbafc08460"
BASE_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
OUTPUT_DIR = os.path.expanduser("~/.openclaw/workspace/travel-pwa/public/images")

# 每张图的 prompt（英文，适合通义万相）
PROMPTS = {
    # ── 成都 ──
    "chengdu_panda_base": "A giant panda eating bamboo at Chengdu Giant Panda Breeding Research Base, sunny day, lush green bamboo forest background, photorealistic travel photography style, bright natural lighting",
    "chengdu_jinli_street": "Jinli Ancient Street in Chengdu at dusk, traditional Sichuan architecture with red lanterns hanging, stone-paved street with souvenir shops, warm ambient lighting, photorealistic travel photography",
    "chengdu_hotpot": "Close-up of bubbling Sichuan hotpot with red chili oil, sliced beef, tofu, and vegetables cooking in a traditional brass pot, steam rising, warm restaurant atmosphere, food photography style",
    "chengdu_leshan_buddha": "Leshan Giant Buddha statue carved into cliff face overlooking river confluence, 71-meter tall stone Buddha with detailed carvings, cloudy sky, grand scale landscape photography",
    "chengdu_face_changing_opera": "Sichuan opera performer in colorful traditional costume performing face-changing (bian lian), dramatic stage lighting, red and gold mask, vibrant cultural performance photography",
    "chengdu_sichuan_cuisine": "Table full of authentic Sichuan dishes including mapo tofu, kung pao chicken, dan dan noodles, beautifully plated with fresh ingredients garnish, warm restaurant lighting, food photography",
    "chengdu_kuanzhai_alley": "Kuanzhai Alley in Chengdu, wide and narrow traditional lane with Qing dynasty architecture, boutiques and tea houses, blue sky with white clouds, cultural street photography",
    "chengdu_teahouse": "Traditional Chengdu teahouse with bamboo chairs and tables, locals drinking tea and playing mahjong, hanging birdcages, warm afternoon sunlight, documentary photography style",
    "chengdu_qingcheng_mountain": "Mount Qingcheng misty mountain path with ancient Taoist temple among lush green forest, stone steps winding through bamboo groves, morning fog creating mystical atmosphere, landscape photography",
    "chengdu_dujiangyan": "Dujiangyan ancient irrigation system still in use today, water flowing through the fish-mouth divider, mountain backdrop with lush vegetation, engineering marvel photography",
    "chengdu_sichuan_museum": "Sichuan Museum exterior with traditional Chinese architecture elements, bronze artifacts exhibition hall with golden lighting, cultural heritage photography style",

    # ── 北京 ──
    "beijing_forbidden_city": "Beijing Forbidden City grand Hall of Supreme Harmony, red walls and golden roof tiles, wide courtyard with marble terraces, blue sky, imperial architecture photography",
    "beijing_tiananmen": "Tiananmen Square with Tiananmen gate tower, portrait of Mao Zedong, flag flying, wide panoramic view with National Museum and Great Hall of the People, documentary photography",
    "beijing_great_wall": "Mutianyu Great Wall section winding over green forested mountains, ancient stone wall against blue sky, watchtowers in distance, panoramic landscape photography",
    "beijing_temple_of_heaven": "Temple of Heaven圆形 altar with blue-glazed roof against blue sky, triple-tiered circular building with intricate wooden brackets, surrounded by ancient cypress trees",
    "beijing_hutong": "Narrow Beijing hutong alleyway with traditional siheyuan courtyard houses, bicycles parked along grey brick walls, autumn leaves, authentic everyday Beijing street photography",
    "beijing_summer_palace": "Summer Palace Kunming Lake with Seventeen-Arch Bridge, Longevity Hill with Buddhist Incense Tower in background, willow trees along shore, golden hour landscape photography",
    "beijing_798_art": "798 Art District industrial architecture with contemporary murals, old factory buildings converted into galleries, avant-garde sculptures in courtyard, creative urban photography",
    "beijing_peking_duck": "Whole roasted Peking duck with crispy golden-brown skin being carved at table, accompanied by thin pancakes, spring onions, cucumber and sweet bean sauce, fine dining photography",
    "beijing_ming_tombs": "Ming Tombs Sacred Way with stone statues of animals and officials lining the path, autumn trees, Ming dynasty imperial burial architecture, historical path photography",

    # ── 上海 ──
    "shanghai_bund": "Shanghai Bund waterfront with colonial-era buildings on one side and Pudong modern skyscrapers skyline on the other, Huangpu River in middle, dusk golden hour cityscape photography",
    "shanghai_oriental_pearl": "Oriental Pearl Tower with its distinctive pink spheres rising above Lujiazui financial district, modern architecture against blue sky, Pudong skyline photography",
    "shanghai_yuyuan": "Yuyuan Garden classical Suzhou-style garden with zigzag bridges over koi ponds, traditional pavilions with upturned eaves, willow trees, peaceful Shanghai oasis photography",
    "shanghai_french_concession": "Shanghai French Concession tree-lined avenue with plane trees, elegant Art Deco apartment buildings, bicycles and cafes, dappled sunlight filtering through leaves",
    "shanghai_tianzifang": "Tianzifang arts and crafts district with narrow winding lanes, boutique shops and cafes housed in shikumen lane houses, creative atmosphere, Shanghai cultural photography",
    "shanghai_museum": "Shanghai Museum exterior with distinctive round top and square base architecture, People's Square location, modern classical Chinese design photography",
    "shanghai_xiaolongbao": "Steamed xiaolongbao soup dumplings in bamboo steamer basket, delicate pleated wrappers, steam rising, soy vinegar dipping sauce, close-up food photography",
    "shanghai_maglev": "Shanghai Maglev train in motion reaching 431 km/h, streamlined silver bullet train, elevated track, Pudong airport approach, modern transportation photography",

    # ── 桂林 ──
    "guilin_reed_flute_cave": "Reed Flute Cave colorful stalactites and stalagmites illuminated by multicolored lights, underground limestone cave formations reflecting in water, surreal natural wonder photography",
    "guilin_elephant_trunk": "Elephant Trunk Hill in Guilin, distinctive rock formation resembling an elephant drinking from Li River, green banks, clear water reflection, iconic karst landscape photography",
    "guilin_li_river": "Li River winding through karst mountain peaks, bamboo raft on emerald green water, misty morning, traditional fisherman with cormorants, iconic Guilin landscape photography",
    "guilin_west_street": "West Street Yangshuo bustling at night with neon lights, bars and restaurants, international travelers and local shops, Li River town nightlife photography",
    "guilin_moon_hill": "Moon Hill near Yangshuo with natural arch opening at summit, hiking trail through karst formations, lush green countryside, adventure landscape photography",
    "guilin_yulong_river": "Yulong River bamboo raft floating slowly past rice paddies and karst peaks, bamboo poles pushing through clear shallow water, serene countryside photography",
    "guilin_longji_terraces": "Longji Rice Terraces carved into hillsides like giant staircases, terraced fields reflecting sky, Yao ethnic minority village houses dotting the slopes, landscape photography",

    # ── 西安 ──
    "xian_city_wall": "Xi'an ancient City Wall with bicycle rider on top, wide brick rampart, watchtowers at intervals, Ming dynasty fortification, clear blue sky, historical architecture photography",
    "xian_muslim_quarter": "Xi'an Muslim Quarter bustling food street at night, glowing signs in Chinese and Arabic, street vendors grilling lamb skewers, crowds enjoying food, street photography",
    "xian_terracotta_warriors": "Terracotta Warriors Pit 1 with thousands of life-sized clay soldiers in battle formation, each with unique facial features, archaeological excavation site, museum lighting",
    "xian_terracotta_museum": "Terracotta Army Museum modern exterior building arched over the excavation pits, large hangar-like structure, historical site entrance photography",
    "xian_shaanxi_museum": "Shaanxi History Museum Tang dynasty style architecture, bronze and gold artifacts exhibits, dim atmospheric gallery lighting, cultural heritage museum photography",
    "xian_big_wild_goose": "Big Wild Goose Pagoda rising from Da Ci'en Temple complex, seven-story Buddhist pagoda against sunset sky, ancient Tang dynasty architecture in modern Xi'an",
    "xian_biangbiang_noodles": "Wide biangbiang noodles being stretched and slapped on counter, served in bowl with chili oil, garlic and vegetables, close-up Shaanxi street food photography",

    # ── 杭州 ──
    "hangzhou_west_lake": "West Lake Hangzhou at sunset, Leifeng Pagoda on hill, lotus flowers in foreground, gentle ripples on lake, traditional boat in distance, iconic Chinese landscape photography",
    "hangzhou_longjing": "Longjing tea terraces on rolling hills, fresh green tea leaves being hand-picked by farmers wearing bamboo hats, shallow baskets, morning mist, tea culture photography",
    "hangzhou_lingyin_temple": "Lingyin Temple with massive Buddhist statues carved into rock face, incense smoke rising, ancient temple buildings surrounded by lush forest, spiritual atmosphere photography",
    "hangzhou_hefang_street": "Hefang Street ancient shopping street in Hangzhou, traditional architecture with wooden facades, hanging red lanterns, local snacks and souvenirs, evening cultural photography",
    "hangzhou_alibaba": "Alibaba Group global headquarters modern campus architecture in Hangzhou, glass and steel buildings, green spaces, tech company photography",

    # ── 张家界 ──
    "zhangjiajie_forest_park": "Zhangjiajie National Forest Park towering quartz-sandstone pillars rising through clouds, lush green vegetation on peaks, misty atmosphere, UNESCO surreal landscape photography",
    "zhangjiajie_tianmen_glass": "Tianmen Mountain Glass Skywalk protruding from cliff edge 1430 meters above ground, tourist walking on transparent glass floor, mountain valley below dangerous adventure photography",
    "zhangjiajie_tianmen_cable": "Tianmen Mountain cable car longest in world 7.5km ascending steep mountain face, cable car cabin with mountain views, engineering marvel extreme cableway photography",
    "zhangjiajie_glass_bridge": "Zhangjiajie Grand Canyon Glass Bridge transparent floor suspended between cliffs, tourists walking across, deep valley below, modern architectural engineering photography",
    "zhangjiajie_avatar_column": "Southern Sky Column also known as Avatar Hallelujah Mountain, tall thin sandstone pillar piercing through clouds, inspiration for Avatar floating mountains landscape photography",

    # ── 苏州 ──
    "suzhou_humble_admin_garden": "Humble Administrator's Garden classical Suzhou garden with lotus pond, zigzag pavilion bridge, rockery and bamboo grove, perfect traditional Chinese garden landscape photography",
    "suzhou_pingjiang_road": "Pingjiang Road ancient canal street in Suzhou, willow trees overhanging water, traditional white-walled buildings with black tile roofs, stone bridges, canal-side photography",
    "suzhou_zhouzhuang": "Zhouzhuang water town winding canals with gondola-style boats, Ming and Qing dynasty houses directly on water, double bridges landmark, Venice of the East photography",
    "suzhou_museum": "Suzhou Museum designed by I.M. Pei, modern geometric architecture with white walls, grey roofs reflecting traditional Suzhou elements, water garden courtyard photography",
    "suzhou_kunqu_opera": "Kunqu Opera performer in elaborate embroidered costume and headdress, elegant stage movements, traditional Chinese theater performance, artistic cultural photography",

    # ── 厦门 ──
    "xiamen_gulangyu": "Gulangyu Island car-free paradise with winding lanes, European colonial villas with red brick and white columns, blooming bougainvillea, piano museum, island architecture photography",
    "xiamen_nanputuo": "Nanputuo Temple Buddhist complex at base of Wulao Mountain, grand temple halls, burning incense, ocean in background, spiritual seaside temple photography",
    "xiamen_shapowei": "Shapowei art district in Xiamen, converted warehouse with murals, cafes and galleries along the waterfront, creative bohemian neighborhood photography",
    "xiamen_oyster_omelet": "Fujian oyster omelet (oh-ah-jian) crispy on outside with fresh oysters and egg, served with sweet chili sauce, Xiamen street food close-up photography",
    "xiamen_ring_road": "Xiamen island ring road cycling path along pristine coastline, beach on one side and modern city on other, blue sea and sky, leisure outdoor photography",

    # ── 南京 ──
    "nanjing_sun_yat_sen": "Sun Yat-sen Mausoleum grand staircase with 392 steps leading to white marble memorial hall, blue-tiled roof, surrounded by dense forest on Purple Mountain, monumental architecture",
    "nanjing_city_wall": "Nanjing Ming Dynasty City Wall massive stone fortification with arched gate, ancient bricks, Zhonghua Gate castle complex, longest city wall ever built photography",
    "nanjing_confucius_temple": "Confucius Temple Qinhuai River night scene with illuminated traditional architecture, red lanterns reflecting on water, Fuzimiao bustling shopping area photography",
    "nanjing_memorial_hall": "Nanjing Massacre Memorial Hall solemn architectural complex with grey stone walls, peace bell, reflecting pool, sobering historical memorial photography",
    "nanjing_salted_duck": "Nanjing salted duck traditional dish sliced and arranged on plate, skin glistening, served with dipping sauce, classic Jiangsu cuisine food photography",

    # ── 广州 ──
    "guangzhou_canton_tower": "Canton Tower illuminated at night with colorful LED lights, tallest TV tower in China twisting silhouette, reflection in Pearl River, modern cityscape photography",
    "guangzhou_shamian_island": "Shamian Island tranquil tree-lined streets with European colonial mansions, Notre Dame-style church, cafes and consulates, Guangzhou peaceful oasis photography",
    "guangzhou_chen_clan_hall": "Chen Clan Ancestral Hall exquisite Lingnan architecture with intricate wood carvings, stone sculptures, ceramic roof ridges, traditional courtyard complex photography",
    "guangzhou_dim_sum": "Traditional Cantonese dim sum spread with bamboo steamers of har gow, siu mai, rice rolls, char siu bao on table, tea cups and chopsticks, breakfast food photography",
    "guangzhou_shangxiajiu": "Shangxiajiu Pedestrian Street vibrant shopping arcade with traditional qilou arcade buildings, neon signs, crowds shopping, Canton street life photography",
    "guangzhou_baiyun_mountain": "Baiyun Mountain (White Cloud Mountain) cable car ascending, Guangzhou skyline in distance from mountain top viewing platform, urban nature photography",

    # ── 深圳 ──
    "shenzhen_ping_an_tower": "Ping An Finance Centre towering 599 meters with distinctive triangular crown, modern supertall skyscraper against blue sky, downtown Shenzhen financial district photography",
    "shenzhen_oct_loft": "OCT-LOFT Creative Park industrial buildings converted to art galleries, design studios and cafes, street art murals, creative young people hanging out, cultural district photography",
    "shenzhen_bay_park": "Shenzhen Bay Park coastal boardwalk stretching along shoreline, mangroves and bird watching, modern urban park with skyline backdrop, outdoor recreation photography",
    "shenzhen_huaqiangbei": "Huaqiangbei electronics market bustling with stalls selling electronic components, phones and gadgets, vibrant signage, Shenzhen tech hardware hub street photography",
    "shenzhen_window_of_world": "Window of the World park with mini Eiffel Tower, Pyramids and other world landmarks, tourists taking photos, theme park entertainment photography",

    # ── 昆明 ──
    "kunming_green_lake": "Green Lake Park (Cuihu) in Kunming with willow trees around lake, thousands of red-beaked gulls flying and swimming in winter, locals dancing and practicing tai chi, park photography",
    "kunming_stone_forest": "Shilin Stone Forest towering limestone karst pillars rising from ground like stone trees, walking paths between formations, UNESCO geopark wonder landscape photography",
    "kunming_western_hills": "Western Hills Dragon Gate carved stone stairway along cliff face overlooking Dianchi Lake, panoramic view of lake and Kunming city, Taoist temple caves photography",
    "kunming_dali_old_town": "Dali ancient town with Bai ethnic architecture, Cangshan Mountain backdrop, cobblestone streets, traditional tie-dye fabric shops and cafes, Yunnan culture photography",
    "kunming_erhai_lake": "Erhai Lake crystal clear blue water with Cangshan Mountain reflection, small fishing boats, blooming flowers on shore, Dali region natural beauty photography",
    "kunming_yunnan_cuisine": "Yunnan cross-bridge rice noodles (guoqiao mixian) served in large bowl with boiling broth, various ingredients on side plates, flower-themed dishes, Yunnan food photography",

    # ── 封面 ──
    "chengdu_cover": "Chengdu cityscape with giant panda in foreground, Sichuan province natural beauty, Chengdu skyline in background with traditional and modern buildings mixed, travel magazine photography",
    "beijing_cover": "Panoramic view of Beijing Forbidden City with modern CBD skyline in distance, traditional and modern China juxtaposition, blue sky with clouds, grand cityscape photography",
    "shanghai_cover": "Shanghai Pudong skyline across Huangpu River with Oriental Pearl Tower and Shanghai Tower skyscrapers, Bund on opposite bank, golden hour dramatic lighting, iconic city photography",
    "guilin_cover": "Guilin Li River karst landscape panorama with multiple peaks rising from emerald water, bamboo raft in foreground, misty layers of mountains receding, iconic Chinese landscape",
    "xian_cover": "Xi'an ancient city wall with modern skyline and Bell Tower in center, historical and modern Xi'an blending, Terracotta Warrior silhouette, cultural heritage photography",
    "hangzhou_cover": "Hangzhou West Lake panorama from high viewpoint, Leifeng Pagoda on hill, city skyline beyond the lake, lotus flowers and traditional boats, paradise city photography",
    "zhangjiajie_cover": "Zhangjiajie towering sandstone pillars emerging from sea of clouds, misty mountain peaks, Avatar inspiration landscape, surreal natural wonder panoramic photography",
    "suzhou_cover": "Suzhou classical garden pond with zigzag bridge and pavilion, traditional white walls and grey roofs, weeping willow trees, harmonious Chinese garden photography",
    "xiamen_cover": "Xiamen Gulangyu Island from sea perspective, colonial buildings among tropical greenery, peaceful sea with boats, island city photography",
    "nanjing_cover": "Nanjing Ming Xiaoling Mausoleum Sacred Way with autumn leaves framing stone statues, imperial tomb path, historical grandeur photography",
    "kunming_cover": "Yunnan Kunming flower market explosion of colorful fresh flowers, tulips, roses and lilies, Spring City year-round blooms, vibrant floral photography",
    "shenzhen_cover": "Shenzhen modern skyline with Ping An Finance Centre, green parks and coastline integrated with ultra-modern architecture, futuristic Chinese cityscape photography",
    "guangzhou_cover": "Guangzhou modern skyline with Canton Tower, Pearl River winding through, green hills behind, Lingnan cityscape photography",
}


def call_wanx(prompt_key, description):
    """调用通义万相API生成图片，返回任务ID"""
    prompt_desc = PROMPTS[prompt_key]
    
    cmd = [
        "curl", "-s",
        BASE_URL,
        "-H", f"Authorization: Bearer {API_KEY}",
        "-H", "Content-Type: application/json",
        "-H", "X-DashScope-Async: enable",
        "-d", json.dumps({
            "model": "wanx2.1-t2i-turbo",
            "input": {"prompt": prompt_desc},
            "parameters": {"size": "1024*1024", "n": 1}
        }, ensure_ascii=False)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    try:
        data = json.loads(result.stdout)
        task_id = data["output"]["task_id"]
        return task_id
    except (KeyError, json.JSONDecodeError) as e:
        print(f"  ❌ 提交失败: {result.stdout[:200]}")
        return None


def poll_task(task_id, prompt_key, max_wait=120):
    """轮询任务直到完成，返回图片URL"""
    url = f"https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}"
    
    start = time.time()
    while time.time() - start < max_wait:
        cmd = [
            "curl", "-s", url,
            "-H", f"Authorization: Bearer {API_KEY}"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        try:
            data = json.loads(result.stdout)
            status = data.get("output", {}).get("task_status", "UNKNOWN")
            
            if status == "SUCCEEDED":
                results = data.get("output", {}).get("results", [])
                if results:
                    return results[0].get("url")
                # 也可能是 base64
                return data.get("output", {}).get("result")
            elif status == "FAILED":
                msg = data.get("output", {}).get("message", "unknown error")
                print(f"  ❌ 失败: {msg}")
                return None
            elif status == "PENDING" or status == "RUNNING":
                elapsed = int(time.time() - start)
                if elapsed % 20 == 0:
                    print(f"  ⏳ 等待中... {elapsed}s")
                time.sleep(3)
            else:
                print(f"  ❓ 未知状态: {status}")
                print(json.dumps(data, indent=2)[:300])
                return None
        except json.JSONDecodeError:
            time.sleep(3)
    
    print(f"  ⏰ 超时")
    return None


def download_image(url, filepath):
    """下载图片到目标路径"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    cmd = ["curl", "-sL", "-o", filepath, url, "--max-time", "30"]
    subprocess.run(cmd, timeout=35)
    size = os.path.getsize(filepath) if os.path.exists(filepath) else 0
    return size > 1000  # 至少 1KB


def main():
    filter_city = sys.argv[1] if len(sys.argv) > 1 else None
    
    # 要生成的图片列表
    to_generate = []
    for key in PROMPTS:
        if filter_city:
            if not key.startswith(filter_city):
                continue
        
        # 判断是封面还是活动图
        if "cover" in key:
            dirname = "destinations"
        else:
            dirname = "attractions"
        
        filepath = os.path.join(OUTPUT_DIR, dirname, f"{key}.jpg")
        
        # 跳过已有文件
        if os.path.exists(filepath) and os.path.getsize(filepath) > 50000:
            print(f"  ⏭️ 跳过 {key}.jpg（已存在）")
            continue
        
        to_generate.append((key, filepath))
    
    total = len(to_generate)
    print(f"需要生成: {total} 张图\n")
    
    for idx, (key, filepath) in enumerate(to_generate, 1):
        print(f"[{idx}/{total}] 提交: {key}.jpg")
        
        task_id = call_wanx(key, "")
        if not task_id:
            continue
        
        # 轮询
        print(f"  🆔 任务: {task_id}")
        url = poll_task(task_id, key)
        
        if url:
            print(f"  ✅ 下载中...")
            success = download_image(url, filepath)
            if success:
                size_kb = os.path.getsize(filepath) / 1024
                print(f"  ✅ 已保存 ({size_kb:.0f} KB): {filepath}")
            else:
                print(f"  ❌ 下载失败")
        else:
            print(f"  ❌ 未获取到下载链接")
        
        # 每张图间隔，避免频率限制
        time.sleep(1)
    
    print(f"\n完成！共生成 {total} 张图")


if __name__ == "__main__":
    main()
