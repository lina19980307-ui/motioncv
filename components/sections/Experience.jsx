import Reveal from "../Reveal";

const items = [
  {
    role: "Lead Product Designer",
    company: "Atelier Labs",
    period: "2022 - Present",
    detail: "主导设计系统重构并定义跨端组件规范，显著提升产品一致性。",
  },
  {
    role: "Senior Product Designer",
    company: "Northbound Studio",
    period: "2019 - 2022",
    detail: "负责 B2B 核心流程改版，完成关键路径体验优化与可用性验证。",
  },
  {
    role: "Product Designer",
    company: "Pixel Collective",
    period: "2017 - 2019",
    detail: "参与从 0 到 1 的产品设计与品牌视觉体系搭建，推动首版上线。",
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
