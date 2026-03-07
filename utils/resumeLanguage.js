const phraseMap = [
  ["产品设计师", "product designer"],
  ["设计系统", "design system"],
  ["用户体验", "user experience"],
  ["信息架构", "information architecture"],
  ["交互", "interaction"],
  ["跨团队协作", "cross-functional collaboration"],
  ["优化", "optimize"],
  ["重构", "rebuild"],
  ["负责", "responsible for"],
  ["主导", "led"],
  ["提升", "improved"],
  ["在线简历生成器", "online resume generator"],
  ["模块化编辑与发布", "modular editing and publishing"],
  ["统一作品展示组件库", "a unified portfolio component library"],
  ["减少重复开发成本", "reducing repetitive development effort"],
  ["我专注于", "I focus on"],
  ["擅长", "and I am skilled at"],
  ["将抽象需求转化为", "turning abstract requirements into"],
  ["清晰可执行的", "clear and actionable"],
  ["流程", "workflows"],
  ["页面", "pages"],
  ["高级产品设计师", "senior product designer"],
  ["产品设计师", "product designer"],
  ["交互设计师", "interaction designer"],
  ["设计负责人", "design lead"],
  ["资深", "senior"],
  ["负责人", "lead"],
  ["独立唱作歌手", "indie singer-songwriter"],
  ["电子流行", "electro-pop"],
  ["情绪叙事", "emotional storytelling"],
  ["现场舞台表达", "live stage performance"],
  ["作品游走在", "whose work moves between"],
  ["抒情舞曲", "melodic dance-pop"],
  ["电影感的歌词", "cinematic lyrics"],
  ["克制的声线", "restrained vocals"],
  ["层层推进的节奏", "gradually unfolding rhythms"],
  ["夜色", "nighttime"],
  ["海风", "sea breeze"],
  ["告别", "farewells"],
  ["重新出发", "new beginnings"],
  ["持续打磨", "continually shaping"],
  ["单曲", "singles"],
  ["舞台编排", "stage direction"],
  ["视觉内容", "visual content"],
  ["完整而有呼吸感的现场体验", "a complete, breathing live experience"],
  ["驻场主唱", "resident vocalist"],
  ["词曲创作", "songwriting"],
  ["Demo 制作", "demo production"],
  ["抒情翻唱", "emotive covers"],
  ["核心曲目", "core setlist"],
  ["建立稳定舞台风格与观众记忆点", "built a recognizable stage identity"],
  ["完成首张个人 EP 的词曲写作、编曲沟通与录音统筹", "completed songwriting, arrangement coordination, and recording for the debut EP"],
  ["唱作", "songwriting"],
  ["现场演出", "live performance"],
  ["录音", "recording"],
  ["和声编写", "vocal arrangement"],
  ["视觉概念", "visual concept"],
  ["乐队排练", "band rehearsal"],
  ["巡演主视觉 Banner", "tour banner"],
  ["单曲发行 Banner", "single release banner"],
  ["媒体采访 Banner", "press banner"],
  ["用轮播图片展示现场海报、排练片段与舞台氛围", "showcases live posters, rehearsal moments, and stage atmosphere through the carousel"],
  ["聚合单曲封面、幕后花絮与社交传播视觉", "gathers single covers, behind-the-scenes moments, and campaign visuals"],
  ["展示人物照片、演出抓拍与主题视觉素材", "features artist portraits, live stills, and theme visuals"],
  ["围绕夜晚、告别与重新出发展开", "built around night, farewells, and new beginnings"],
  ["以 live session 形式重组代表作品，强化现场呼吸感与镜头叙事", "reimagines signature songs as live sessions with stronger live dynamics and camera storytelling"],
  ["三首歌组成的概念 EP，把海风、失眠与情绪回响写进合成器与鼓点里", "a three-track concept EP writing sea breeze, sleeplessness, and emotional echoes into synths and drums"],
  ["结合舞台排练、动作设计与影像剪辑的短片式演出企划", "a short-film style performance concept combining rehearsal, movement design, and editing"],
  ["风格", "style"],
  ["演出", "shows"],
  ["合作", "contact"],
  ["电子流行、抒情舞曲、夜色叙事", "electro-pop, melodic dance-pop, nocturnal storytelling"],
  ["剧场专场、live house、品牌活动与影像化现场", "theater sets, live houses, brand stages, and filmed live shows"],
  ["演出邀约、合作写歌、品牌联动与视觉企划", "booking, co-writing, brand collaborations, and visual direction"],
  ["这里收录近阶段的艺人照片、live session 截图与舞台视觉，方便作为媒体包、演出海报和社交平台内容使用", "collects recent artist portraits, live session stills, and stage visuals for press kits, posters, and social content"],
  ["从排练室、海边、公路与冷暖光影提炼视觉气质，持续延展 LINA 的现场美学与内容封面语言", "distills visuals from rehearsal rooms, coastlines, highways, and shifting light to extend LINA's live aesthetic and cover language"],
];

