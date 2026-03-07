function splitItems(text = "", pattern = /[\n,，]/) {
  return String(text)
    .split(pattern)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePipeRows(text = "", columns = 4) {
  return String(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((item) => item.trim());
      while (parts.length < columns) parts.push("");
      return parts.slice(0, columns);
    });
}

function PreviewSection({ title, hint, actionLabel, onAction, children }) {
  return (
    <section className="editor-preview-card">
      <div className="editor-preview-card-head">
        <div>
          <p className="editor-preview-card-title">{title}</p>
          {hint ? <p className="editor-preview-card-hint">{hint}</p> : null}
        </div>
        {actionLabel && onAction ? (
          <button type="button" onClick={onAction} className="editor-preview-link">
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function MediaList({ title, items = [], emptyText, lang }) {
  return (
    <article className="editor-preview-stat">
      <p className="editor-preview-fact-label">{title}</p>
      <p className="editor-preview-stat-value">
        {items.length} {lang === "en" ? "items" : "项"}
      </p>
      {items.length ? (
        <div className="editor-preview-media-list">
          {items.map((item, index) => (
            <span key={`${item.name || item.url}-${index}`} className="editor-preview-mini-chip">
              {(item.type === "video" ? (lang === "en" ? "Video" : "视频") : lang === "en" ? "Image" : "图片")}
              {item.name ? ` · ${item.name}` : ""}
            </span>
          ))}
        </div>
      ) : (
        <p className="editor-preview-empty-copy">{emptyText}</p>
      )}
    </article>
  );
}

export default function EditorPreviewPanel({ data, lang = "zh", onSectionNavigate }) {
  const labels =
    lang === "en"
      ? {
          eyebrow: "Editor Preview",
          title: "Share Page Summary",
          hint: "A compact content preview aligned with the published page sections.",
          jump: "Edit",
          heroTitle: "Hero",
          heroHint: "Opening screen content.",
          profileTitle: "Profile",
          profileHint: "About and key facts.",
          experienceTitle: "Experience",
          experienceHint: "Recent roles and summaries.",
          projectTitle: "Projects",
          projectHint: "Project cards and media status.",
          awardsTitle: "Banner",
          awardsHint: "Banner assets and summary information.",
          customTitle: "Custom Sections",
          customHint: "Extra modules and attached content.",
          heroMedia: "Hero Media",
          aboutMedia: "About Image",
          awardsMedia: "Carousel Media",
          interactionAudio: "Interaction Voice",
          emptyMedia: "No media selected",
          emptyProjects: "No project entries yet",
          emptyAwards: "No awards yet",
          emptyCustom: "No custom sections yet",
          position: "Position",
          email: "Email",
          attachedMedia: "Attached media",
        }
      : {
          eyebrow: "编辑预览",
          title: "右侧查看对应分享页的精简预览",
          hint: "这里只展示分享页对应的信息结构，便于快速核对，不再放大显示媒体图片。",
          jump: "定位编辑项",
          heroTitle: "首页信息",
          heroHint: "分享页首屏展示的姓名、定位语和简介。",
          profileTitle: "个人信息",
          profileHint: "About 区域和补充信息。",
          experienceTitle: "经历",
          experienceHint: "最近经历与概要描述。",
          projectTitle: "项目",
          projectHint: "项目卡片内容与媒体挂载状态。",
          awardsTitle: "Banner",
          awardsHint: "Banner 素材数量与摘要。",
          customTitle: "自定义板块",
          customHint: "补充模块与关联媒体情况。",
          heroMedia: "顶部媒体",
          aboutMedia: "关于我图片",
          awardsMedia: "轮播素材",
          interactionAudio: "互动语音",
          emptyMedia: "暂未选择媒体",
          emptyProjects: "还没有项目条目",
          emptyAwards: "还没有荣誉内容",
          emptyCustom: "还没有自定义板块",
          position: "职业",
          email: "邮箱",
          attachedMedia: "关联媒体",
        };

  const experiences = parsePipeRows(data.experiences, 4).slice(0, 4);
  const awards = parsePipeRows(data.awards, 4).slice(0, 4);
  const skills = splitItems(data.skills).slice(0, 8);
  const projects = Array.isArray(data.projectItems)
    ? data.projectItems.filter((item) => item?.title || item?.summary || item?.details).slice(0, 4)
    : [];
  const customSections = Array.isArray(data.customSections)
    ? data.customSections.filter((section) => section?.title || section?.content || section?.mediaItems?.length).slice(0, 3)
    : [];
  const mainMedia = Array.isArray(data.mediaItems) ? data.mediaItems.slice(0, 5) : [];
  const aboutMedia = data.aboutMedia ? [data.aboutMedia] : [];
  const interactionAudio = data.interactionAudio || null;

  const profileItems = [
    { label: labels.position, value: data.profilePosition },
    { label: labels.email, value: data.profileEmail },
    { label: data.profileCustom1Title, value: data.profileCustom1Value },
    { label: data.profileCustom2Title, value: data.profileCustom2Value },
    { label: data.profileCustom3Title, value: data.profileCustom3Value },
  ].filter((item) => item.label && item.value);

  return (
    <div className="editor-preview-shell">
      <div className="editor-preview-header">
        <div>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h2 className="editor-preview-heading">{labels.title}</h2>
        </div>
        <p className="editor-preview-note">{labels.hint}</p>
      </div>

      <div className="editor-preview-scroll">
        <PreviewSection
          title={labels.heroTitle}
          hint={labels.heroHint}
          actionLabel={labels.jump}
          onAction={() => onSectionNavigate?.("basic")}
        >
          <div className="editor-preview-stack">
            <article className="editor-preview-list-item">
              <h3 className="editor-preview-name editor-preview-name--compact">{data.name || "Your Name"}</h3>
              <p className="editor-preview-tagline">{data.tagline || data.profilePosition || ""}</p>
              <p className="editor-preview-body">{data.about || ""}</p>
            </article>

            <div className="editor-preview-meta-grid">
              <MediaList title={labels.heroMedia} items={mainMedia} emptyText={labels.emptyMedia} lang={lang} />
              <MediaList title={labels.aboutMedia} items={aboutMedia} emptyText={labels.emptyMedia} lang={lang} />
            </div>
            {interactionAudio ? (
              <div className="mt-3">
                <span className="editor-preview-mini-chip">
                  {labels.interactionAudio}
                  {interactionAudio.name ? ` · ${interactionAudio.name}` : ""}
                  {interactionAudio.duration ? ` · ${Number(interactionAudio.duration).toFixed(1)}s` : ""}
                </span>
              </div>
            ) : null}
          </div>
        </PreviewSection>

        <PreviewSection
          title={labels.profileTitle}
          hint={labels.profileHint}
          actionLabel={labels.jump}
          onAction={() => onSectionNavigate?.("about")}
        >
          <div className="editor-preview-facts">
            {profileItems.map((item) => (
              <div key={`${item.label}-${item.value}`} className="editor-preview-fact">
                <p className="editor-preview-fact-label">{item.label}</p>
                <p className="editor-preview-fact-value">{item.value}</p>
              </div>
            ))}
            {skills.length > 0 ? (
              <div className="editor-preview-skill-wrap">
                {skills.map((skill) => (
                  <span key={skill} className="editor-preview-chip">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </PreviewSection>

        <PreviewSection
          title={labels.experienceTitle}
          hint={labels.experienceHint}
          actionLabel={labels.jump}
          onAction={() => onSectionNavigate?.("experiences")}
        >
          <div className="editor-preview-stack">
            {experiences.map(([period, role, company, detail], index) => (
              <article key={`${period}-${role}-${index}`} className="editor-preview-list-item">
                <p className="editor-preview-item-period">{period}</p>
                <h4 className="editor-preview-item-title">
                  {role}
                  {company ? ` · ${company}` : ""}
                </h4>
                <p className="editor-preview-item-body">{detail}</p>
              </article>
            ))}
          </div>
        </PreviewSection>

        <PreviewSection
          title={labels.projectTitle}
          hint={labels.projectHint}
          actionLabel={labels.jump}
          onAction={() => onSectionNavigate?.("projects")}
        >
          {projects.length > 0 ? (
            <div className="editor-preview-project-grid">
              {projects.map((project, index) => (
                <article key={`${project.title}-${index}`} className="editor-preview-project-card">
                  <div className="editor-preview-project-head">
                    <div className="min-w-0">
                      <p className="editor-preview-item-period">{project.period}</p>
                      <h4 className="editor-preview-item-title">{project.title}</h4>
                    </div>
                    {project.media ? (
                      <span className="editor-preview-mini-chip">
                        {labels.attachedMedia} · {project.media.type === "video" ? (lang === "en" ? "Video" : "视频") : lang === "en" ? "Image" : "图片"}
                      </span>
                    ) : null}
                  </div>
                  {project.subtitle ? <p className="editor-preview-project-subtitle">{project.subtitle}</p> : null}
                  <p className="editor-preview-item-body">{project.summary || project.details}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="editor-preview-empty">{labels.emptyProjects}</div>
          )}
        </PreviewSection>

        <PreviewSection
          title={labels.awardsTitle}
          hint={labels.awardsHint}
          actionLabel={labels.jump}
          onAction={() => onSectionNavigate?.("awards")}
        >
          <div className="editor-preview-awards">
            <MediaList title={labels.awardsMedia} items={mainMedia} emptyText={labels.emptyMedia} lang={lang} />
            {awards.length > 0 ? (
              <div className="editor-preview-stack">
                {awards.map(([period, title, issuer, detail], index) => (
                  <article key={`${period}-${title}-${index}`} className="editor-preview-list-item">
                    <p className="editor-preview-item-period">{period}</p>
                    <h4 className="editor-preview-item-title">
                      {title}
                      {issuer ? ` · ${issuer}` : ""}
                    </h4>
                    <p className="editor-preview-item-body">{detail}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="editor-preview-empty">{labels.emptyAwards}</div>
            )}
          </div>
        </PreviewSection>

        <PreviewSection
          title={labels.customTitle}
          hint={labels.customHint}
          actionLabel={labels.jump}
          onAction={() => onSectionNavigate?.("customSections")}
        >
          {customSections.length > 0 ? (
            <div className="editor-preview-stack">
              {customSections.map((section, index) => (
                <article key={`${section.title}-${index}`} className="editor-preview-list-item">
                  <div className="editor-preview-project-head">
                    <h4 className="editor-preview-item-title">{section.title}</h4>
                    {section.mediaItems?.length ? (
                      <span className="editor-preview-mini-chip">
                        {labels.attachedMedia} · {section.mediaItems.length}
                      </span>
                    ) : null}
                  </div>
                  <p className="editor-preview-item-body">{section.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="editor-preview-empty">{labels.emptyCustom}</div>
          )}
        </PreviewSection>
      </div>
    </div>
  );
}
