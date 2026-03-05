import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { parseItems } from "../utils/resumeTransform";

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

function buildHeroArcMedia(items, count = 5) {
  if (!Array.isArray(items) || items.length === 0) return [];
  return Array.from({ length: count }, (_, index) => {
    const source = items[index % items.length];
    return {
      ...source,
      _arcId: `arc-${index}`,
    };
  });
}

export default function ResumeWebsite({
  data,
  lang = "zh",
  onSectionNavigate,
  sectionIdPrefix = "",
  centeredSectionTitles = false,
  heroFullscreen = false,
}) {
  const experiences = parseItems(data.experiences, ["period", "role", "company", "detail"]);
  const awards = parseItems(data.awards, ["period", "title", "issuer", "detail"]);
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
  const aboutImage = mediaItems.find((item) => item.type === "image");
  const customSections = Array.isArray(data.customSections) ? data.customSections : [];

  const labels =
    lang === "en"
      ? {
          about: "About",
          exp: "Experience",
          skills: "Skills",
          awards: "Awards & Honors",
          projects: "Projects",
          noExp: "No experience added yet.",
          noProject: "No projects added yet.",
          noAwards: "No awards added yet.",
          tagline: "Your positioning tagline",
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
          awards: "奖项与荣誉",
          projects: "项目经历",
          noExp: "暂未添加工作经历。",
          noProject: "暂未添加项目。",
          noAwards: "暂未添加奖项与荣誉。",
          tagline: "你的个人定位语",
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
  const [heroArcAnim, setHeroArcAnim] = useState({ step: 0, phase: 0, flipping: false });
  const [talkName, setTalkName] = useState("");
  const [talkEmail, setTalkEmail] = useState("");
  const [talkMessage, setTalkMessage] = useState("");
  const mediaTrackRef = useRef(null);
  const canJumpToEditor = typeof onSectionNavigate === "function";
  const makeId = (key) => (sectionIdPrefix ? `${sectionIdPrefix}-${key}` : undefined);

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
    if (!centeredSectionTitles) {
      return <h2 className="section-title">{title}</h2>;
    }
    return <h2 className="section-title text-center">{title}</h2>;
  };

  const profileRows = [
    { label: "POSITION", value: data.profilePosition || "" },
    { label: "TIME", value: data.profileWorkYears || "" },
    { label: "AGE", value: data.profileAge || "" },
    { label: "TEL", value: data.profilePhone || "" },
    { label: "EMAIL", value: data.profileEmail || data.email || "" },
    { label: (data.profileExtraTitle || "").toUpperCase(), value: data.profileExtraValue || "" },
  ].filter((row) => row.label && row.value);
  const heroName = data.name || "Your Name";
  const heroTitle = lang === "en" ? `Hi, I'm ${heroName}` : `Hi, I'm ${heroName}`;
  const heroArcMedia = useMemo(() => buildHeroArcMedia(mediaItems, 6), [mediaItems]);
  const heroArcLayout = useMemo(() => {
    if (!heroArcMedia.length) return [];
    const total = heroArcMedia.length;
    const shift = heroArcAnim.step + heroArcAnim.phase;
    return heroArcMedia.map((item, index) => {
      let relative = index - shift;
      while (relative < -3.1) relative += total;
      while (relative > 3.1) relative -= total;
      const absRelative = Math.abs(relative);
      const x = relative * 242;
      const y = -136 + Math.pow(absRelative, 2) * 30;
      const scale = Math.max(0.74, 1.08 - absRelative * 0.19);
      const rotate = relative * 11;
      const opacity =
        absRelative > 2.25
          ? Math.max(0, 0.6 - (absRelative - 2.25) * 1.35)
          : Math.max(0.6, 1 - absRelative * 0.18);
      const zIndex = Math.round(120 - absRelative * 36);
      return {
        ...item,
        _layout: { x, y, scale, rotate, opacity, zIndex, absRelative },
      };
    });
  }, [heroArcMedia, heroArcAnim.step, heroArcAnim.phase]);

  useEffect(() => {
    if (!heroFullscreen || heroArcMedia.length === 0) return undefined;
    let rafId = 0;
    let lastPaint = 0;
    const moveMs = 2400;
    const flipHoldMs = 1000;
    const cycleMs = moveMs + flipHoldMs;
    const start = performance.now();
    const update = (now) => {
      if (now - lastPaint >= 40) {
        const elapsedMs = now - start;
        const cycleIndex = Math.floor(elapsedMs / cycleMs);
        const cycleElapsed = elapsedMs % cycleMs;
        if (cycleElapsed < moveMs) {
          setHeroArcAnim({
            step: cycleIndex % heroArcMedia.length,
            phase: cycleElapsed / moveMs,
            flipping: false,
          });
        } else {
          setHeroArcAnim({
            step: cycleIndex % heroArcMedia.length,
            phase: 1,
            flipping: true,
          });
        }
        lastPaint = now;
      }
      rafId = window.requestAnimationFrame(update);
    };
    rafId = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(rafId);
  }, [heroFullscreen, heroArcMedia.length]);

  return (
    <section className="p-6 md:p-10 motion-fade">
      <header
        id={makeId("home")}
        className={`${heroFullscreen ? "relative flex min-h-[86vh] flex-col items-center justify-center overflow-hidden pb-0 text-center" : "pb-10"} ${getJumpableClass()}`}
        onClick={() => jumpToEditor("basic")}
      >
        {heroFullscreen && heroArcLayout.length > 0 && (
          <div className="hero-arc-stage pointer-events-none absolute inset-0 hidden md:block">
            {heroArcLayout.map((item) => {
              return (
                <div
                  key={item._arcId}
                  className={`hero-arc-card ${heroArcAnim.flipping ? "hero-arc-card--flip-all" : ""}`}
                  style={{
                    transform: `translate3d(${item._layout.x}px, ${item._layout.y}px, 0) scale(${item._layout.scale}) rotate(${item._layout.rotate}deg)`,
                    opacity: item._layout.opacity,
                    zIndex: item._layout.zIndex,
                  }}
                >
                  <div className="hero-arc-media">
                    {item.type === "image" ? (
                      <Image
                        src={item.url}
                        alt={item.name || "hero media"}
                        fill
                        sizes="150px"
                        unoptimized
                        className="hero-arc-media-inner"
                      />
                    ) : (
                      <video autoPlay loop muted playsInline className="hero-arc-media-inner">
                        <source src={item.url} />
                      </video>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h1 className={`${heroFullscreen ? "max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl" : "text-5xl font-semibold tracking-tight md:text-7xl"}`}>
          {heroFullscreen ? heroTitle : heroName}
        </h1>
        <p className="mt-4 text-lg font-light tracking-[0.01em] text-[var(--muted)]">{data.tagline || labels.tagline}</p>

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

      <div
        id={makeId("about")}
        className={`section-space motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("about")}
      >
        {renderSectionTitle(labels.about)}
        <div className="mt-7 grid gap-8 md:grid-cols-[260px_1fr] md:items-center">
          <div className="mx-auto w-full max-w-[260px]">
            <div className="soft-panel overflow-hidden rounded-3xl p-2">
              {aboutImage ? (
                <Image
                  src={aboutImage.url}
                  alt={aboutImage.name || "profile"}
                  width={480}
                  height={520}
                  unoptimized
                  className="h-[300px] w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-2xl bg-[var(--panel)] text-sm text-[var(--muted)]">
                  Portrait
                </div>
              )}
            </div>
          </div>

          <div className="self-center">
            {profileRows.length > 0 && (
              <div id={makeId("profile")} className="mt-0 grid gap-3 text-[1.02rem] text-[var(--text)]">
                {profileRows.map((row) => (
                  <p key={row.label} id={row.label === "EMAIL" ? makeId("email") : undefined} className="tracking-[0.01em]">
                    <span className="mr-2 font-semibold">{row.label}:</span>
                    <span className="text-[var(--muted)]">{row.value}</span>
                  </p>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <div id={makeId("skills")} className="mt-8">
                <h3 className="text-2xl font-semibold">{labels.skills}</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <span key={`${skill}-${index}`} className="motion-card soft-pill rounded-full px-4 py-2 text-sm text-[var(--muted)]">
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
        className={`section-space motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("experiences")}
      >
        {renderSectionTitle(labels.exp)}
        {experiences.length > 0 ? (
          <div className="relative mt-8 pl-0">
            <div className="space-y-8">
              {experiences.map((item, index) => (
                <div key={`${item.role}-${index}`} className="timeline-item relative grid grid-cols-[24px_1fr] gap-5 md:gap-6">
                  <div className="timeline-axis relative self-stretch">
                    {index > 0 && (
                      <span className="timeline-link absolute left-1/2 top-[-2rem] h-[49px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                    )}
                    {index < experiences.length - 1 && (
                      <span className="timeline-link absolute bottom-[-2rem] left-1/2 top-[17px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                    )}
                    <span className="timeline-dot absolute left-1/2 top-[10px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[var(--line)] bg-[var(--panel)]" />
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
          <p className="mt-6 text-[var(--muted)]">{labels.noExp}</p>
        )}
      </div>

      {awards.length > 0 && (
        <div
          id={makeId("awards")}
          className={`section-space motion-fade ${getJumpableClass()}`}
          onClick={() => jumpToEditor("awards")}
        >
          {renderSectionTitle(labels.awards)}
          <div className="relative mt-8 pl-0">
            <div className="space-y-8">
              {awards.map((item, index) => (
                <div key={`${item.title}-${index}`} className="timeline-item relative grid grid-cols-[24px_1fr] gap-5 md:gap-6">
                  <div className="timeline-axis relative self-stretch">
                    {index > 0 && (
                      <span className="timeline-link absolute left-1/2 top-[-2rem] h-[49px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                    )}
                    {index < awards.length - 1 && (
                      <span className="timeline-link absolute bottom-[-2rem] left-1/2 top-[17px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                    )}
                    <span className="timeline-dot absolute left-1/2 top-[10px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[var(--line)] bg-[var(--panel)]" />
                  </div>
                  <div className="min-w-0">
                    {item.period && (
                      <p className="mb-2 whitespace-nowrap text-base font-semibold tracking-[0.02em] text-[var(--muted)] md:text-lg">
                        {item.period}
                      </p>
                    )}
                    <article className="timeline-card motion-card soft-panel rounded-xl p-5" tabIndex={0}>
                      <h3 className="text-xl font-medium">{item.title}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{item.issuer}</p>
                      <p className="mt-2 text-[var(--muted)]">{item.detail}</p>
                    </article>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        id={makeId("projects")}
        className={`section-space motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("projects")}
      >
        {renderSectionTitle(labels.projects)}
        {projectItems.length > 0 ? (
          <div className="relative mt-8 pl-0">
            <div className="space-y-8">
              {projectItems.map((project, index) => {
                const expanded = Boolean(expandedProjectMap[index]);
                return (
                  <div key={`${project.title}-${index}`} className="timeline-item relative grid grid-cols-[24px_1fr] gap-5 md:gap-6">
                    <div className="timeline-axis relative self-stretch">
                      {index > 0 && (
                        <span className="timeline-link absolute left-1/2 top-[-2rem] h-[49px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                      )}
                      {index < projectItems.length - 1 && (
                        <span className="timeline-link absolute bottom-[-2rem] left-1/2 top-[17px] w-px -translate-x-1/2 border-l border-dashed border-[var(--line)]" />
                      )}
                      <span className="timeline-dot absolute left-1/2 top-[10px] h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-[var(--line)] bg-[var(--panel)]" />
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
          <p className="text-[var(--muted)]">{labels.noProject}</p>
        )}
      </div>

      {customSections
        .filter((section) => section.title.trim() || section.content.trim() || section.mediaItems.length > 0)
        .map((section, sectionIndex) => (
          <div
            key={`custom-${sectionIndex}`}
            id={sectionIndex === 0 ? makeId("custom") : undefined}
            className={`section-space motion-fade ${getJumpableClass()}`}
            onClick={() => jumpToEditor("customSections")}
          >
            {renderSectionTitle(section.title || (lang === "en" ? "Custom Section" : "自定义板块"))}
            {section.content && <p className="section-copy mt-6">{section.content}</p>}

            {section.mediaItems.length > 0 && (
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                {section.mediaItems.map((item, mediaIndex) => (
                  <article
                    key={`${item.name}-${mediaIndex}`}
                    className="motion-card soft-panel min-w-[300px] max-w-[360px] flex-1 snap-start overflow-hidden rounded-xl"
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.url}
                        alt={item.name || "custom media"}
                        width={700}
                        height={420}
                        unoptimized
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <video controls className="h-52 w-full object-cover">
                        <source src={item.url} />
                      </video>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        ))}

      <div
        id={makeId("link")}
        className={`section-space pb-4 motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("about")}
      >
        {renderSectionTitle(labels.letsTalk)}
        <p className="mt-5 text-center text-xl tracking-[0.03em] text-[var(--muted)]">{data.profileEmail || data.email || ""}</p>
        <form onSubmit={onSendMessage} className="mx-auto mt-7 w-full space-y-3 md:w-2/3 md:max-w-3xl" onClick={(event) => event.stopPropagation()}>
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
            className="w-full rounded-2xl border bg-[var(--text)] px-4 py-3 text-sm tracking-[0.08em] text-[var(--bg)] transition hover:opacity-90"
          >
            {labels.send}
          </button>
        </form>
      </div>

    </section>
  );
}