const exactLabelMap = {
  独立唱作歌手: "Indie Singer-Songwriter",
  风格: "Style",
  演出: "Shows",
  合作: "Contact",
  唱作: "Songwriting",
  现场演出: "Live Performance",
  录音: "Recording",
  和声编写: "Vocal Arrangement",
  舞台编排: "Stage Direction",
  视觉概念: "Visual Concept",
  "短视频 live session": "Live Session Production",
  乐队排练: "Band Rehearsal",
  情绪叙事: "Emotional Storytelling",
  电子流行: "Electro-pop",
  "巡演主视觉 Banner": "Tour Banner Visuals",
  "单曲发行 Banner": "Single Release Banner",
  "媒体采访 Banner": "Press Feature Banner",
};

const exactSentenceMap = {
  "独立唱作歌手，擅长电子流行、情绪叙事与现场舞台表达。":
    "Indie singer-songwriter focused on electro-pop, emotional storytelling, and immersive live stage performance.",
  "LINA 是一名独立唱作歌手，作品游走在电子流行与抒情舞曲之间。她用电影感的歌词、克制的声线和层层推进的节奏去写夜色、海风、告别与重新出发。过去两年，她持续打磨单曲、舞台编排与视觉内容，希望把每一次演出都变成完整而有呼吸感的现场体验。":
    "LINA is an indie singer-songwriter whose work moves between electro-pop and melodic dance-pop. She writes about night drives, sea breeze, farewells, and new beginnings through cinematic lyrics, restrained vocals, and gradually unfolding rhythms. Over the past two years, she has been shaping singles, stage direction, and visual content to make every performance feel intimate, atmospheric, and complete.",
  "持续发布单曲与现场影像，完成小型剧场演出、短视频 live session 与视觉企划。":
    "Releasing original singles and live visuals while producing small-theater performances, short-form live sessions, and visual concepts.",
  "以电子流行与抒情翻唱为核心曲目，建立稳定舞台风格与观众记忆点。":
    "Performed electro-pop originals and emotive cover sets while building a recognizable stage identity and audience connection.",
  "完成首张个人 EP 的词曲写作、编曲沟通与录音统筹。":
    "Completed songwriting, arrangement coordination, and recording direction for a debut EP project.",
  "用轮播图片展示现场海报、排练片段与舞台氛围。":
    "A banner series featuring live posters, rehearsal moments, and stage atmosphere.",
  "聚合单曲封面、幕后花絮与社交传播视觉。":
    "A visual rollout combining cover art, behind-the-scenes moments, and campaign imagery.",
  "展示人物照片、演出抓拍与主题视觉素材。":
    "A curated banner set built from portraits, live stills, and editorial visuals.",
  "电子流行单曲，围绕夜晚、告别与重新出发展开。":
    "A lead electro-pop single built around nightfall, farewells, and new beginnings.",
  "以 live session 形式重组代表作品，强化现场呼吸感与镜头叙事。":
    "A live-session reinterpretation of signature songs with stronger breathing room and camera storytelling.",
  "三首歌组成的概念 EP，把海风、失眠与情绪回响写进合成器与鼓点里。":
    "A three-track concept EP turning sea breeze, insomnia, and emotional echoes into synths and drums.",
  "结合舞台排练、动作设计与影像剪辑的短片式演出企划。":
    "A short-film style performance concept combining rehearsal, movement design, and visual editing.",
  "主打单曲围绕夜色、告别与重新出发展开，用轻电子与抒情旋律构建深夜氛围。":
    "A lead single about nightfall, farewells, and new beginnings, built with soft electronics and a cinematic emotional arc.",
  "《Midnight Echo》是当前阶段的代表作品，编曲上用呼吸感更强的节奏、逐层推进的合成器与留白感的人声段落，去表达夜晚里迟迟没有说出口的话。":
    "Midnight Echo is the anchor release of this phase. It pairs breathing room in the arrangement with gradually rising synth layers and intimate vocal phrasing, creating the feeling of a conversation that almost happened but stayed in the air.",
  "以 live session 的方式重组代表作品，把排练室、现场收音和镜头运动统一到一套情绪节奏里。":
    "A live-session reinterpretation of signature songs, designed to preserve breath, distance, and emotional timing on camera.",
  "这一组内容更强调现场呼吸感与人与空间的距离感：不是追求大而满的表演，而是在更克制的编排里，让人声、乐手和画面都留下足够的情绪余韵。":
    "This session focuses on atmosphere rather than excess. The arrangement, room sound, and camera movement all work together so the performance feels close, spacious, and emotionally deliberate instead of overstated.",
  "三首歌组成的概念 EP，把海风、失眠、回望与重启写进合成器、鼓点和低饱和色彩里。":
    "A three-track concept EP that transforms sea breeze, insomnia, reflection, and quiet restart into synth textures, restrained rhythm, and muted color.",
  "《Sea Fog》像一段完整的夜间旅程：从第一首歌的轻微不安，到第二首歌的自我对话，再到最后一首歌的重新出发，整张 EP 更像一场带有电影镜头感的城市漫游。":
    "Sea Fog unfolds like a complete night journey: the first track carries subtle unease, the second becomes an inward conversation, and the final song opens toward a quieter restart. The EP feels more like a cinematic city drift than a conventional playlist.",
  "把排练、动作设计、镜头语言与舞台灯光整合成一支短片式演出企划。":
    "A short-film performance concept combining rehearsal footage, movement design, camera language, and stage lighting.",
  "这组视觉内容延续了 LINA 目前的舞台气质：安静、冷感、克制，但又保留足够明显的情绪起伏。它既是演出片段，也能作为单曲传播和社交平台内容的延展母体。":
    "This visual project extends LINA's current stage language: quiet, cool, and restrained, yet still charged with visible emotional movement. It works both as performance footage and as a source layer for single promotion and social content.",
  "电子流行、抒情舞曲、夜色叙事":
    "Electro-pop, melodic dance-pop, and nocturnal storytelling",
  "剧场专场、live house、品牌活动与影像化现场":
    "Theater sets, live houses, brand events, and filmed live performances",
  "演出邀约、合作写歌、品牌联动与视觉企划":
    "Booking, co-writing, brand collaborations, and visual direction",
  "这里收录近阶段的艺人照片、live session 截图与舞台视觉，方便作为媒体包、演出海报和社交平台内容使用。":
    "A curated collection of recent artist portraits, live session stills, and stage visuals prepared for press kits, posters, and social storytelling.",
  "从排练室、海边、公路与冷暖光影提炼视觉气质，持续延展 LINA 的现场美学与内容封面语言。":
    "Visual references drawn from rehearsal rooms, coastlines, highways, and shifting cool-to-warm light, continuing the atmosphere of LINA's stage and cover language.",
};

