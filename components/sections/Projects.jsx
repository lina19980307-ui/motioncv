import { useState } from "react";
import Reveal from "../Reveal";

const projects = [
  {
    name: "MotionCV Web",
    desc: "在线简历编辑器，支持实时预览与双语切换。",
    details:
      "负责产品信息架构与视觉标准，提供模块化排版能力，并支持 PDF 导出与 ATS 友好布局。",
  },
  {
    name: "Portfolio System",
    desc: "统一作品展示组件，提升项目复用与交付效率。",
    details:
      "构建统一卡片与内容组件库，减少重复开发成本，并建立可扩展的案例模板与展示规范。",
  },
  {
    name: "ATS Template",
    desc: "针对招聘系统优化的信息层级模板。",
    details:
      "针对企业招聘系统进行内容结构优化，强调可解析字段与层级清晰度，提升简历通过率。",
  },
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    window.setTimeout(() => setActiveProject(null), 220);
  };

  const openModal = (project) => {
    setActiveProject(project);
    requestAnimationFrame(() => setModalVisible(true));
  };

  return (
    <section className="section-space border-b" id="projects">
      <Reveal>
        <h2 className="section-title">Projects</h2>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.name} delay={index * 100}>
            <article className="h-full rounded-2xl border bg-white/70 p-6 transition duration-300 hover:scale-[1.02] hover:shadow-[0_26px_62px_rgba(0,0,0,0.14)]">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{project.desc}</p>
              <button
                type="button"
                className="mt-6 rounded-full border px-4 py-2 text-xs tracking-[0.14em] text-[var(--muted)] transition hover:text-[var(--text)]"
                onClick={() => openModal(project)}
              >
                VIEW DETAILS
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      {activeProject && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-5 transition duration-200 ${
            modalVisible ? "bg-black/45 opacity-100" : "bg-black/0 opacity-0"
          }`}
          onClick={closeModal}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeModal();
          }}
          role="button"
          tabIndex={0}
        >
          <div
            className={`w-full max-w-xl rounded-2xl border bg-[var(--panel)] p-8 shadow-2xl transition duration-300 ${
              modalVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-semibold">{activeProject.name}</h3>
              <button
                type="button"
                className="rounded-full border px-3 py-1 text-xs tracking-[0.14em] text-[var(--muted)]"
                onClick={closeModal}
              >
                CLOSE
              </button>
            </div>
            <p className="mt-6 text-base leading-8 text-[var(--muted)]">
              {activeProject.details}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
