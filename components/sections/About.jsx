import Reveal from "../Reveal";

const skills = [
  "UI/UX Strategy",
  "Design Systems",
  "Interaction Design",
  "Prototyping",
  "Visual Direction",
];

export default function About() {
  return (
    <section className="section-space border-b" id="about">
      <Reveal>
        <h2 className="section-title">About</h2>
        <p className="section-copy">
          我是一个重视结构和细节的产品设计师，专注把复杂问题转化为简洁、可信赖的数字体验。
        </p>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border bg-white/80 px-4 py-2 text-xs tracking-[0.12em] text-[var(--muted)]"
            >
              {skill}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