const nameMap = {
  张: "Zhang",
  王: "Wang",
  李: "Li",
  刘: "Liu",
  陈: "Chen",
  杨: "Yang",
  黄: "Huang",
  赵: "Zhao",
  吴: "Wu",
  周: "Zhou",
  徐: "Xu",
  孙: "Sun",
  马: "Ma",
  朱: "Zhu",
  胡: "Hu",
  郭: "Guo",
  何: "He",
  林: "Lin",
  高: "Gao",
  罗: "Luo",
  郑: "Zheng",
  梁: "Liang",
  谢: "Xie",
  宋: "Song",
  唐: "Tang",
  许: "Xu",
  邓: "Deng",
  冯: "Feng",
  曹: "Cao",
  彭: "Peng",
  曾: "Zeng",
  肖: "Xiao",
  田: "Tian",
  董: "Dong",
  袁: "Yuan",
  潘: "Pan",
  于: "Yu",
  余: "Yu",
  叶: "Ye",
  蒋: "Jiang",
  杜: "Du",
  苏: "Su",
  魏: "Wei",
  程: "Cheng",
  吕: "Lv",
  丁: "Ding",
  任: "Ren",
  姚: "Yao",
  卢: "Lu",
  傅: "Fu",
  沈: "Shen",
  钟: "Zhong",
  姜: "Jiang",
  崔: "Cui",
  谭: "Tan",
  廖: "Liao",
  范: "Fan",
  汪: "Wang",
  陆: "Lu",
  金: "Jin",
  石: "Shi",
  夏: "Xia",
  韦: "Wei",
  贾: "Jia",
  邹: "Zou",
  熊: "Xiong",
  白: "Bai",
  孟: "Meng",
  秦: "Qin",
  邱: "Qiu",
  侯: "Hou",
  江: "Jiang",
  尹: "Yin",
  薛: "Xue",
  闫: "Yan",
  段: "Duan",
  雷: "Lei",
  黎: "Li",
  史: "Shi",
  龙: "Long",
  陶: "Tao",
  贺: "He",
  顾: "Gu",
  毛: "Mao",
  郝: "Hao",
  龚: "Gong",
  邵: "Shao",
  万: "Wan",
  钱: "Qian",
  严: "Yan",
  赖: "Lai",
  覃: "Qin",
  晨: "Chen",
  伟: "Wei",
  强: "Qiang",
  婷: "Ting",
  佳: "Jia",
  明: "Ming",
  静: "Jing",
  杰: "Jie",
  磊: "Lei",
  洋: "Yang",
  勇: "Yong",
  艳: "Yan",
};

