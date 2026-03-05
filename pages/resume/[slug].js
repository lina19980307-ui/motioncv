import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import LanguageToggle from "../../components/LanguageToggle";
import ResumeWebsite from "../../components/ResumeWebsite";
import { getResumeInLanguage } from "../../utils/resumeLanguage";
import { decodeResumeData, loadResumeSnapshot } from "../../utils/shareResume";

const emptyData = {
  name: "",
  tagline: "",
  about: "",
  experiences: "",
  skills: "",
  awards: "",
  projects: "",
  projectItems: [],
  profilePosition: "",
  profileWorkYears: "",
  profileAge: "",
  profilePhone: "",
  profileEmail: "",
  profileExtraTitle: "",
  profileExtraValue: "",
  mediaItems: [],
  customSections: [],
};

function IconHome() {
  return <path d="M155.584 342.56l312.874667-224.565333a74.666667 74.666667 0 0 1 87.082666 0l312.874667 224.565333A117.333333 117.333333 0 0 1 917.333333 437.866667V800c0 64.8-52.533333 117.333333-117.333333 117.333333H224c-64.8 0-117.333333-52.533333-117.333333-117.333333V437.877333a117.333333 117.333333 0 0 1 48.917333-95.317333z m37.322667 51.989333A53.333333 53.333333 0 0 0 170.666667 437.877333V800a53.333333 53.333333 0 0 0 53.333333 53.333333h576a53.333333 53.333333 0 0 0 53.333333-53.333333V437.877333a53.333333 53.333333 0 0 0-22.24-43.328L518.218667 169.984a10.666667 10.666667 0 0 0-12.437334 0L192.906667 394.56z" />;
}
function IconProfile() {
  return <path d="M640 473.6c57.6-38.4 96-108.8 96-185.6C736 166.4 633.6 64 512 64S288 166.4 288 288c0 76.8 38.4 140.8 96 185.6-147.2 57.6-256 211.2-256 390.4 0 19.2 0 44.8 6.4 70.4 0 12.8 12.8 25.6 32 25.6h691.2c12.8 0 32-12.8 32-25.6 6.4-25.6 6.4-44.8 6.4-70.4 0-179.2-108.8-332.8-256-390.4zM352 288C352 198.4 422.4 128 512 128s160 70.4 160 160S601.6 448 512 448 352 377.6 352 288zM832 896H192v-32C192 672 332.8 512 512 512s320 160 320 352v32z" />;
}
function IconSpark() {
  return <path d="M476.5 1024c-2.8 0-5.7-0.4-8.5-1.1-12.9-3.6-22.2-14.8-23.4-28.1L413.1 640H128c-12.3 0-23.4-7-28.8-18.1-5.4-11-3.9-24.1 3.7-33.8L557 12.2c8.5-10.8 22.7-14.8 35.6-10.4 12.9 4.5 21.5 16.6 21.5 30.3v347.1H896c12 0 23 6.8 28.5 17.4 5.5 10.7 4.5 23.6-2.6 33.3l-419.5 580.9c-6 8.4-15.8 13.2-25.9 13.2zM194 576h248.4c16.6 0 30.4 12.7 31.9 29.2l26.5 298.5 332.6-460.6H582.2c-17.7 0-32-14.3-32-32V124.2L194 576z" />;
}
function IconBriefcase() {
  return (
    <>
      <path d="M563.2 64a140.8 140.8 0 0 1 140.672 135.168L704 204.8v12.8h64a192 192 0 0 1 191.872 185.792L960 409.6V768a192 192 0 0 1-185.792 191.872L768 960H256a192 192 0 0 1-191.872-185.792L64 768V409.6a192 192 0 0 1 185.792-191.872L256 217.6h64v-12.8a140.8 140.8 0 0 1 135.168-140.672L460.8 64h102.4z m320 507.264h-230.656a140.8 140.8 0 0 1-281.088 0H140.8V768a115.2 115.2 0 0 0 109.76 115.072L256 883.2h512a115.2 115.2 0 0 0 115.072-109.76L883.2 768V571.264z m-307.712 0H448.512a64 64 0 0 0 126.976 0zM768 294.4H256a115.2 115.2 0 0 0-115.072 109.76L140.8 409.6v84.864h742.4V409.6a115.2 115.2 0 0 0-109.76-115.072L768 294.4zM563.2 140.8H460.8a64 64 0 0 0-63.872 59.776L396.8 204.8v12.8h230.4v-12.8a64 64 0 0 0-59.776-63.872L563.2 140.8z" />
      <path d="M608.64 665.6a140.8 140.8 0 0 0 43.904-94.336H575.488a64 64 0 0 1-126.976 0H371.456A140.8 140.8 0 0 0 608.64 665.6z" />
    </>
  );
}
function IconAward() {
  return (
    <>
      <path d="M731.392 102.4H292.1984a68.266667 68.266667 0 0 0-59.460267 34.696533L84.565333 399.530667a68.266667 68.266667 0 0 0 8.0896 78.5408l367.5648 419.84a68.266667 68.266667 0 0 0 102.621867 0.119466l368.366933-418.645333a68.266667 68.266667 0 0 0 8.226134-78.626133L790.869333 137.147733A68.266667 68.266667 0 0 0 731.392 102.4z m-439.1936 68.266667h439.1936l148.565333 263.611733-368.366933 418.6624-367.581867-419.84L292.1984 170.666667z" />
      <path d="M699.733333 341.333333v34.133334a34.133333 34.133333 0 0 1-34.133333 34.133333H358.4a34.133333 34.133333 0 0 1-34.133333-34.133333v-34.133334h375.466666z" />
    </>
  );
}
function IconProject() {
  return (
    <>
      <path d="M89.6 168.405333v646.741334q0 32.64 23.082667 55.765333 23.082667 23.04 55.722666 23.04h687.189334q32.64 0 55.722666-23.04 23.082667-23.082667 23.082667-55.765333V289.706667q0-32.64-23.082667-55.722667-23.082667-23.04-55.722666-23.04h-325.589334l-89.557333-107.52q-2.688-3.2-6.058667-5.802667-3.328-2.56-7.168-4.352-3.84-1.792-7.936-2.730666-4.096-0.896-8.32-0.896H168.405333q-32.64 0-55.722666 23.082666T89.6 168.405333z m78.805333 648.789334q-2.005333 0-2.005333-2.048V168.405333q0-2.005333 2.005333-2.005333H392.96l89.557333 107.434667q2.688 3.242667 6.016 5.845333 3.370667 2.56 7.168 4.352 3.84 1.792 7.936 2.730667 4.138667 0.896 8.362667 0.896h343.594667q2.005333 0 2.005333 2.005333v525.482667q0 2.048-2.005333 2.048H168.405333z" />
      <path d="M128 430.933333h768v76.8H128v-76.8z" />
    </>
  );
}
function IconEmail() {
  return (
    <>
      <path d="M143.36 184.32h737.28a61.44 61.44 0 0 1 61.44 61.44v532.48a61.44 61.44 0 0 1-61.44 61.44H143.36a61.44 61.44 0 0 1-61.44-61.44V245.76a61.44 61.44 0 0 1 61.44-61.44z m40.96 81.92a20.48 20.48 0 0 0-20.48 20.48v450.56a20.48 20.48 0 0 0 20.48 20.48h655.36a20.48 20.48 0 0 0 20.48-20.48V286.72a20.48 20.48 0 0 0-20.48-20.48H184.32z" />
      <path d="M499.712 513.82272l372.5312-237.1584 43.99104 69.12-383.50848 244.14208a61.44 61.44 0 0 1-66.00704 0L83.21024 345.78432l43.99104-69.12 372.5312 237.1584z" />
    </>
  );
}
function IconCustom() {
  return <path d="M10 3v14M3 10h14M5.8 5.8l8.4 8.4M14.2 5.8 5.8 14.2" />;
}

