import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import HomeHero from "../components/hero3d/HomeHero";
import ResumeWebsite from "../components/ResumeWebsite";
import LanguageToggle from "../components/LanguageToggle";
import { getResumeInLanguage } from "../utils/resumeLanguage";

const DRAFT_KEY = "motioncv:editor:draft";

const starter = {
  name: "张晨",
  tagline: "Product Designer focused on clarity and systems.",
  about: "我专注于复杂产品的信息架构与体验优化，擅长将抽象需求转化为清晰可执行的界面与流程。",
  experiences:
    "2022-Now | Lead Product Designer | Atelier Labs | 负责设计系统重构与跨团队协作机制建设\\n2019-2022 | Senior Product Designer | Northbound Studio | 主导核心流程改版并提升关键路径转化",
  skills: "Figma, Design System, UX Strategy, Prototyping",
  awards:
    "2024 | Red Dot Award | MotionCV | 荣获设计类国际奖项\\n2023 | Best Product Innovation | Atelier Labs | 年度最佳创新项目",
  projects:
    "MotionCV Web | 在线简历生成器，支持模块化编辑与发布\\nPortfolio System | 统一作品展示组件库，减少重复开发成本",
  projectItems: [
    {
      period: "2024",
      title: "MotionCV Web",
      subtitle: "Resume Website Builder",
      summary: "在线简历生成器，支持模块化编辑与发布。",
      details: "构建了从表单输入、实时预览到一键发布的完整流程，支持中英切换、媒体上传与分享链接。",
      media: null,
    },
    {
      period: "2023",
      title: "Portfolio System",
      subtitle: "Design Platform",
      summary: "统一作品展示组件库，减少重复开发成本。",
      details: "沉淀可复用卡片与内容模板，显著提升项目展示效率和视觉一致性。",
      media: null,
    },
  ],
  profilePosition: "电商设计",
  profileEmail: "hello@motioncv.design",
  profileCustom1Title: "",
  profileCustom1Value: "",
  profileCustom2Title: "",
  profileCustom2Value: "",
  profileCustom3Title: "",
  profileCustom3Value: "",
  aboutMedia: null,
  mediaItems: [],
  customSections: [],
};

function getInitialDraft() {
  if (typeof window === "undefined") return starter;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return starter;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return starter;
    return { ...starter, ...saved };
  } catch {
    return starter;
  }
}

export default function Home() {
  const [lang, setLang] = useState("zh");
  const [resumeData, setResumeData] = useState(starter);

  useEffect(() => {
    queueMicrotask(() => {
      setResumeData(getInitialDraft());
    });
  }, []);

  const displayData = getResumeInLanguage(resumeData, lang);

  return (
    <>
      <Head>
        <title>MotionCV</title>
        <meta name="description" content="MotionCV high-fidelity 3D hero homepage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="fixed right-4 top-4 z-[80] flex items-center gap-3 md:right-6 md:top-6">
        <LanguageToggle lang={lang} onChange={setLang} />
        <Link href="/editor" className="share-editor-btn rounded-full border px-4 py-2 text-xs text-[var(--muted)] transition hover:text-[var(--text)]">
          返回编辑器
        </Link>
      </div>

      <HomeHero />
      <ResumeWebsite data={displayData} lang={lang} heroFullscreen hideTopHeader />
    </>
  );
}