function hasChinese(text = "") {
  return /[\u4e00-\u9fa5]/.test(text);
}

function normalizeEnglish(text = "") {
  const trimmed = text
    .replace(/\s+/g, " ")
    .replace(/\s([,.;:!?])/g, "$1")
    .trim();

  if (!trimmed) return "";
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

function replacePhrases(text = "") {
  return phraseMap.reduce((acc, [zh, en]) => acc.split(zh).join(en), text);
}

function translateSentence(text = "", fallback = "") {
  if (!text) return fallback;
  if (!hasChinese(text)) return normalizeEnglish(text);

  const exact = exactSentenceMap[text.trim()];
  if (exact) return exact;

  const replaced = replacePhrases(
    text
      .replace(/，/g, ", ")
      .replace(/。/g, ". ")
      .replace(/；/g, "; ")
      .replace(/：/g, ": ")
  );

  const sanitized = replaced.replace(/[\u4e00-\u9fa5]/g, "").replace(/\s+/g, " ").trim();
  if (!sanitized) return fallback;
  return normalizeEnglish(sanitized);
}

function transliterateName(name = "") {
  if (!name) return "Your Name";
  if (!hasChinese(name)) return name;
  const converted = name
    .split("")
    .map((ch) => nameMap[ch] || "")
    .filter(Boolean)
    .join(" ");
  return converted || "Your Name";
}

function translateShortLabel(text = "", fallback = "") {
  if (!text) return fallback;
  if (!hasChinese(text)) return normalizeEnglish(text).replace(/[.]$/, "");
  const exact = exactLabelMap[text.trim()] || exactSentenceMap[text.trim()];
  if (exact) return normalizeEnglish(exact).replace(/[.]$/, "");
  const converted = replacePhrases(text).replace(/[\u4e00-\u9fa5]/g, "").replace(/\s+/g, " ").trim();
  if (!converted) return fallback;
  return normalizeEnglish(converted).replace(/[.]$/, "");
}

function translateAbout(about) {
  const fallback =
    "An indie singer-songwriter shaping electro-pop songs, cinematic visuals, and immersive live moments.";
  return translateSentence(about, fallback);
}

function translateTagline(tagline) {
  const fallback = "Indie singer-songwriter focused on electro-pop, emotion, and live storytelling.";
  return translateSentence(tagline, fallback);
}

function translateExperiences(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [period = "", role = "", company = "", detail = ""] = line.split("|").map((v) => v.trim());
      const translatedDetail = translateSentence(
        detail,
        "Drove high-quality collaboration and delivered measurable product improvements."
      );
      return `${period} | ${translateShortLabel(role, "Role")} | ${translateShortLabel(company, "Company")} | ${translatedDetail}`;
    })
    .join("\n");
}