function DockIcon({ icon, active }) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={`h-6 w-6 ${active ? "text-[var(--text)]" : "text-[var(--muted)]"}`}
      fill="currentColor"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}

export default function ResumeSharePage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const encoded = typeof router.query.data === "string" ? router.query.data : "";
  const lang = router.query.lang === "en" ? "en" : "zh";
  const ready = router.isReady;
  const [activeNav, setActiveNav] = useState("home");

  const { data, error } = useMemo(() => {
    if (!ready) return { data: emptyData, error: "" };
    if (encoded) {
      try {
        return { data: decodeResumeData(encoded), error: "" };
      } catch {
        return { data: emptyData, error: "分享链接数据无效或已损坏。" };
      }
    }

    const snapshot = loadResumeSnapshot(slug);
    if (snapshot) return { data: snapshot, error: "" };
    return { data: emptyData, error: "未找到该简历内容，请返回编辑器重新发布。" };
  }, [encoded, ready, slug]);
  const displayData = getResumeInLanguage(data, lang);
  const anchorPrefix = "share";

  const navItems = useMemo(() => {
    const items = [{ id: "home", label: lang === "en" ? "Home" : "首页", icon: <IconHome /> }];
    items.push({ id: "about", label: lang === "en" ? "About" : "关于我", icon: <IconProfile /> });
    if (String(data.skills || "").trim()) items.push({ id: "skills", label: lang === "en" ? "Skills" : "技能", icon: <IconSpark /> });
    if (String(data.experiences || "").trim()) items.push({ id: "experience", label: lang === "en" ? "Experience" : "经历", icon: <IconBriefcase /> });
    if (String(data.awards || "").trim()) items.push({ id: "awards", label: lang === "en" ? "Awards" : "荣誉", icon: <IconAward /> });
    if ((Array.isArray(data.projectItems) && data.projectItems.length > 0) || String(data.projects || "").trim()) {
      items.push({ id: "projects", label: lang === "en" ? "Projects" : "项目", icon: <IconProject /> });
    }
    if (data.profileEmail || data.email) items.push({ id: "link", label: lang === "en" ? "Contact" : "联系", icon: <IconEmail /> });
    if (Array.isArray(data.customSections) && data.customSections.some((s) => s.title || s.content || (s.mediaItems && s.mediaItems.length))) {
      items.push({ id: "custom", label: lang === "en" ? "Custom" : "自定义", icon: <IconCustom /> });
    }
    return items;
  }, [data, lang]);

  useEffect(() => {
    if (!ready) return undefined;
    const targets = navItems
      .map((item) => document.getElementById(`${anchorPrefix}-${item.id}`))
      .filter(Boolean);
    if (!targets.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveNav(String(visible.target.id).replace(`${anchorPrefix}-`, ""));
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.2, 0.45, 0.7] }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [ready, navItems]);

  const onDockClick = (id) => {
    const target = document.getElementById(`${anchorPrefix}-${id}`);
    if (!target) return;
    setActiveNav(id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        <title>{data.name ? `${data.name} - Resume` : "Resume"}</title>
        <meta name="description" content="Shared resume generated by MotionCV" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-7xl px-6 pb-28 pt-8 md:px-12 md:pb-32 md:pt-12">
        <div className="mb-6 flex items-center justify-between rounded-2xl border bg-[var(--panel)]/88 px-5 py-4 backdrop-blur-sm">
          <div>
            <p className="eyebrow">MOTIONCV SHARE</p>
            <p className="mt-2 text-sm text-[var(--muted)]">可公开访问的个人简历页面</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle
              lang={lang}
              onChange={(nextLang) => {
                const path = typeof router.asPath === "string" ? router.asPath.split("?")[0] : router.pathname;
                const query = new URLSearchParams();
                if (encoded) query.set("data", encoded);
                query.set("lang", nextLang);
                router.push(`${path}?${query.toString()}`);
              }}
            />
            <Link href="/" className="rounded-full border px-4 py-2 text-xs text-[var(--muted)]">
              返回编辑器
            </Link>
          </div>
        </div>

        {!ready ? (
          <section className="rounded-2xl border bg-[var(--panel)] p-8">
            <p className="text-lg">正在加载简历...</p>
          </section>
        ) : error ? (
          <section className="rounded-2xl border bg-[var(--panel)] p-8">
            <p className="text-lg">{error}</p>
            <p className="mt-3 text-sm text-[var(--muted)]">请返回编辑器重新生成链接。</p>
          </section>
        ) : (
          <>
            <ResumeWebsite data={displayData} lang={lang} sectionIdPrefix={anchorPrefix} centeredSectionTitles heroFullscreen />
            <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-[2.2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.62))] px-4 py-3 shadow-[0_16px_44px_rgba(28,28,28,0.14)] backdrop-blur-xl">
              <ul className="flex items-center gap-2">
                {navItems.map((item) => (
                  <li key={item.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => onDockClick(item.id)}
                      className={`relative rounded-[1.15rem] p-3.5 transition duration-200 ${activeNav === item.id ? "scale-[1.07] bg-white/95 shadow-[0_8px_20px_rgba(20,20,20,0.12)]" : "bg-white/72 hover:scale-[1.05] hover:bg-white/92 active:scale-95"}`}
                    >
                      <DockIcon icon={item.icon} active={activeNav === item.id} />
                      {activeNav === item.id && (
                        <span className="absolute -bottom-2 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full bg-[rgba(120,120,120,0.45)]" />
                      )}
                    </button>
                    <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 scale-90 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs leading-none text-[var(--muted)] opacity-0 shadow-[0_8px_16px_rgba(24,24,24,0.08)] transition duration-200 group-hover:scale-100 group-hover:opacity-100">
                      {item.label}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </main>
      </div>
    </>
  );
}
