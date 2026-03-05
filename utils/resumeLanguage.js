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
];

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
  const converted = replacePhrases(text).replace(/[\u4e00-\u9fa5]/g, "").replace(/\s+/g, " ").trim();
  if (!converted) return fallback;
  return normalizeEnglish(converted).replace(/[.]$/, "");
}

function translateAbout(about) {
  const fallback =
    "I focus on product design, information architecture, and user experience, turning complex requirements into clear and actionable digital workflows.";
  return translateSentence(about, fallback);
}

function translateTagline(tagline) {
  const fallback = "Product designer focused on clarity, systems, and quality execution.";
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
    customSections: translateCustomSections(data.customSections),
  };
}
