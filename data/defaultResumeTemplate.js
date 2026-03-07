const TEMPLATE_VERSION = "lina-singer-20260307";
const MEDIA_BASE = "/weidong";
export const defaultPublishedSlug = "lina-live";

const mediaItem = (name) => ({
  type: "image",
  name,
  url: `${MEDIA_BASE}/${name}`,
});

export const defaultResumeTemplate = {
  __templateVersion: TEMPLATE_VERSION,
  name: "LINA",
  tagline: "独立唱作歌手，擅长电子流行、情绪叙事与现场舞台表达。",
  about:
    "LINA 是一名独立唱作歌手，作品游走在电子流行与抒情舞曲之间。她用电影感的歌词、克制的声线和层层推进的节奏去写夜色、海风、告别与重新出发。过去两年，她持续打磨单曲、舞台编排与视觉内容，希望把每一次演出都变成完整而有呼吸感的现场体验。",
  experiences:
    "2025 - 至今 | 独立唱作歌手 | LINA Studio | 持续发布单曲与现场影像，完成小型剧场演出、短视频 live session 与视觉企划。\n2024 - 2025 | 驻场主唱 | Blue Hour Live House | 以电子流行与抒情翻唱为核心曲目，建立稳定舞台风格与观众记忆点。\n2023 - 2024 | 词曲创作 / Demo 制作 | Midnight Room | 完成首张个人 EP 的词曲写作、编曲沟通与录音统筹。",
  skills:
    "唱作, 现场演出, 录音, 和声编写, 舞台编排, 视觉概念, 短视频 live session, 乐队排练, 情绪叙事, 电子流行",
  awards:
    "2025 | 巡演主视觉 Banner | Summer Blue Live Set | 用轮播图片展示现场海报、排练片段与舞台氛围。\n2024 | 单曲发行 Banner | Midnight Echo | 聚合单曲封面、幕后花絮与社交传播视觉。\n2024 | 媒体采访 Banner | City Pop Weekly | 展示人物照片、演出抓拍与主题视觉素材。",
  projects:
    "Midnight Echo | 电子流行单曲，围绕夜晚、告别与重新出发展开。\nBlue Hour Live Session | 以 live session 形式重组代表作品，强化现场呼吸感与镜头叙事。\nSea Fog EP | 三首歌组成的概念 EP，把海风、失眠与情绪回响写进合成器与鼓点里。\nAfterglow Stage Film | 结合舞台排练、动作设计与影像剪辑的短片式演出企划。",
  projectItems: [
    {
      period: "2025",
      title: "Midnight Echo",
      subtitle: "Single · Electro-pop",
      summary:
        "主打单曲围绕夜色、告别与重新出发展开，用轻电子与抒情旋律构建深夜氛围。",
      details:
        "《Midnight Echo》是当前阶段的代表作品，编曲上用呼吸感更强的节奏、逐层推进的合成器与留白感的人声段落，去表达夜晚里迟迟没有说出口的话。",
      media: mediaItem("eco.gif"),
    },
    {
      period: "2025",
      title: "Blue Hour Live Session",
      subtitle: "Live Session · Visual Performance",
      summary:
        "以 live session 的方式重组代表作品，把排练室、现场收音和镜头运动统一到一套情绪节奏里。",
      details:
        "这一组内容更强调现场呼吸感与人与空间的距离感：不是追求大而满的表演，而是在更克制的编排里，让人声、乐手和画面都留下足够的情绪余韵。",
      media: mediaItem("lift_real_train.gif"),
    },
    {
      period: "2024",
      title: "Sea Fog EP",
      subtitle: "EP · Night Stories",
      summary:
        "三首歌组成的概念 EP，把海风、失眠、回望与重启写进合成器、鼓点和低饱和色彩里。",
      details:
        "《Sea Fog》像一段完整的夜间旅程：从第一首歌的轻微不安，到第二首歌的自我对话，再到最后一首歌的重新出发，整张 EP 更像一场带有电影镜头感的城市漫游。",
      media: mediaItem("metadrive_wide.gif"),
    },
    {
      period: "2024",
      title: "Afterglow Stage Film",
      subtitle: "Stage Film · Motion Visual",
      summary:
        "把排练、动作设计、镜头语言与舞台灯光整合成一支短片式演出企划。",
      details:
        "这组视觉内容延续了 LINA 目前的舞台气质：安静、冷感、克制，但又保留足够明显的情绪起伏。它既是演出片段，也能作为单曲传播和社交平台内容的延展母体。",
      media: mediaItem("wm_survey.png"),
    },
  ],
  profilePosition: "独立唱作歌手 / Live Performer",
  profileEmail: "booking@lina-music.com",
  profileCustom1Title: "风格",
  profileCustom1Value: "电子流行、抒情舞曲、夜色叙事",
  profileCustom2Title: "演出",
  profileCustom2Value: "剧场专场、live house、品牌活动与影像化现场",
  profileCustom3Title: "合作",
  profileCustom3Value: "演出邀约、合作写歌、品牌联动与视觉企划",
  interactionAudio: null,
  aboutMedia: mediaItem("me.png"),
  mediaItems: [
    mediaItem("lift_real_train.gif"),
    mediaItem("eco.gif"),
    mediaItem("metadrive_wide.gif"),
    mediaItem("wm_survey.png"),
    mediaItem("diff_rl.png"),
    mediaItem("citations.jpeg"),
  ],
  customSections: [
    {
      title: "Live Visual Notes",
      content:
        "这里收录近阶段的艺人照片、live session 截图与舞台视觉，方便作为媒体包、演出海报和社交平台内容使用。",
      mediaItems: [
        mediaItem("wm_survey.png"),
        mediaItem("diff_rl.png"),
        mediaItem("bdtalks.png"),
        mediaItem("citations.jpeg"),
      ],
    },
    {
      title: "Moodboard",
      content:
        "从排练室、海边、公路与冷暖光影提炼视觉气质，持续延展 LINA 的现场美学与内容封面语言。",
      mediaItems: [],
    },
  ],
};

