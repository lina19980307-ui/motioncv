import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import ArcMediaCarousel from "./ArcMediaCarousel";
import ModelInteractionBurst from "./hero3d/ModelInteractionBurst";
import { MODEL_CLICK_PRESET_ORDER } from "./hero3d/modelInteraction";
import useInteractionAudio from "./hero3d/useInteractionAudio";
import CardStack from "./CardStack";
import { parseItems } from "../utils/resumeTransform";

const HeroCanvas = dynamic(() => import("./hero3d/HeroCanvas"), { ssr: false });

function splitSkills(text = "") {
  return text
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : "rotate-0"}`}
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ResumeWebsite({
  data,
  lang = "zh",
  onSectionNavigate,
  sectionIdPrefix = "",
  heroFullscreen = false,
  hideTopHeader = false,
  heroModelConfig = null,
  heroInteractionTheme = "light",
  heroInteractionAnchorY = "70%",
}) {
  const experiences = parseItems(data.experiences, ["period", "role", "company", "detail"]);
  const fallbackProjects = parseItems(data.projects, ["name", "detail"]);
  const projectItems = Array.isArray(data.projectItems) && data.projectItems.length > 0
    ? data.projectItems
    : fallbackProjects.map((project) => ({
        period: "",
        title: project.name,
        subtitle: "",
        summary: project.detail,
        details: project.detail,
        media: null,
      }));
  const skills = splitSkills(data.skills);
  const mediaItems = useMemo(
    () => (Array.isArray(data.mediaItems) ? data.mediaItems.slice(0, 6) : []),
    [data.mediaItems]
  );
  const aboutImage =
    data.aboutMedia && data.aboutMedia.type === "image" && data.aboutMedia.url
      ? data.aboutMedia
      : mediaItems.find((item) => item.type === "image");
  const customSections = Array.isArray(data.customSections) ? data.customSections : [];

  const labels =
    lang === "en"
      ? {
          about: "About",
          exp: "Experience",
          skills: "Skills",
          awards: "Banner",
          projects: "Projects",
          noExp: "No experience added yet.",
          noProject: "No projects added yet.",
          noAwards: "No banner added yet.",
          intro: "Introduce yourself here.",
          role: "Role",
          project: "Project",
          letsTalk: "Let's Talk",
          send: "Send",
          namePlaceholder: "Your Name",
          emailPlaceholder: "Email Address",
          messagePlaceholder: "Message",
        }
      : {
          about: "关于我",
          exp: "工作经历",
          skills: "技能",
          awards: "Banner",
          projects: "项目经历",
          noExp: "暂未添加工作经历。",
          noProject: "暂未添加项目。",
          noAwards: "暂未添加 Banner。",
          intro: "请填写自我介绍。",
          role: "职位",
          project: "项目",
          letsTalk: "联系我",
          send: "发送",
          namePlaceholder: "你的名字",
          emailPlaceholder: "邮箱地址",
          messagePlaceholder: "留言内容",
        };

  const [expandedProjectMap, setExpandedProjectMap] = useState({});
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [hoveredMediaIndex, setHoveredMediaIndex] = useState(null);
  const [interactionState, setInteractionState] = useState({ token: 0, comboIndex: -1 });
  const [talkName, setTalkName] = useState("");
  const [talkEmail, setTalkEmail] = useState("");
  const [talkMessage, setTalkMessage] = useState("");
  const rootRef = useRef(null);
  const mediaTrackRef = useRef(null);
  const snapLockRef = useRef(false);
  const snapReleaseTimerRef = useRef(null);
  const canJumpToEditor = typeof onSectionNavigate === "function";
  const makeId = (key) => (sectionIdPrefix ? `${sectionIdPrefix}-${key}` : undefined);
  const sectionShellClass = heroFullscreen ? "section-shell" : "";
  const customSectionShellClass = heroFullscreen ? "section-shell section-shell-custom" : "";

  const jumpToEditor = (section) => {
    if (!canJumpToEditor) return;
    onSectionNavigate(section);
  };

  const getJumpableClass = () =>
    canJumpToEditor
      ? "cursor-pointer transition hover:border-[var(--muted)]"
      : "";

  const toggleProjectDetails = (index) => {
    setExpandedProjectMap((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const safeActiveMediaIndex = mediaItems.length ? Math.min(activeMediaIndex, mediaItems.length - 1) : 0;
  const effectiveActiveMediaIndex = hoveredMediaIndex ?? safeActiveMediaIndex;

  const scrollToMedia = (nextIndex) => {
    const track = mediaTrackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll("[data-media-card='true']"));
    const target = cards[nextIndex];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveMediaIndex(nextIndex);
  };

  const onSendMessage = (event) => {
    event.preventDefault();
    const receiver = data.profileEmail || data.email || "";
    if (!receiver) return;
    const subject = `${talkName || (lang === "en" ? "Website Visitor" : "网站访客")} - ${lang === "en" ? "Portfolio Contact" : "网站联系"}`;
    const body = [
      `${lang === "en" ? "Name" : "姓名"}: ${talkName || "-"}`,
      `${lang === "en" ? "Email" : "邮箱"}: ${talkEmail || "-"}`,
      "",
      `${lang === "en" ? "Message" : "留言"}:`,
      talkMessage || "-",
    ].join("\n");
    window.location.href = `mailto:${encodeURIComponent(receiver)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const renderSectionTitle = (title) => {
    return <h2 className="section-title wave-item">{title}</h2>;
  };

  const profileRows = [
    { label: "POSITION", value: data.profilePosition || "" },
    { label: "EMAIL", value: data.profileEmail || data.email || "" },
    { label: (data.profileCustom1Title || "").toUpperCase(), value: data.profileCustom1Value || "" },
    { label: (data.profileCustom2Title || "").toUpperCase(), value: data.profileCustom2Value || "" },
    { label: (data.profileCustom3Title || "").toUpperCase(), value: data.profileCustom3Value || "" },
  ].filter((row) => row.label && row.value);
  const heroName = data.name || "Your Name";
  const heroGreeting = "Hi, I'm";
  const awardsMediaItems = useMemo(
    () => mediaItems.filter((item) => item?.url && (item.type === "image" || item.type === "video")),
    [mediaItems]
  );
  const playInteractionAudio = useInteractionAudio(data.interactionAudio || null);
  const interactionPreset = useMemo(
    () => MODEL_CLICK_PRESET_ORDER[Math.max(interactionState.comboIndex, 0)] || MODEL_CLICK_PRESET_ORDER[0],
    [interactionState.comboIndex]
  );

  const onHeroModelClick = () => {
    playInteractionAudio();
    setInteractionState((prev) => ({
      token: prev.token + 1,
      comboIndex: (prev.comboIndex + 1) % MODEL_CLICK_PRESET_ORDER.length,
    }));
  };

  useEffect(() => {
    if (!heroFullscreen) return undefined;

    const isEditableTarget = (target) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest("input, textarea, select, button, video, [data-allow-native-scroll='true']"));
    };

    const findScrollableAncestor = (target) => {
      if (!(target instanceof Element)) return null;
      let node = target;
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const canScroll = (overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight;
        if (canScroll) return node;
        node = node.parentElement;
      }
      return null;
    };

    const onWheel = (event) => {
      if (snapLockRef.current) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < 6) return;
      if (isEditableTarget(event.target)) return;

      const innerScrollable = findScrollableAncestor(event.target);
      if (innerScrollable) {
        const { scrollTop, scrollHeight, clientHeight } = innerScrollable;
        const canScrollDown = scrollTop + clientHeight < scrollHeight - 2;
        const canScrollUp = scrollTop > 2;
        if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) {
          return;
        }
      }

      const root = rootRef.current;
      if (!root) return;
      const sections = Array.from(root.querySelectorAll("[data-snap-section='true']"));
      if (sections.length < 2) return;

      const viewportAnchor = window.innerHeight * 0.24;
      const sectionRects = sections.map((section) => section.getBoundingClientRect());
      const anchoredIndex = sectionRects.findIndex((rect) => rect.top <= viewportAnchor && rect.bottom >= viewportAnchor);
      const currentIndex =
        anchoredIndex >= 0
          ? anchoredIndex
          : sections.reduce(
              (best, section, index) => {
                const distance = Math.abs(section.getBoundingClientRect().top - viewportAnchor);
                return distance < best.distance ? { index, distance } : best;
              },
              { index: 0, distance: Number.POSITIVE_INFINITY }
            ).index;
      const currentRect = sectionRects[currentIndex];
      const isLongSection = currentIndex > 0 && currentRect && currentRect.height > window.innerHeight * 1.02;
      if (isLongSection) {
        return;
      }

      const nextIndex = event.deltaY > 0 ? Math.min(sections.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
      if (nextIndex === currentIndex) {
        event.preventDefault();
        return;
      }

      snapLockRef.current = true;
      event.preventDefault();
      sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "start" });

      if (snapReleaseTimerRef.current) {
        window.clearTimeout(snapReleaseTimerRef.current);
      }
      snapReleaseTimerRef.current = window.setTimeout(() => {
        snapLockRef.current = false;
      }, 620);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (snapReleaseTimerRef.current) {
        window.clearTimeout(snapReleaseTimerRef.current);
      }
    };
  }, [heroFullscreen]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const waveSections = Array.from(root.querySelectorAll("[data-wave-section='true']"));
    if (!waveSections.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;
          if (entry.isIntersecting) {
            if (section.dataset.waveVisible === "1") return;
            section.dataset.waveVisible = "1";
            section.classList.remove("wave-active");
            void section.offsetWidth;
            section.classList.add("wave-active");
            return;
          }
          section.dataset.waveVisible = "0";
          section.classList.remove("wave-active");
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
    );
    waveSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [awardsMediaItems.length, customSections.length, experiences.length, projectItems.length, skills.length]);

  return (
    <section
      ref={rootRef}
      className={`${heroFullscreen ? "px-0 pb-10 pt-2 md:pb-12 md:pt-4" : "p-6 md:p-10"} motion-fade`}
    >
      {!hideTopHeader && (
        <header
          id={makeId("home")}
          data-snap-section="true"
          data-wave-section="true"
          className={`wave-section ${heroFullscreen ? "hero-stage relative flex w-full min-h-[92vh] flex-col items-center justify-center overflow-hidden pb-16 text-center md:min-h-[96vh] md:pb-20" : "pb-10"} ${getJumpableClass()}`}
          onClick={() => jumpToEditor("basic")}
        >
          {heroFullscreen && heroModelConfig ? (
            <div className="share-hero-3d absolute inset-0 z-0">
              <HeroCanvas
                config={heroModelConfig}
                onModelClick={onHeroModelClick}
                interactionPreset={interactionPreset}
                interactionToken={interactionState.token}
              />
            </div>
          ) : null}

          {heroFullscreen && heroModelConfig ? (
            <ModelInteractionBurst
              interactionToken={interactionState.token}
              preset={interactionPreset}
              themeVariant={heroInteractionTheme}
              anchorY={heroInteractionAnchorY}
            />
          ) : null}

          {heroFullscreen && !heroModelConfig && mediaItems.length > 0 && (
            <ArcMediaCarousel items={mediaItems} className="pointer-events-none absolute inset-0 z-0 hidden md:block" />
          )}

          {heroFullscreen ? (
            <div className="hero-copy-shell pointer-events-none absolute inset-x-0 top-[calc(16vh+40px)] z-20 px-4 md:top-[calc(11vh+40px)]">
              <div className="wave-item hero-copy-panel" style={{ "--wave-delay": "0ms" }}>
                <h1 className="hero-copy-title">
                  <span className="hero-copy-lead">{heroGreeting}</span>{" "}
                  <span className="hero-copy-name">{heroName}</span>
                </h1>
              </div>
            </div>
          ) : (
            <>
              <h1
                className="wave-item relative z-20 text-5xl font-semibold tracking-tight md:text-7xl"
                style={{ "--wave-delay": "0ms" }}
              >
                {heroName}
              </h1>
            </>
          )}

          {!heroFullscreen && mediaItems.length > 0 && (
            <div className="mt-8" onClick={(event) => event.stopPropagation()}>
              <div className="relative">
                <div
                  ref={mediaTrackRef}
                  className="flex gap-4 overflow-x-auto overflow-y-visible pb-8 pl-6 pr-3 pt-8 [scrollbar-width:none] snap-x snap-mandatory"
                >
                  {mediaItems.map((item, index) => {
                    const distance = Math.abs(index - effectiveActiveMediaIndex);
                    const direction = index - effectiveActiveMediaIndex;
                    const transformStyle =
                      distance === 0
                        ? "translateY(-3px) scale(1.02) rotateY(0deg)"
                        : distance === 1
                          ? `translateY(2px) scale(0.97) rotateY(${direction > 0 ? "-8deg" : "8deg"})`
                          : `translateY(5px) scale(0.94) rotateY(${direction > 0 ? "-12deg" : "12deg"})`;
                    const emphasisClass =
                      distance === 0
                        ? "opacity-100"
                        : distance === 1
                          ? "opacity-78"
                          : "opacity-48";

                    return (
                      <article
                        key={`${item.type}-${index}`}
                        data-media-card="true"
                        className={`motion-card soft-panel min-w-[240px] md:min-w-[320px] max-w-[360px] flex-1 snap-center overflow-hidden rounded-xl shadow-none transition-opacity duration-500 hover:shadow-none ${emphasisClass}`}
                        onMouseEnter={() => setHoveredMediaIndex(index)}
                        onMouseLeave={() => setHoveredMediaIndex(null)}
                        style={{
                          animationDelay: `${index * 80}ms`,
                          boxShadow: "none",
                          transform: transformStyle,
                          transformStyle: "preserve-3d",
                          transformOrigin: "center center",
                          transition: "transform 460ms ease, opacity 460ms ease",
                        }}
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.url}
                            alt={item.name || "uploaded image"}
                            width={720}
                            height={420}
                            unoptimized
                            className="h-56 w-full object-cover"
                          />
                        ) : (
                          <video controls className="h-56 w-full object-cover">
                            <source src={item.url} />
                          </video>
                        )}
                      </article>
                    );
                  })}
                </div>

                {mediaItems.length > 1 && (
                  <div className="mt-2 flex justify-center gap-1.5">
                    {mediaItems.map((_, index) => (
                      <button
                        key={`media-dot-${index}`}
                        type="button"
                        aria-label={`Go to media ${index + 1}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          scrollToMedia(index);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === effectiveActiveMediaIndex ? "w-6 bg-[var(--text)]" : "w-2 bg-[var(--line)]"}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      <div
        id={makeId("about")}
        data-snap-section="true"
        data-wave-section="true"
        className={`wave-section ${sectionShellClass} section-space motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("about")}
      >
        {renderSectionTitle(labels.about)}
        <div
          className={`wave-item mt-7 grid w-full gap-8 md:grid-cols-[320px_1fr] md:items-center ${heroFullscreen ? "mx-auto max-w-3xl" : ""}`}
          style={{ "--wave-delay": "90ms" }}
        >
          <div className="mx-auto w-full max-w-[380px]">
            <div className="about-media-stack">
              <span className="about-stack-layer about-stack-layer-1" aria-hidden="true" />
              <span className="about-stack-layer about-stack-layer-2" aria-hidden="true" />
              <span className="about-stack-layer about-stack-layer-3" aria-hidden="true" />
              <div className="about-stack-main overflow-hidden rounded-3xl p-0">
                {aboutImage ? (
                  <Image
                    src={aboutImage.url}
                    alt={aboutImage.name || "profile"}
                    width={480}
                    height={520}
                    unoptimized
                    className="aspect-square w-full rounded-3xl object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-[var(--panel)] text-sm text-[var(--muted)]">
                    Portrait
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="self-center">
            {profileRows.length > 0 && (
              <div id={makeId("profile")} className="mt-0 grid gap-3 text-[1.02rem] text-[var(--text)]">
                {profileRows.map((row, index) => (
                  <p
                    key={row.label}
                    id={row.label === "EMAIL" ? makeId("email") : undefined}
                    className="wave-subitem tracking-[0.01em]"
                    style={{ "--wave-index": index }}
                  >
                    <span className="mr-2 font-semibold">{row.label}:</span>
                    <span className="text-[var(--muted)]">{row.value}</span>
                  </p>
                ))}
              </div>
            )}

            {data.about && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)]">
                {data.about}
              </p>
            )}

            {skills.length > 0 && (
              <div id={makeId("skills")} className="mt-8">
                <h3 className="text-2xl font-semibold">{labels.skills}</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="wave-subitem motion-card soft-pill max-w-full rounded-full px-4 py-2 text-sm text-[var(--muted)] whitespace-normal break-words"
                      style={{ "--wave-index": index }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        id={makeId("experience")}
        data-snap-section="true"
        data-wave-section="true"
        className={`wave-section ${sectionShellClass} section-space motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("experiences")}
      >
        {renderSectionTitle(labels.exp)}
        {experiences.length > 0 ? (
          <div className={`wave-item relative mt-8 w-full pl-0 ${heroFullscreen ? "mx-auto max-w-3xl" : ""}`} style={{ "--wave-delay": "90ms" }}>
            <div className="space-y-8">
              {experiences.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className="timeline-item wave-subitem relative grid grid-cols-[24px_1fr] gap-5 md:gap-6"
                  style={{ "--wave-index": index }}
                >
                  <div className="timeline-axis relative self-stretch">
                    {index > 0 && (
                      <span className="timeline-link absolute left-1/2 top-[-2rem] h-[49px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                    )}
                    {index < experiences.length - 1 && (
                      <span className="timeline-link absolute bottom-[-2rem] left-1/2 top-[17px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                    )}
                    <span className="timeline-dot absolute left-1/2 top-[10px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[rgba(154,158,168,0.38)] bg-[rgba(255,255,255,0.42)]" />
                  </div>
                  <div className="min-w-0">
                    {item.period && (
                      <p className="mb-2 whitespace-nowrap text-base font-semibold tracking-[0.02em] text-[var(--muted)] md:text-lg">
                        {item.period}
                      </p>
                    )}
                    <article className="timeline-card motion-card soft-panel rounded-xl p-5" tabIndex={0}>
                      <h3 className="text-xl font-medium">
                        {item.role || labels.role} {item.company ? `· ${item.company}` : ""}
                      </h3>
                      <p className="mt-2 text-[var(--muted)]">{item.detail}</p>
                    </article>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="wave-item mt-6 text-[var(--muted)]" style={{ "--wave-delay": "90ms" }}>{labels.noExp}</p>
        )}
      </div>

      {awardsMediaItems.length > 0 && (
        <div
          id={makeId("awards")}
          data-snap-section="true"
          data-wave-section="true"
          className={`wave-section ${sectionShellClass} section-space motion-fade ${getJumpableClass()}`}
          onClick={() => jumpToEditor("awards")}
        >
          {renderSectionTitle(labels.awards)}
          <div className={heroFullscreen ? "awards-carousel-breakout" : ""}>
            <div className="wave-item mt-10 w-full" style={{ "--wave-delay": "90ms" }}>
              <ArcMediaCarousel
                items={awardsMediaItems}
                variant={heroFullscreen ? "wide" : "default"}
                className={`awards-arc-carousel ${heroFullscreen ? "awards-arc-carousel--fullscreen h-[360px] md:h-[460px]" : "h-[280px] md:h-[360px]"}`}
              />
            </div>
          </div>
        </div>
      )}

      <div
        id={makeId("projects")}
        data-snap-section="true"
        data-wave-section="true"
        className={`wave-section ${sectionShellClass} section-space motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("projects")}
      >
        {renderSectionTitle(labels.projects)}
        {projectItems.length > 0 ? (
          <div className={`wave-item relative mt-8 w-full pl-0 ${heroFullscreen ? "mx-auto max-w-3xl" : ""}`} style={{ "--wave-delay": "90ms" }}>
            <div className="space-y-8">
              {projectItems.map((project, index) => {
                const expanded = Boolean(expandedProjectMap[index]);
                return (
                  <div
                    key={`${project.title}-${index}`}
                    className="timeline-item wave-subitem relative grid grid-cols-[24px_1fr] gap-5 md:gap-6"
                    style={{ "--wave-index": index }}
                  >
                    <div className="timeline-axis relative self-stretch">
                      {index > 0 && (
                        <span className="timeline-link absolute left-1/2 top-[-2rem] h-[49px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                      )}
                      {index < projectItems.length - 1 && (
                        <span className="timeline-link absolute bottom-[-2rem] left-1/2 top-[17px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                      )}
                      <span className="timeline-dot absolute left-1/2 top-[10px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[rgba(154,158,168,0.38)] bg-[rgba(255,255,255,0.42)]" />
                    </div>
                    <div className="min-w-0">
                      {project.period && (
                        <p className="mb-2 whitespace-nowrap text-base font-semibold tracking-[0.02em] text-[var(--muted)] md:text-lg">
                          {project.period}
                        </p>
                      )}
                      <article className="project-timeline-card timeline-card relative motion-card soft-panel rounded-xl p-5" tabIndex={0}>
                        <div className={`grid gap-4 ${project.media ? "md:grid-cols-[180px_1fr]" : "grid-cols-1"}`}>
                          {project.media && (
                            <div className="project-media-frame soft-panel h-[180px] w-[180px] self-start overflow-hidden rounded-lg">
                              {project.media.type === "image" ? (
                                <Image
                                  src={project.media.url}
                                  alt={project.media.name || "project media"}
                                  width={640}
                                  height={400}
                                  unoptimized
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <video controls className="h-full w-full object-cover">
                                  <source src={project.media.url} />
                                </video>
                              )}
                            </div>
                          )}

                          <div className="relative pb-12">
                            <h3 className="text-xl font-semibold">{project.title || labels.project}</h3>
                            {project.subtitle && <p className="mt-1 text-sm text-[var(--muted)]">{project.subtitle}</p>}
                            {project.summary && <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{project.summary}</p>}

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleProjectDetails(index);
                              }}
                              className="absolute bottom-0 right-0 inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs tracking-[0.12em] text-[var(--muted)] transition hover:text-[var(--text)]"
                            >
                              {expanded ? (lang === "en" ? "HIDE" : "收起") : lang === "en" ? "DETAILS" : "详情"}
                              <ChevronIcon expanded={expanded} />
                            </button>
                          </div>
                        </div>

                        <div className={expanded ? "project-detail-expanded" : "project-detail-collapsed"}>
                          <div className="mt-4 border-t pt-4">
                            <p className="indent-8 text-sm leading-8 text-[var(--muted)]">
                              {project.details || project.summary || ""}
                            </p>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="wave-item text-[var(--muted)]" style={{ "--wave-delay": "90ms" }}>{labels.noProject}</p>
        )}
      </div>

      {customSections
        .filter((section) => section.title.trim() || section.content.trim() || section.mediaItems.length > 0)
        .map((section, sectionIndex) => (
          <div
            key={`custom-${sectionIndex}`}
            id={sectionIndex === 0 ? makeId("custom") : undefined}
            data-snap-section="true"
            data-wave-section="true"
            className={`wave-section ${customSectionShellClass} section-space motion-fade ${getJumpableClass()}`}
            onClick={() => jumpToEditor("customSections")}
          >
            {renderSectionTitle(section.title || (lang === "en" ? "Custom Section" : "自定义板块"))}
            {section.content && (
              <p className="wave-item section-copy section-copy-centered mt-6" style={{ "--wave-delay": "90ms" }}>
                {section.content}
              </p>
            )}

            {section.mediaItems.length > 0 && (
              <>
                {(() => {
                  const imageCards = section.mediaItems
                    .filter((item) => item.type === "image" && item.url)
                    .map((item, mediaIndex) => ({
                      id: `${item.name || "custom"}-${mediaIndex}`,
                      image: item.url,
                      title: item.name || "",
                    }));
                  const videoItems = section.mediaItems.filter((item) => item.type !== "image" && item.url);

                  return (
                    <>
                      {imageCards.length > 0 && (
                        <div className="wave-item custom-media-breakout mt-8" style={{ "--wave-delay": "120ms" }}>
                          <CardStack cards={imageCards} maxVisible={4} />
                        </div>
                      )}

                      {videoItems.length > 0 && (
                        <div className="wave-item custom-media-breakout mt-8 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ "--wave-delay": "140ms" }}>
                          {videoItems.map((item, mediaIndex) => (
                            <article
                              key={`${item.name || "video"}-${mediaIndex}`}
                              className="wave-subitem motion-card soft-panel min-w-[320px] max-w-[480px] flex-1 snap-start overflow-hidden rounded-xl"
                              style={{ "--wave-index": mediaIndex }}
                            >
                              <video controls className="aspect-[4/3] w-full object-cover">
                                <source src={item.url} />
                              </video>
                            </article>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        ))}

      <div
        id={makeId("link")}
        data-snap-section="true"
        data-wave-section="true"
        className={`wave-section ${sectionShellClass} section-space pb-4 motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("about")}
      >
        {renderSectionTitle(labels.letsTalk)}
        <p className="wave-item mt-5 text-center text-xl tracking-[0.03em] text-[var(--muted)]" style={{ "--wave-delay": "90ms" }}>{data.profileEmail || data.email || ""}</p>
        <form
          onSubmit={onSendMessage}
          className={`wave-item mt-7 w-full space-y-3 ${heroFullscreen ? "mx-auto md:w-2/3 md:max-w-3xl" : ""}`}
          style={{ "--wave-delay": "120ms" }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={talkName}
              onChange={(event) => setTalkName(event.target.value)}
              placeholder={labels.namePlaceholder}
              className="w-full rounded-2xl border bg-transparent px-4 py-3 text-[var(--text)] outline-none placeholder:text-[var(--muted)]/75"
            />
            <input
              type="email"
              value={talkEmail}
              onChange={(event) => setTalkEmail(event.target.value)}
              placeholder={labels.emailPlaceholder}
              className="w-full rounded-2xl border bg-transparent px-4 py-3 text-[var(--text)] outline-none placeholder:text-[var(--muted)]/75"
            />
          </div>
          <textarea
            value={talkMessage}
            onChange={(event) => setTalkMessage(event.target.value)}
            placeholder={labels.messagePlaceholder}
            rows={5}
            className="w-full rounded-2xl border bg-transparent px-4 py-3 text-[var(--text)] outline-none placeholder:text-[var(--muted)]/75"
          />
          <button
            type="submit"
            className="w-full rounded-2xl border bg-[var(--text)] px-4 py-3 text-sm tracking-[0.08em] text-[var(--on-accent)] transition hover:opacity-90"
          >
            {labels.send}
          </button>
        </form>
      </div>

    </section>
  );
}
