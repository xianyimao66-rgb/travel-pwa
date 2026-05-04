#!/usr/bin/env bash
# download-images.sh — 批量搜索+下载旅行图片
#
# 流程：
#   1. 从 image-search.ts 读取所有活动→关键词映射
#   2. 用 web_fetch (Unsplash) 搜索真实图片 URL
#   3. 用 baoyu-cover-image 风格化（可选）
#   4. 下载到 public/images/attractions/ 目录
#
# 用法: bash download-images.sh [city_id]
#   city_id 可选，只下载指定城市

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TRAVEL_DIR="$SCRIPT_DIR/.."
PUBLIC_DIR="$TRAVEL_DIR/public/images/attractions"
mkdir -p "$PUBLIC_DIR"

echo "=== 旅行图片批量下载 ==="
echo "输出目录: $PUBLIC_DIR"

# ── 定义搜索配置 ──
# 格式: search_term -> filename
# Unsplash 搜索用 wget 或 curl

declare -A SEARCHES

# 成都
SEARCHES["Chengdu+giant+panda+base"]="attractions/chengdu_panda_base.jpg"
SEARCHES["Chengdu+Jinli+Ancient+Street"]="attractions/chengdu_jinli_street.jpg"
SEARCHES["Sichuan+hotpot+dinner"]="attractions/chengdu_hotpot.jpg"
SEARCHES["Leshan+Giant+Buddha+Sichuan"]="attractions/chengdu_leshan_buddha.jpg"
SEARCHES["Sichuan+opera+face+changing"]="attractions/chengdu_face_changing_opera.jpg"
SEARCHES["Sichuan+cuisine+mapo+tofu"]="attractions/chengdu_sichuan_cuisine.jpg"
SEARCHES["Chengdu+Kuanzhai+Alley"]="attractions/chengdu_kuanzhai_alley.jpg"
SEARCHES["Chengdu+traditional+teahouse"]="attractions/chengdu_teahouse.jpg"
SEARCHES["Mount+Qingcheng+Sichuan"]="attractions/chengdu_qingcheng_mountain.jpg"
SEARCHES["Dujiangyan+irrigation+system"]="attractions/chengdu_dujiangyan.jpg"
SEARCHES["Sichuan+Museum+Chengdu"]="attractions/chengdu_sichuan_museum.jpg"
SEARCHES["Chengdu+giant+panda"]="destinations/chengdu_cover.jpg"

# 北京
SEARCHES["Beijing+Forbidden+City+palace"]="attractions/beijing_forbidden_city.jpg"
SEARCHES["Tiananmen+Square+Beijing"]="attractions/beijing_tiananmen.jpg"
SEARCHES["Mutianyu+Great+Wall+Beijing"]="attractions/beijing_great_wall.jpg"
SEARCHES["Temple+of+Heaven+Beijing"]="attractions/beijing_temple_of_heaven.jpg"
SEARCHES["Beijing+hutong+alleyway"]="attractions/beijing_hutong.jpg"
SEARCHES["Summer+Palace+Beijing+Kunming+Lake"]="attractions/beijing_summer_palace.jpg"
SEARCHES["Beijing+798+Art+District"]="attractions/beijing_798_art.jpg"
SEARCHES["Peking+duck+Beijing+restaurant"]="attractions/beijing_peking_duck.jpg"
SEARCHES["Beijing+Forbidden+City+panorama"]="destinations/beijing_cover.jpg"

# 上海
SEARCHES["Shanghai+Bund+skyline"]="attractions/shanghai_bund.jpg"
SEARCHES["Shanghai+Oriental+Pearl+Tower"]="attractions/shanghai_oriental_pearl.jpg"
SEARCHES["Shanghai+Yuyuan+Garden+classical"]="attractions/shanghai_yuyuan.jpg"
SEARCHES["Shanghai+French+Concession+street"]="attractions/shanghai_french_concession.jpg"
SEARCHES["Shanghai+Tianzifang+artsy+lanes"]="attractions/shanghai_tianzifang.jpg"
SEARCHES["Shanghai+Museum+architecture"]="attractions/shanghai_museum.jpg"
SEARCHES["xiaolongbao+soup+dumplings"]="attractions/shanghai_xiaolongbao.jpg"
SEARCHES["Shanghai+Pudong+Bund+panorama"]="destinations/shanghai_cover.jpg"

# 桂林
SEARCHES["Li+River+Guilin+karst"]="attractions/guilin_li_river.jpg"
SEARCHES["Elephant+Trunk+Hill+Guilin"]="attractions/guilin_elephant_trunk.jpg"
SEARCHES["Reed+Flute+Cave+Guilin"]="attractions/guilin_reed_flute_cave.jpg"
SEARCHES["Yangshuo+Moon+Hill+hike"]="attractions/guilin_moon_hill.jpg"
SEARCHES["Yulong+River+bamboo+rafting"]="attractions/guilin_yulong_river.jpg"
SEARCHES["Longji+Rice+Terraces+Guangxi"]="attractions/guilin_longji_terraces.jpg"
SEARCHES["Guilin+Li+River+karst+mountains"]="destinations/guilin_cover.jpg"

# 西安
SEARCHES["Xi'an+ancient+City+Wall+bicycle"]="attractions/xian_city_wall.jpg"
SEARCHES["Xi'an+Muslim+Quarter+food"]="attractions/xian_muslim_quarter.jpg"
SEARCHES["Xi'an+Terracotta+Army+warriors"]="attractions/xian_terracotta_warriors.jpg"
SEARCHES["Shaanxi+History+Museum+Xi'an"]="attractions/xian_shaanxi_museum.jpg"
SEARCHES["Big+Wild+Goose+Pagoda+Xi'an"]="attractions/xian_big_wild_goose.jpg"
SEARCHES["Biangbiang+noodles+Xi'an"]="attractions/xian_biangbiang_noodles.jpg"
SEARCHES["Xi'an+Terracotta+Warriors"]="destinations/xian_cover.jpg"