export const defaultResumeTemplateVersion = TEMPLATE_VERSION;

function cloneItem(value) {
  return value ? JSON.parse(JSON.stringify(value)) : value;
}

export function buildTemplateDraft(saved) {
  const base = cloneDefaultResumeTemplate();
  if (!saved || typeof saved !== "object") return base;

  if (saved.aboutMedia?.url) {
    base.aboutMedia = cloneItem(saved.aboutMedia);
  }

  if (Array.isArray(saved.mediaItems) && saved.mediaItems.length > 0) {
    base.mediaItems = saved.mediaItems.map((item) => cloneItem(item)).filter(Boolean);
  }

  if (saved.interactionAudio?.url) {
    base.interactionAudio = cloneItem(saved.interactionAudio);
  }

  if (Array.isArray(saved.projectItems) && saved.projectItems.length > 0) {
    base.projectItems = base.projectItems.map((item, index) => {
      const preservedMedia = saved.projectItems[index]?.media;
      return preservedMedia?.url ? { ...item, media: cloneItem(preservedMedia) } : item;
    });
  }

  if (Array.isArray(saved.customSections) && saved.customSections.length > 0) {
    base.customSections = base.customSections.map((section, index) => {
      const preservedMedia = saved.customSections[index]?.mediaItems;
      return Array.isArray(preservedMedia) && preservedMedia.length > 0
        ? { ...section, mediaItems: preservedMedia.map((item) => cloneItem(item)).filter(Boolean) }
        : section;
    });
  }

  return base;
}

function hasLegacyPlaceholderProjects(projectItems = []) {
  if (!Array.isArray(projectItems)) return false;
  const titles = projectItems.map((item) => String(item?.title || "").trim());
  return titles.includes("MotionCV Web") || titles.includes("Portfolio System");
}

export function shouldSeedImportedTemplate(saved) {
  if (!saved || typeof saved !== "object") return true;
  if (saved.__templateVersion === TEMPLATE_VERSION) return false;

  const name = String(saved.name || "").trim();
  const email = String(saved.profileEmail || saved.email || "").trim();
  const about = String(saved.about || "").trim();
  const experiences = String(saved.experiences || "").trim();
  const isEmpty = !name && !email && !about && !experiences;
  const isLegacyPlaceholder =
    name === "张晨" ||
    email === "hello@motioncv.design" ||
    about.includes("我专注于复杂产品的信息架构与体验优化") ||
    hasLegacyPlaceholderProjects(saved.projectItems);

  return isEmpty || isLegacyPlaceholder;
}

export function cloneDefaultResumeTemplate() {
  return JSON.parse(JSON.stringify(defaultResumeTemplate));
}