function translateProjects(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", detail = ""] = line.split("|").map((v) => v.trim());
      return `${translateShortLabel(name, "Project")} | ${translateSentence(
        detail,
        "Built and delivered a polished project with strong execution quality."
      )}`;
    })
    .join("\n");
}

function translateProjectItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    ...item,
    title: translateShortLabel(item.title || "", item.title || "Project"),
    subtitle: translateShortLabel(item.subtitle || "", item.subtitle || ""),
    summary: translateSentence(
      item.summary || "",
      "Built and delivered a polished project with strong execution quality."
    ),
    details: translateSentence(
      item.details || item.summary || "",
      "Built and delivered a polished project with strong execution quality."
    ),
    media: item.media || null,
  }));
}

function translateSkills(text = "") {
  return text
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => translateShortLabel(item, item))
    .join(", ");
}

function translateAwards(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [period = "", title = "", issuer = "", detail = ""] = line.split("|").map((v) => v.trim());
      return `${period} | ${translateShortLabel(title, "Award")} | ${translateShortLabel(
        issuer,
        "Organization"
      )} | ${translateSentence(detail, "Recognized for strong professional contribution.")}`;
    })
    .join("\n");
}

function translateCustomSections(sections = []) {
  if (!Array.isArray(sections)) return [];
  return sections.map((section) => ({
    ...section,
    title: translateShortLabel(section.title || "", section.title || ""),
    content: translateSentence(section.content || "", section.content || "").replace(/[.]$/, ""),
  }));
}

export function getResumeInLanguage(data, lang) {
  if (lang !== "en") return data;

  return {
    ...data,
    name: transliterateName(data.name),
    tagline: translateTagline(data.tagline),
    about: translateAbout(data.about),
    experiences: translateExperiences(data.experiences),
    skills: translateSkills(data.skills),
    awards: translateAwards(data.awards),
    projects: translateProjects(data.projects),
    projectItems: translateProjectItems(data.projectItems),
    profilePosition: translateShortLabel(data.profilePosition || "", data.profilePosition || ""),
    profileEmail: data.profileEmail || data.email || "",
    profileCustom1Title: translateShortLabel(data.profileCustom1Title || "", data.profileCustom1Title || ""),
    profileCustom1Value: translateSentence(data.profileCustom1Value || "", data.profileCustom1Value || "").replace(/[.]$/, ""),
    profileCustom2Title: translateShortLabel(data.profileCustom2Title || "", data.profileCustom2Title || ""),
    profileCustom2Value: translateSentence(data.profileCustom2Value || "", data.profileCustom2Value || "").replace(/[.]$/, ""),
    profileCustom3Title: translateShortLabel(data.profileCustom3Title || "", data.profileCustom3Title || ""),
    profileCustom3Value: translateSentence(data.profileCustom3Value || "", data.profileCustom3Value || "").replace(/[.]$/, ""),
    customSections: translateCustomSections(data.customSections),
  };
}
