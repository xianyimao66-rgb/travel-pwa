# 批量生成旅行景点图（用 baoyu-cover-image）
# 
# 策略：
# - 用 baoyu-cover-image 的 scene 类型生成真实场景图（不是抽象封面）
# - 每个活动独立配图，风格统一（warm palette + painterly render）
# - 先整个 prompt 模板，再批量跑
#
# 注意：baoyu-cover-image 第三步要 AI 生成 prompt 再出图
# 所以这里只输出 prompt 文件模板，实际生成需要每次确认
# 
# 确认方式：在对话中说 "生成成都的大熊猫图片" 等

# ── 使用示例 ──
# "帮我用 baoyu-cover-image 生成成都熊猫基地的实景图，场景写实风格，不要文字"
# → 妖怪自动 call baoyu-cover-image 出图
# → 保存到 public/images/attractions/chengdu_panda_base.jpg

# ── 首批需要生成的图片 ──
# 成都（11张）:
#   chengdu_panda_base.jpg          -> 成都大熊猫繁育研究基地 实景图
#   chengdu_jinli_street.jpg         -> 成都锦里古街 实景图
#   chengdu_hotpot.jpg               -> 四川火锅 特写图
#   chengdu_leshan_buddha.jpg        -> 乐山大佛 全景图
#   chengdu_face_changing_opera.jpg  -> 川剧变脸 表演图
#   chengdu_sichuan_cuisine.jpg      -> 川菜 菜品图
#   chengdu_kuanzhai_alley.jpg       -> 宽窄巷子 街景图
#   chengdu_teahouse.jpg             -> 成都茶馆 生活图
#   chengdu_qingcheng_mountain.jpg   -> 青城山 自然景观图
#   chengdu_dujiangyan.jpg           -> 都江堰水利工程
#   chengdu_sichuan_museum.jpg       -> 四川博物院
#
# 北京（8张）:
#   beijing_forbidden_city.jpg
#   beijing_tiananmen.jpg
#   beijing_great_wall.jpg
#   beijing_temple_of_heaven.jpg
#   beijing_hutong.jpg
#   beijing_summer_palace.jpg
#   beijing_798_art.jpg
#   beijing_peking_duck.jpg
#
# （总共约 80 张，全部城市 + 活动）
