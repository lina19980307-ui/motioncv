import Reveal from "../Reveal";

const items = [
  {
    role: "Featured Performer",
    company: "Studio Residency",
    period: "2024 - Present",
    detail: "负责现场内容编排、媒体发布节奏与阶段性作品展示。",
  },
  {
    role: "Creative Collaborator",
    company: "Independent Project",
    period: "2022 - 2024",
    detail: "围绕视觉内容、演出片段与作品传播做协作开发与展示。",
  },
  {
    role: "Project Builder",
    company: "Sample Portfolio",
    period: "2020 - 2022",
    detail: "整理公开作品、模块化信息与交互体验，形成完整展示页面。",
  },
];

export default function Experience() {
  return (
    <section className="section-space border-b" id="experience">
      <Reveal>
        <h2 className="section-title">Experience</h2>
      </Reveal>
      <div className="relative mt-12 pl-8 md:pl-10">
        <span className="absolute left-1 top-0 h-full w-px bg-[var(--line)] md:left-2" />
        <div className="space-y-12">
          {items.map((item, index) => (
            <Reveal key={item.role} delay={index * 90}>
              <article className="relative">
                <span className="absolute -left-[2.03rem] top-2 h-3.5 w-3.5 rounded-full border-2 border-[var(--line)] bg-[var(--panel)] md:-left-[2.58rem]" />
                <p className="text-xs tracking-[0.16em] text-[var(--muted)]">{item.period}</p>
                <h3 className="mt-3 text-xl font-medium">
                  {item.role} · {item.company}
                </h3>
                <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--muted)]">
                  {item.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
