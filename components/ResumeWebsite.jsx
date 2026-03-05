import Image from "next/image";
import { useRef, useState } from "react";
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

export default function ResumeWebsite({ data, lang = "zh", onSectionNavigate }) {
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
  const mediaItems = Array.isArray(data.mediaItems) ? data.mediaItems.slice(0, 6) : [];
  const customSections = Array.isArray(data.customSections) ? data.customSections : [];

  const labels =
    lang === "en"
      ? {
          about: "About",
          exp: "Experience",
          skills: "Skills",
          awards: "Awards & Honors",
          projects: "Projects",
          contact: "Contact",
          noExp: "No experience added yet.",
          noProject: "No projects added yet.",
          noAwards: "No awards added yet.",
          tagline: "Your positioning tagline",
          intro: "Introduce yourself here.",
          role: "Role",
          project: "Project",
        }
      : {
          about: "关于我",
          exp: "工作经历",
          skills: "技能",
          awards: "奖项与荣誉",
          projects: "项目经历",
          contact: "联系方式",
          noExp: "暂未添加工作经历。",
          noProject: "暂未添加项目。",
          noAwards: "暂未添加奖项与荣誉。",
          tagline: "你的个人定位语",
          intro: "请填写自我介绍。",
          role: "职位",
          project: "项目",
        };

  const [expandedProjectMap, setExpandedProjectMap] = useState({});
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [hoveredMediaIndex, setHoveredMediaIndex] = useState(null);
  const mediaTrackRef = useRef(null);
  const canJumpToEditor = typeof onSectionNavigate === "function";

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

  return (
    <section className="rounded-2xl border bg-[var(--panel)] p-6 md:p-10 motion-fade">
      <header
        className={`border-b pb-10 ${getJumpableClass()}`}
        onClick={() => jumpToEditor("basic")}
      >
        <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">{data.name || "Your Name"}</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{data.tagline || labels.tagline}</p>

        {mediaItems.length > 0 && (
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
                      className={`motion-card min-w-[240px] md:min-w-[320px] max-w-[360px] flex-1 snap-center overflow-hidden rounded-xl border bg-[var(--bg)] shadow-none transition-opacity duration-500 hover:shadow-none ${emphasisClass}`}
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
        className={`section-space border-b motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("about")}
      >
        <h2 className="section-title">{labels.about}</h2>
        <p className="section-copy mt-6">{data.about || labels.intro}</p>
      </div>

      {skills.length > 0 && (
        <div
          className={`section-space border-b motion-fade ${getJumpableClass()}`}
          onClick={() => jumpToEditor("skills")}
        >
          <h2 className="section-title">{labels.skills}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className="motion-card rounded-full border bg-[var(--bg)] px-4 py-2 text-sm text-[var(--muted)]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className={`section-space border-b motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("experiences")}
      >
        <h2 className="section-title">{labels.exp}</h2>
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
                    <article className="timeline-card motion-card rounded-xl border bg-[var(--bg)] p-5" tabIndex={0}>
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
          className={`section-space border-b motion-fade ${getJumpableClass()}`}
          onClick={() => jumpToEditor("awards")}
        >
          <h2 className="section-title">{labels.awards}</h2>
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
                    <article className="timeline-card motion-card rounded-xl border bg-[var(--bg)] p-5" tabIndex={0}>
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
        className={`section-space border-b motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("projects")}
      >
        <h2 className="section-title">{labels.projects}</h2>
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
                      <article className="project-timeline-card timeline-card relative motion-card rounded-xl border bg-[var(--bg)] p-5" tabIndex={0}>
                        <div className={`grid gap-4 ${project.media ? "md:grid-cols-[180px_1fr]" : "grid-cols-1"}`}>
                          {project.media && (
                            <div className="project-media-frame h-[180px] w-[180px] self-start overflow-hidden rounded-lg border bg-[var(--panel)]">
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
            className={`section-space border-b motion-fade ${getJumpableClass()}`}
            onClick={() => jumpToEditor("customSections")}
          >
            <h2 className="section-title">{section.title || (lang === "en" ? "Custom Section" : "自定义板块")}</h2>
            {section.content && <p className="section-copy mt-6">{section.content}</p>}

            {section.mediaItems.length > 0 && (
              <div className="mt-8 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                {section.mediaItems.map((item, mediaIndex) => (
                  <article
                    key={`${item.name}-${mediaIndex}`}
                    className="motion-card min-w-[300px] max-w-[360px] flex-1 snap-start overflow-hidden rounded-xl border bg-[var(--bg)]"
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
        className={`section-space pb-0 motion-fade ${getJumpableClass()}`}
        onClick={() => jumpToEditor("contact")}
      >
        <h2 className="section-title">{labels.contact}</h2>
        <div className="mt-8 grid gap-3 md:max-w-2xl">
          <a href={`mailto:${data.email}`} onClick={(event) => event.stopPropagation()} className="motion-card rounded-xl border px-4 py-3 text-[var(--muted)]">
            Email · {data.email}
          </a>
          <a href={data.github} onClick={(event) => event.stopPropagation()} target="_blank" rel="noreferrer" className="motion-card rounded-xl border px-4 py-3 text-[var(--muted)]">
            GitHub · {data.github}
          </a>
          <a href={data.linkedin} onClick={(event) => event.stopPropagation()} target="_blank" rel="noreferrer" className="motion-card rounded-xl border px-4 py-3 text-[var(--muted)]">
            LinkedIn · {data.linkedin}
          </a>
        </div>
      </div>
    </section>
  );
}
