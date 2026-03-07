import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import HomeHero from "../components/hero3d/HomeHero";
import ResumeWebsite from "../components/ResumeWebsite";
import {
  buildTemplateDraft,
  cloneDefaultResumeTemplate,
  defaultResumeTemplateVersion,
  shouldSeedImportedTemplate,
} from "../data/defaultResumeTemplate";
import LanguageToggle from "../components/LanguageToggle";
import { getResumeInLanguage } from "../utils/resumeLanguage";

const DRAFT_KEY = "motioncv:editor:draft";
const TEMPLATE_VERSION_KEY = "motioncv:editor:template-version";
const starter = cloneDefaultResumeTemplate();

function getInitialDraft() {
  if (typeof window === "undefined") return starter;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    const savedVersion = window.localStorage.getItem(TEMPLATE_VERSION_KEY);
    if (savedVersion !== defaultResumeTemplateVersion) {
      const imported = buildTemplateDraft(saved);
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(imported));
      window.localStorage.setItem(TEMPLATE_VERSION_KEY, defaultResumeTemplateVersion);
      return imported;
    }
    if (!raw) return starter;
    if (!saved || typeof saved !== "object") return starter;
    if (shouldSeedImportedTemplate(saved)) return cloneDefaultResumeTemplate();
    return { ...cloneDefaultResumeTemplate(), ...saved };
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

      <HomeHero interactionAudio={displayData.interactionAudio || null} />
      <ResumeWebsite data={displayData} lang={lang} heroFullscreen hideTopHeader />
    </>
  );
}
