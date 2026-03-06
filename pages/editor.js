import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import LanguageToggle from "../components/LanguageToggle";
import ResumeWebsite from "../components/ResumeWebsite";
import { saveResumeSnapshot, toSlug } from "../utils/shareResume";
import { getResumeInLanguage } from "../utils/resumeLanguage";

const starter = {
  name: "张晨",
  tagline: "Product Designer focused on clarity and systems.",
  about:
    "我专注于复杂产品的信息架构与体验优化，擅长将抽象需求转化为清晰可执行的界面与流程。",
  experiences:
    "2022-Now | Lead Product Designer | Atelier Labs | 负责设计系统重构与跨团队协作机制建设\n2019-2022 | Senior Product Designer | Northbound Studio | 主导核心流程改版并提升关键路径转化",
  skills: "Figma, Design System, UX Strategy, Prototyping",
  awards:
    "2024 | Red Dot Award | MotionCV | 荣获设计类国际奖项\n2023 | Best Product Innovation | Atelier Labs | 年度最佳创新项目",
  projects:
    "MotionCV Web | 在线简历生成器，支持模块化编辑与发布\nPortfolio System | 统一作品展示组件库，减少重复开发成本",
  projectItems: [
    {
      period: "2024",
      title: "MotionCV Web",
      subtitle: "Resume Website Builder",
      summary: "在线简历生成器，支持模块化编辑与发布。",
      details:
        "构建了从表单输入、实时预览到一键发布的完整流程，支持中英切换、媒体上传与分享链接。",
      media: null,
    },
    {
      period: "2023",
      title: "Portfolio System",
      subtitle: "Design Platform",
      summary: "统一作品展示组件库，减少重复开发成本。",
      details:
        "沉淀可复用卡片与内容模板，显著提升项目展示效率和视觉一致性。",
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

const MAX_MAIN_MEDIA = 6;
const MAX_CUSTOM_SECTIONS = 3;
const MAX_CUSTOM_MEDIA = 6;
const MAX_PROJECT_ITEMS = 8;
const MAX_IMAGE_MB = 2;
const MAX_VIDEO_MB = 8;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;
const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;
const DRAFT_KEY = "motioncv:editor:draft";

function createCustomSection() {
  return {
    title: "",
    content: "",
    mediaItems: [],
  };
}

function createProjectItem() {
  return {
    period: "",
    title: "",
    subtitle: "",
    summary: "",
    details: "",
    media: null,
  };
}

function migrateLegacyProjects(rawProjects = "") {
  const lines = String(rawProjects)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  return lines.map((line) => {
    const [title = "", summary = ""] = line.split("|").map((v) => v.trim());
    return {
      period: "",
      title,
      subtitle: "",
      summary,
      details: summary,
      media: null,
    };
  });
}

function getInitialDraft() {
  if (typeof window === "undefined") return starter;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return starter;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return starter;
    const merged = { ...starter, ...saved };
    if (!merged.profileEmail && merged.email) merged.profileEmail = merged.email;
    if (!merged.profileCustom1Title && saved.profileExtraTitle) {
      merged.profileCustom1Title = saved.profileExtraTitle;
    }
    if (!merged.profileCustom1Value && saved.profileExtraValue) {
      merged.profileCustom1Value = saved.profileExtraValue;
    }
    if (!Array.isArray(merged.projectItems) || merged.projectItems.length === 0) {
      const migrated = migrateLegacyProjects(merged.projects);
      merged.projectItems = migrated.length ? migrated : starter.projectItems;
    }
    return merged;
  } catch {
    return starter;
  }
}

export default function Home() {
  const [formData, setFormData] = useState(starter);
  const [resumeData, setResumeData] = useState(starter);
  const [lang, setLang] = useState("zh");
  const [shareLink, setShareLink] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [generateStatus, setGenerateStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [aboutUploadStatus, setAboutUploadStatus] = useState("");
  const [customUploadStatus, setCustomUploadStatus] = useState({});
  const [projectUploadStatus, setProjectUploadStatus] = useState({});
  const [activeEditorAnchor, setActiveEditorAnchor] = useState("");

  const previewRef = useRef(null);
  const jumpTimerRef = useRef(null);
  const displayData = getResumeInLanguage(resumeData, lang);

  useEffect(() => {
    const restored = getInitialDraft();
    queueMicrotask(() => {
      setFormData(restored);
      setResumeData(restored);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch {
      // ignore storage failures
    }
  }, [formData]);

  useEffect(
    () => () => {
      if (jumpTimerRef.current) {
        clearTimeout(jumpTimerRef.current);
      }
    },
    []
  );

  const syncData = (updater) => {
    setFormData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setResumeData(next);
      return next;
    });
  };

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    syncData((prev) => ({ ...prev, [name]: value }));
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const isSupportedImageFile = (file) => {
    const lower = file.name.toLowerCase();
    return (
      ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type) ||
      /\.(png|jpe?g|webp|gif)$/.test(lower)
    );
  };

  const isSupportedVideoFile = (file) => {
    const lower = file.name.toLowerCase();
    return (
      ["video/mp4", "video/quicktime", "video/webm"].includes(file.type) ||
      /\.(mp4|mov|webm)$/.test(lower)
    );
  };

  const validateByType = (file, type) =>
    type === "image" ? isSupportedImageFile(file) : isSupportedVideoFile(file);

  const isWithinSizeLimit = (file, type) =>
    type === "image" ? file.size <= MAX_IMAGE_BYTES : file.size <= MAX_VIDEO_BYTES;

  const sizeLimitText = (type) => (type === "image" ? `${MAX_IMAGE_MB}MB` : `${MAX_VIDEO_MB}MB`);

  const addMainMediaItems = async (files, type) => {
    if (!files.length) return;

    const existingCount = formData.mediaItems.length;
    if (existingCount >= MAX_MAIN_MEDIA) {
      setUploadStatus(`最多上传 ${MAX_MAIN_MEDIA} 个媒体文件`);
      return;
    }

    const accepted = files.slice(0, MAX_MAIN_MEDIA - existingCount);
    const typeValidFiles = accepted.filter((file) => validateByType(file, type));
    const validFiles = typeValidFiles.filter((file) => isWithinSizeLimit(file, type));
    const overSizeCount = typeValidFiles.length - validFiles.length;

    if (!typeValidFiles.length) {
      setUploadStatus(type === "image" ? "图片格式不支持，请上传 png/jpg/jpeg/webp/gif" : "视频格式不支持，请上传 mp4/mov/webm");
      return;
    }

    if (!validFiles.length) {
      setUploadStatus(`${type === "image" ? "图片" : "视频"}超出大小限制（单文件最大 ${sizeLimitText(type)}）`);
      return;
    }

    setUploadStatus("上传中...");
    try {
      const urls = await Promise.all(validFiles.map((file) => fileToDataUrl(file)));
      const newItems = validFiles.map((file, index) => ({
        type,
        name: file.name,
        url: urls[index],
      }));

      syncData((prev) => {
        const merged = [...prev.mediaItems, ...newItems].slice(0, MAX_MAIN_MEDIA);
        return { ...prev, mediaItems: merged };
      });

      setUploadStatus(
        overSizeCount > 0
          ? `已上传 ${newItems.length} 个，${overSizeCount} 个超限被跳过（单文件最大 ${sizeLimitText(type)}）`
          : `上传成功，当前共 ${Math.min(existingCount + newItems.length, MAX_MAIN_MEDIA)} 个媒体文件`
      );
    } catch {
      setUploadStatus("上传失败，请重试");
    }
  };

  const addCustomMediaItems = async (sectionIndex, files, type) => {
    if (!files.length) return;
    const section = formData.customSections[sectionIndex];
    if (!section) return;

    const existingCount = section.mediaItems.length;
    if (existingCount >= MAX_CUSTOM_MEDIA) {
      setCustomUploadStatus((prev) => ({ ...prev, [sectionIndex]: `该板块最多 ${MAX_CUSTOM_MEDIA} 个媒体文件` }));
      return;
    }

    const accepted = files.slice(0, MAX_CUSTOM_MEDIA - existingCount);
    const typeValidFiles = accepted.filter((file) => validateByType(file, type));
    const validFiles = typeValidFiles.filter((file) => isWithinSizeLimit(file, type));
    const overSizeCount = typeValidFiles.length - validFiles.length;

    if (!typeValidFiles.length) {
      setCustomUploadStatus((prev) => ({
        ...prev,
        [sectionIndex]: type === "image" ? "图片格式不支持" : "视频格式不支持",
      }));
      return;
    }

    if (!validFiles.length) {
      setCustomUploadStatus((prev) => ({
        ...prev,
        [sectionIndex]: `${type === "image" ? "图片" : "视频"}超出大小限制（单文件最大 ${sizeLimitText(type)}）`,
      }));
      return;
    }

    setCustomUploadStatus((prev) => ({ ...prev, [sectionIndex]: "上传中..." }));
    try {
      const urls = await Promise.all(validFiles.map((file) => fileToDataUrl(file)));
      const newItems = validFiles.map((file, index) => ({
        type,
        name: file.name,
        url: urls[index],
      }));

      syncData((prev) => {
        const nextSections = [...prev.customSections];
        const current = nextSections[sectionIndex];
        if (!current) return prev;
        nextSections[sectionIndex] = {
          ...current,
          mediaItems: [...current.mediaItems, ...newItems].slice(0, MAX_CUSTOM_MEDIA),
        };
        return { ...prev, customSections: nextSections };
      });

      setCustomUploadStatus((prev) => ({
        ...prev,
        [sectionIndex]:
          overSizeCount > 0
            ? `已上传 ${newItems.length} 个，${overSizeCount} 个超限被跳过（单文件最大 ${sizeLimitText(type)}）`
            : `上传成功，当前共 ${Math.min(existingCount + newItems.length, MAX_CUSTOM_MEDIA)} 个媒体文件`,
      }));
    } catch {
      setCustomUploadStatus((prev) => ({ ...prev, [sectionIndex]: "上传失败，请重试" }));
    }
  };

  const setProjectMedia = async (projectIndex, file, type) => {
    if (!file) return;
    if (!validateByType(file, type)) {
      setProjectUploadStatus((prev) => ({
        ...prev,
        [projectIndex]:
          type === "image"
            ? "图片格式不支持，请上传 png/jpg/jpeg/webp/gif"
            : "视频格式不支持，请上传 mp4/mov/webm",
      }));
      return;
    }
    if (!isWithinSizeLimit(file, type)) {
      setProjectUploadStatus((prev) => ({
        ...prev,
        [projectIndex]: `${type === "image" ? "图片" : "视频"}超出大小限制（单文件最大 ${sizeLimitText(type)}）`,
      }));
      return;
    }

    setProjectUploadStatus((prev) => ({ ...prev, [projectIndex]: "上传中..." }));
    try {
      const url = await fileToDataUrl(file);
      syncData((prev) => {
        const next = [...prev.projectItems];
        if (!next[projectIndex]) return prev;
        next[projectIndex] = {
          ...next[projectIndex],
          media: { type, name: file.name, url },
        };
        return { ...prev, projectItems: next };
      });
      setProjectUploadStatus((prev) => ({ ...prev, [projectIndex]: "上传成功" }));
    } catch {
      setProjectUploadStatus((prev) => ({ ...prev, [projectIndex]: "上传失败，请重试" }));
    }
  };

  const onMainImageChange = async (event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    await addMainMediaItems(files, "image");
    event.target.value = "";
  };

  const onAboutImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isSupportedImageFile(file)) {
      setAboutUploadStatus("图片格式不支持，请上传 png/jpg/jpeg/webp/gif");
      event.target.value = "";
      return;
    }
    if (!isWithinSizeLimit(file, "image")) {
      setAboutUploadStatus(`图片超出大小限制（单文件最大 ${sizeLimitText("image")}）`);
      event.target.value = "";
      return;
    }
    setAboutUploadStatus("上传中...");
    try {
      const url = await fileToDataUrl(file);
      syncData((prev) => ({
        ...prev,
        aboutMedia: {
          type: "image",
          name: file.name,
          url,
        },
      }));
      setAboutUploadStatus("关于我图片上传成功");
    } catch {
      setAboutUploadStatus("上传失败，请重试");
    } finally {
      event.target.value = "";
    }
  };

  const onMainVideoChange = async (event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    await addMainMediaItems(files, "video");
    event.target.value = "";
  };

  const clearAboutImage = () => {
    syncData((prev) => ({ ...prev, aboutMedia: null }));
    setAboutUploadStatus("已移除关于我图片");
  };

  const onCustomImageChange = async (sectionIndex, event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    await addCustomMediaItems(sectionIndex, files, "image");
    event.target.value = "";
  };

  const onCustomVideoChange = async (sectionIndex, event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    await addCustomMediaItems(sectionIndex, files, "video");
    event.target.value = "";
  };

  const onProjectImageChange = async (projectIndex, event) => {
    const file = event.target.files?.[0];
    await setProjectMedia(projectIndex, file, "image");
    event.target.value = "";
  };

  const onProjectVideoChange = async (projectIndex, event) => {
    const file = event.target.files?.[0];
    await setProjectMedia(projectIndex, file, "video");
    event.target.value = "";
  };

  const removeMainMediaItem = (index) => {
    syncData((prev) => {
      const nextItems = [...prev.mediaItems];
      nextItems.splice(index, 1);
      return { ...prev, mediaItems: nextItems };
    });
    setUploadStatus("已移除 1 个媒体文件");
  };

  const removeCustomMediaItem = (sectionIndex, mediaIndex) => {
    syncData((prev) => {
      const nextSections = [...prev.customSections];
      const section = nextSections[sectionIndex];
      if (!section) return prev;
      const nextMedia = [...section.mediaItems];
      nextMedia.splice(mediaIndex, 1);
      nextSections[sectionIndex] = { ...section, mediaItems: nextMedia };
      return { ...prev, customSections: nextSections };
    });
    setCustomUploadStatus((prev) => ({ ...prev, [sectionIndex]: "已移除 1 个媒体文件" }));
  };

  const addCustomSection = () => {
    if (formData.customSections.length >= MAX_CUSTOM_SECTIONS) return;
    syncData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, createCustomSection()],
    }));
  };

  const addProjectItem = () => {
    if (formData.projectItems.length >= MAX_PROJECT_ITEMS) return;
    syncData((prev) => ({ ...prev, projectItems: [...prev.projectItems, createProjectItem()] }));
  };

  const removeProjectItem = (index) => {
    syncData((prev) => {
      const next = [...prev.projectItems];
      next.splice(index, 1);
      return { ...prev, projectItems: next };
    });
    setProjectUploadStatus((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const updateProjectField = (index, key, value) => {
    syncData((prev) => {
      const next = [...prev.projectItems];
      if (!next[index]) return prev;
      next[index] = { ...next[index], [key]: value };
      return { ...prev, projectItems: next };
    });
  };

  const clearProjectMedia = (index) => {
    syncData((prev) => {
      const next = [...prev.projectItems];
      if (!next[index]) return prev;
      next[index] = { ...next[index], media: null };
      return { ...prev, projectItems: next };
    });
    setProjectUploadStatus((prev) => ({ ...prev, [index]: "已移除媒体" }));
  };

  const removeCustomSection = (index) => {
    syncData((prev) => {
      const next = [...prev.customSections];
      next.splice(index, 1);
      return { ...prev, customSections: next };
    });
    setCustomUploadStatus((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const updateCustomSectionField = (index, key, value) => {
    syncData((prev) => {
      const nextSections = [...prev.customSections];
      if (!nextSections[index]) return prev;
      nextSections[index] = { ...nextSections[index], [key]: value };
      return { ...prev, customSections: nextSections };
    });
  };

  const onGenerate = (event) => {
    event.preventDefault();
    const currentData = { ...formData };
    setResumeData(currentData);
    setGenerateStatus(lang === "zh" ? "已生成，已更新右侧预览" : "Generated. Preview updated on the right.");
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onPublish = async () => {
    const currentData = { ...formData };
    setResumeData(currentData);
    const slug = toSlug(currentData.name);
    const saveResult = saveResumeSnapshot(slug, currentData);
    if (!saveResult.ok) {
      if (saveResult.reason === "quota") {
        setCopyStatus(
          lang === "zh"
            ? "发布失败：媒体文件过大导致浏览器存储空间不足。请减少媒体数量或压缩视频后再试。"
            : "Publish failed: Browser storage quota exceeded. Please reduce media files or compress videos."
        );
      } else {
        setCopyStatus(lang === "zh" ? "发布失败，请重试。" : "Publish failed. Please try again.");
      }
      setShareLink("");
      return;
    }

    const link = `${window.location.origin}/resume/${slug}?lang=${lang}`;
    setShareLink(link);
    const popup = window.open(link, "_blank", "noopener,noreferrer");

    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus(
        lang === "zh"
          ? popup
            ? "已发布并复制分享链接"
            : "已发布并复制分享链接（浏览器可能拦截了新窗口）"
          : popup
            ? "Published and link copied."
            : "Published and link copied (popup may be blocked)."
      );
    } catch {
      setCopyStatus(
        lang === "zh"
          ? popup
            ? "已发布，分享链接请手动复制"
            : "已发布，但浏览器可能拦截新窗口；请手动复制链接打开"
          : popup
            ? "Published. Please copy the link manually."
            : "Published, but popup may be blocked; please open the copied link manually."
      );
    }
  };

  const resetAll = () => {
    setFormData(starter);
    setResumeData(starter);
    setShareLink("");
    setCopyStatus("");
    setUploadStatus("");
    setAboutUploadStatus("");
    setCustomUploadStatus({});
    setProjectUploadStatus({});
    setGenerateStatus("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  };

  const sectionAnchorMap = {
    basic: "edit-basic",
    about: "edit-about",
    experiences: "edit-experiences",
    skills: "edit-skills",
    awards: "edit-awards",
    projects: "edit-projects",
    customSections: "edit-custom",
  };

  const jumpToEditorSection = (section) => {
    if (typeof window === "undefined") return;
    const anchorId = sectionAnchorMap[section];
    if (!anchorId) return;
    const target = document.getElementById(anchorId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveEditorAnchor(anchorId);
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
    jumpTimerRef.current = setTimeout(() => setActiveEditorAnchor(""), 1200);
  };

  const editorAnchorClass = (anchorId, baseClass = "") =>
    `${baseClass}${activeEditorAnchor === anchorId ? " editor-jump-highlight rounded-xl" : ""}`;

  return (
    <>
      <Head>
        <title>MotionCV</title>
        <meta name="description" content="Input your info and generate your own resume website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-12">
        <div className="mb-6 flex items-center justify-between rounded-2xl border bg-[var(--panel)] px-5 py-4">
          <div>
            <p className="eyebrow">MOTIONCV</p>
            <p className="mt-2 text-sm text-[var(--muted)]">输入信息后生成你的个人简历网站</p>
          </div>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={onGenerate} className="rounded-2xl border bg-[var(--panel)] p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <h2 className="text-xl font-semibold">简历信息输入</h2>

            <label id="edit-basic" className={editorAnchorClass("edit-basic", "mt-5 block text-sm text-[var(--muted)]")}>
              姓名
              <input name="name" value={formData.name} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
            </label>
            <label className="mt-4 block text-sm text-[var(--muted)]">
              定位语
              <input name="tagline" value={formData.tagline} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
            </label>
            <label id="edit-about" className={editorAnchorClass("edit-about", "mt-4 block text-sm text-[var(--muted)]")}>
              自我介绍
              <textarea name="about" value={formData.about} onChange={onFieldChange} rows={4} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
            </label>
            <div className="mt-3 rounded-xl border p-3">
              <p className="text-sm text-[var(--muted)]">关于我图片（独立设置，不与顶部媒体共用）</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  id="about-image-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/webp,image/gif"
                  onChange={onAboutImageChange}
                  className="sr-only"
                />
                <label htmlFor="about-image-upload" className="inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-xs text-[var(--muted)]">
                  上传关于我图片
                </label>
                {formData.aboutMedia && (
                  <button type="button" onClick={clearAboutImage} className="inline-flex items-center rounded-full border px-4 py-2 text-xs text-[var(--muted)]">
                    移除关于我图片
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">单文件限制：图片 ≤ {MAX_IMAGE_MB}MB</p>
              {formData.aboutMedia?.name && (
                <p className="mt-1 text-xs text-[var(--muted)]">当前图片：{formData.aboutMedia.name}</p>
              )}
              {aboutUploadStatus && <p className="mt-1 text-xs text-[var(--muted)]">{aboutUploadStatus}</p>}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-[var(--muted)]">
                职业（POSITION）
                <input name="profilePosition" value={formData.profilePosition} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
              <label className="block text-sm text-[var(--muted)]">
                邮箱（EMAIL）
                <input name="profileEmail" value={formData.profileEmail} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-[var(--muted)]">
                自定义项1标题（选填）
                <input name="profileCustom1Title" value={formData.profileCustom1Title} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
              <label className="block text-sm text-[var(--muted)]">
                自定义项1内容（选填）
                <input name="profileCustom1Value" value={formData.profileCustom1Value} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
              <label className="block text-sm text-[var(--muted)]">
                自定义项2标题（选填）
                <input name="profileCustom2Title" value={formData.profileCustom2Title} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
              <label className="block text-sm text-[var(--muted)]">
                自定义项2内容（选填）
                <input name="profileCustom2Value" value={formData.profileCustom2Value} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
              <label className="block text-sm text-[var(--muted)]">
                自定义项3标题（选填）
                <input name="profileCustom3Title" value={formData.profileCustom3Title} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
              <label className="block text-sm text-[var(--muted)]">
                自定义项3内容（选填）
                <input name="profileCustom3Value" value={formData.profileCustom3Value} onChange={onFieldChange} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
              </label>
            </div>
            <label id="edit-experiences" className={editorAnchorClass("edit-experiences", "mt-4 block text-sm text-[var(--muted)]")}>
              工作经历（每行：时间 | 职位 | 公司 | 描述）
              <textarea name="experiences" value={formData.experiences} onChange={onFieldChange} rows={6} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
            </label>
            <label id="edit-skills" className={editorAnchorClass("edit-skills", "mt-4 block text-sm text-[var(--muted)]")}>
              技能（选填，逗号或换行分隔）
              <textarea name="skills" value={formData.skills} onChange={onFieldChange} rows={3} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
            </label>
            <label id="edit-awards" className={editorAnchorClass("edit-awards", "mt-4 block text-sm text-[var(--muted)]")}>
              奖项与荣誉（选填，每行：时间 | 奖项 | 机构 | 描述）
              <textarea name="awards" value={formData.awards} onChange={onFieldChange} rows={4} className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none" />
            </label>
            <div id="edit-projects" className={editorAnchorClass("edit-projects", "mt-4 rounded-xl border p-3")}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted)]">项目经历（时间轴，最多 {MAX_PROJECT_ITEMS} 条）</p>
                <button
                  type="button"
                  onClick={addProjectItem}
                  disabled={formData.projectItems.length >= MAX_PROJECT_ITEMS}
                  className="rounded-full border px-3 py-1 text-xs text-[var(--muted)] disabled:opacity-40"
                >
                  添加项目
                </button>
              </div>

              <div className="mt-3 space-y-4">
                {formData.projectItems.map((project, index) => (
                  <div key={`project-item-${index}`} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">项目 {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeProjectItem(index)}
                        className="rounded-full border px-2 py-1 text-xs text-[var(--muted)]"
                      >
                        删除项目
                      </button>
                    </div>

                    <label className="mt-3 block text-sm text-[var(--muted)]">
                      时间
                      <input
                        value={project.period}
                        onChange={(event) => updateProjectField(index, "period", event.target.value)}
                        className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none"
                      />
                    </label>
                    <label className="mt-3 block text-sm text-[var(--muted)]">
                      标题
                      <input
                        value={project.title}
                        onChange={(event) => updateProjectField(index, "title", event.target.value)}
                        className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none"
                      />
                    </label>
                    <label className="mt-3 block text-sm text-[var(--muted)]">
                      副标题
                      <input
                        value={project.subtitle}
                        onChange={(event) => updateProjectField(index, "subtitle", event.target.value)}
                        className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none"
                      />
                    </label>
                    <label className="mt-3 block text-sm text-[var(--muted)]">
                      摘要（卡片默认显示）
                      <textarea
                        value={project.summary}
                        onChange={(event) => updateProjectField(index, "summary", event.target.value)}
                        rows={2}
                        className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none"
                      />
                    </label>
                    <label className="mt-3 block text-sm text-[var(--muted)]">
                      详情（点击“详情”后展开）
                      <textarea
                        value={project.details}
                        onChange={(event) => updateProjectField(index, "details", event.target.value)}
                        rows={3}
                        className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none"
                      />
                    </label>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <input
                        id={`project-image-${index}`}
                        type="file"
                        accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/webp,image/gif"
                        onChange={(event) => onProjectImageChange(index, event)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`project-image-${index}`}
                        className="inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-xs text-[var(--muted)]"
                      >
                        上传图片
                      </label>

                      <input
                        id={`project-video-${index}`}
                        type="file"
                        accept=".mp4,.mov,video/mp4,video/quicktime,video/webm"
                        onChange={(event) => onProjectVideoChange(index, event)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`project-video-${index}`}
                        className="inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-xs text-[var(--muted)]"
                      >
                        上传视频
                      </label>

                      {project.media && (
                        <button
                          type="button"
                          onClick={() => clearProjectMedia(index)}
                          className="inline-flex items-center rounded-full border px-4 py-2 text-xs text-[var(--muted)]"
                        >
                          移除媒体
                        </button>
                      )}
                    </div>

                    {project.media && (
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        已关联{project.media.type === "image" ? "图片" : "视频"}：{project.media.name}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      单文件限制：图片 ≤ {MAX_IMAGE_MB}MB，视频 ≤ {MAX_VIDEO_MB}MB
                    </p>
                    {projectUploadStatus[index] && (
                      <p className="mt-1 text-xs text-[var(--muted)]">{projectUploadStatus[index]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div id="edit-custom" className={editorAnchorClass("edit-custom", "mt-4 rounded-xl border p-3")}>
              <p className="text-sm text-[var(--muted)]">顶部照片/视频（最多 {MAX_MAIN_MEDIA} 个）</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <input id="image-upload" type="file" multiple accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/webp,image/gif" onChange={onMainImageChange} className="sr-only" />
                <label htmlFor="image-upload" className="inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--text)]">
                  添加图片
                </label>
                <input id="video-upload" type="file" multiple accept=".mp4,.mov,video/mp4,video/quicktime,video/webm" onChange={onMainVideoChange} className="sr-only" />
                <label htmlFor="video-upload" className="inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--text)]">
                  添加视频
                </label>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">当前数量：{formData.mediaItems.length} / {MAX_MAIN_MEDIA}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">单文件限制：图片 ≤ {MAX_IMAGE_MB}MB，视频 ≤ {MAX_VIDEO_MB}MB</p>
              {uploadStatus && <p className="mt-1 text-xs text-[var(--muted)]">{uploadStatus}</p>}

              {formData.mediaItems.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.mediaItems.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex items-center justify-between rounded-lg border px-3 py-2">
                      <p className="mr-3 truncate text-xs text-[var(--muted)]">{item.type === "image" ? "图片" : "视频"} · {item.name}</p>
                      <button type="button" onClick={() => removeMainMediaItem(index)} className="rounded-full border px-2 py-1 text-xs text-[var(--muted)]">删除</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted)]">自定义板块（选填，最多 {MAX_CUSTOM_SECTIONS} 个）</p>
                <button
                  type="button"
                  onClick={addCustomSection}
                  disabled={formData.customSections.length >= MAX_CUSTOM_SECTIONS}
                  className="rounded-full border px-3 py-1 text-xs text-[var(--muted)] disabled:opacity-40"
                >
                  添加板块
                </button>
              </div>

              <div className="mt-3 space-y-4">
                {formData.customSections.map((section, index) => (
                  <div key={`custom-section-${index}`} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">自定义板块 {index + 1}</p>
                      <button type="button" onClick={() => removeCustomSection(index)} className="rounded-full border px-2 py-1 text-xs text-[var(--muted)]">
                        删除板块
                      </button>
                    </div>

                    <label className="mt-3 block text-sm text-[var(--muted)]">
                      标题
                      <input
                        value={section.title}
                        onChange={(event) => updateCustomSectionField(index, "title", event.target.value)}
                        className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none"
                      />
                    </label>

                    <label className="mt-3 block text-sm text-[var(--muted)]">
                      内容（文本）
                      <textarea
                        value={section.content}
                        onChange={(event) => updateCustomSectionField(index, "content", event.target.value)}
                        rows={3}
                        className="mt-2 w-full rounded-xl border bg-transparent px-3 py-2 outline-none"
                      />
                    </label>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <input
                        id={`custom-image-${index}`}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/webp,image/gif"
                        onChange={(event) => onCustomImageChange(index, event)}
                        className="sr-only"
                      />
                      <label htmlFor={`custom-image-${index}`} className="inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-xs text-[var(--muted)]">
                        上传图片
                      </label>

                      <input
                        id={`custom-video-${index}`}
                        type="file"
                        multiple
                        accept=".mp4,.mov,video/mp4,video/quicktime,video/webm"
                        onChange={(event) => onCustomVideoChange(index, event)}
                        className="sr-only"
                      />
                      <label htmlFor={`custom-video-${index}`} className="inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-xs text-[var(--muted)]">
                        上传视频
                      </label>
                    </div>

                    <p className="mt-2 text-xs text-[var(--muted)]">媒体数量：{section.mediaItems.length} / {MAX_CUSTOM_MEDIA}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">单文件限制：图片 ≤ {MAX_IMAGE_MB}MB，视频 ≤ {MAX_VIDEO_MB}MB</p>
                    {customUploadStatus[index] && <p className="mt-1 text-xs text-[var(--muted)]">{customUploadStatus[index]}</p>}

                    {section.mediaItems.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {section.mediaItems.map((item, mediaIndex) => (
                          <div key={`${item.name}-${mediaIndex}`} className="flex items-center justify-between rounded-lg border px-3 py-2">
                            <p className="mr-3 truncate text-xs text-[var(--muted)]">{item.type === "image" ? "图片" : "视频"} · {item.name}</p>
                            <button
                              type="button"
                              onClick={() => removeCustomMediaItem(index, mediaIndex)}
                              className="rounded-full border px-2 py-1 text-xs text-[var(--muted)]"
                            >
                              删除
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" className="rounded-full border bg-[var(--text)] px-5 py-2 text-sm text-[var(--bg)]">生成网站</button>
              <button type="button" onClick={onPublish} className="rounded-full border px-5 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--text)]">一键发布</button>
              <button type="button" onClick={resetAll} className="rounded-full border px-5 py-2 text-sm text-[var(--muted)]">重置</button>
            </div>

            {generateStatus && <p className="mt-3 text-xs text-[var(--muted)]">{generateStatus}</p>}

            {shareLink && (
              <div className="mt-5 rounded-xl border bg-[var(--bg)] p-3">
                <p className="text-xs text-[var(--muted)]">{copyStatus || "已生成可分享链接"}</p>
                <a href={shareLink} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm">{shareLink}</a>
              </div>
            )}
          </form>

          <div ref={previewRef}>
            <ResumeWebsite data={displayData} lang={lang} onSectionNavigate={jumpToEditorSection} />
          </div>
        </div>
      </main>
    </>
  );
}