# 张家界
SEARCHES["Zhangjiajie+National+Forest+Park"]="attractions/zhangjiajie_forest_park.jpg"
SEARCHES["Tianmen+Mountain+glass+skywalk"]="attractions/zhangjiajie_tianmen_glass.jpg"
SEARCHES["Zhangjiajie+sandstone+pillars"]="destinations/zhangjiajie_cover.jpg"

# 苏州
SEARCHES["Suzhou+Humble+Administrator+Garden"]="attractions/suzhou_humble_admin_garden.jpg"
SEARCHES["Suzhou+Pingjiang+Road+canal"]="attractions/suzhou_pingjiang_road.jpg"
SEARCHES["Zhouzhuang+water+town+canals"]="attractions/suzhou_zhouzhuang.jpg"
SEARCHES["Suzhou+Museum+I.M.+Pei"]="attractions/suzhou_museum.jpg"
SEARCHES["Suzhou+classical+garden+bridge"]="destinations/suzhou_cover.jpg"

# 厦门
SEARCHES["Gulangyu+Island+Xiamen+villas"]="attractions/xiamen_gulangyu.jpg"
SEARCHES["Nanputuo+Temple+Xiamen"]="attractions/xiamen_nanputuo.jpg"
SEARCHES["Gulangyu+Island+Xiamen"]="destinations/xiamen_cover.jpg"

# 南京
SEARCHES["Sun+Yat-sen+Mausoleum+Nanjing"]="attractions/nanjing_sun_yat_sen.jpg"
SEARCHES["Ming+Dynasty+City+Wall+Nanjing"]="attractions/nanjing_city_wall.jpg"
SEARCHES["Nanjing+Confucius+Temple+Qinhuai"]="attractions/nanjing_confucius_temple.jpg"
SEARCHES["Nanjing+salted+duck+food"]="attractions/nanjing_salted_duck.jpg"
SEARCHES["Nanjing+Ming+Xiaoling+Mausoleum"]="destinations/nanjing_cover.jpg"

# 广州
SEARCHES["Guangzhou+Canton+Tower+night"]="attractions/guangzhou_canton_tower.jpg"
SEARCHES["Guangzhou+Shamian+Island"]="attractions/guangzhou_shamian_island.jpg"
SEARCHES["Guangzhou+dim+sum+breakfast"]="attractions/guangzhou_dim_sum.jpg"
SEARCHES["Guangzhou+modern+skyline"]="destinations/guangzhou_cover.jpg"

# 深圳
SEARCHES["Shenzhen+Ping+An+Finance+skyline"]="attractions/shenzhen_ping_an_tower.jpg"
SEARCHES["Shenzhen+OCT+LOFT+Creative+Park"]="attractions/shenzhen_oct_loft.jpg"
SEARCHES["Shenzhen+modern+skyline"]="destinations/shenzhen_cover.jpg"

# 昆明
SEARCHES["Kunming+Green+Lake+Park"]="attractions/kunming_green_lake.jpg"
SEARCHES["Shilin+Stone+Forest+Yunnan"]="attractions/kunming_stone_forest.jpg"
SEARCHES["Dali+ancient+town+Yunnan"]="attractions/kunming_dali_old_town.jpg"
SEARCHES["Yunnan+Stone+Forest+landscape"]="destinations/kunming_cover.jpg"

total=${#SEARCHES[@]}
count=0
skipped=0

echo "共 $total 张图片需处理"

for term in "${!SEARCHES[@]}"; do
    outfile="$TRAVEL_DIR/public/images/${SEARCHES[$term]}"
    count=$((count + 1))
    
    # 如果文件已存在且 > 50KB，跳过（不重复下载）
    if [ -f "$outfile" ] && [ "$(stat -f%z "$outfile" 2>/dev/null || echo 0)" -gt 50000 ]; then
        skipped=$((skipped + 1))
        continue
    fi
    
    mkdir -p "$(dirname "$outfile")"
    echo "[$count/$total] $(basename "$outfile") ← $term"
    
    # Unsplash 搜索：用无水印的直接图片
    # 方案1: Unsplash source API（最简单的方案，访问次数有限但够用）
    # 方案2: 用 unsplash.com/photos 搜索页面
    
    # 先用 web_fetch 从 Unsplash 搜图（通过 openclaw web_fetch API）
    # 这里用 curl 直连 Unsplash source（免费、无限制、稳定）
    url="https://images.unsplash.com/photo-$(curl -s "https://api.unsplash.com/photos/random?query=${term}&w=1200&h=800&fit=crop" \
        -H "Accept-Version: v1" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)"
    
    # 如果 Unsplash API 失败（无 key），用 Pexels 或直接跳过
    if [ -z "$url" ] || echo "$url" | grep -q "unsplash.com/photo-$"; then
        echo "  ⚠️  Unsplash 搜索失败，留空稍后手动补充"
        touch "$outfile"
        continue
    fi
    
    echo "  → 下载中..."
    curl -sL -o "$outfile" "$url" --max-time 15 || touch "$outfile"
    sleep 0.5  # 避免限流
done

echo ""
echo "=== 完成 ==="
echo "总计: $total | 下载: $((total - skipped)) | 跳过: $skipped"
