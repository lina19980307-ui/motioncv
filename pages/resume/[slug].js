import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import LanguageToggle from "../../components/LanguageToggle";
import ResumeWebsite from "../../components/ResumeWebsite";
import heroSceneConfig from "../../config/heroScene";
import { cloneDefaultResumeTemplate, defaultPublishedSlug } from "../../data/defaultResumeTemplate";
import { getResumeInLanguage } from "../../utils/resumeLanguage";
import { decodeResumeData, loadEditorDraft, loadResumeSnapshot } from "../../utils/shareResume";

const DARK_THEME_MODEL_PATH = "/hero/mr-mime-pokemon-reboot.glb";
const LIGHT_THEME_MODEL_PATH = "/hero/singer.glb";
const DARK_THEME_MODEL_SCALE = 1;
const DARK_THEME_MODEL_Y_OFFSET = 0.51;
const DARK_THEME_SHADOW_Y_OFFSET = 0.18;
const LIGHT_THEME_MODEL_Y_OFFSET = 0.05;
const LIGHT_THEME_SHADOW_Y_OFFSET = -0.28;
const LIGHT_THEME_SHADOW_SCALE = 10.8;
const LIGHT_THEME_SHADOW_BLUR = 2.7;
const LIGHT_THEME_SHADOW_OPACITY = 0.2;
const LIGHT_THEME_SHADOW_FAR = 5.4;
const SHARE_THEME_STORAGE_KEY = "motioncv-share-theme";
const DEFAULT_SHARE_THEME = "light";

function resolveStoredShareTheme() {
  if (typeof window === "undefined") return DEFAULT_SHARE_THEME;
  const savedTheme = window.localStorage.getItem(SHARE_THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "gradient") {
    return savedTheme;
  }
  return DEFAULT_SHARE_THEME;
}

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
  profileEmail: "",
  profileCustom1Title: "",
  profileCustom1Value: "",
  profileCustom2Title: "",
  profileCustom2Value: "",
  profileCustom3Title: "",
  profileCustom3Value: "",
  interactionAudio: null,
  aboutMedia: null,
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
  return (
    <>
      <path d="M792.819 503.536c22.968-14.75 49.622-22.6 77.169-22.6 77.962 0 142.333 62.843 142.333 141.118 0 78.332-64.316 141.122-142.333 141.122-37.607 0-73.428-14.75-100.029-40.824-12.959 34.976-31.133 67.794-53.836 97.502-74.115 96.872-189.477 152.552-311.263 152.552-121.733 0-237.094-55.625-311.21-152.498-49.726-64.949-76.696-143.49-76.696-225.351L16.954 465.133c0-19.016 15.487-34.237 34.45-34.237l706.916 0c18.963 0 34.501 15.222 34.501 34.237L792.821 503.536zM869.988 549.415c-40.138 0-73.428 32.239-73.428 72.64 0 40.351 33.29 72.642 73.428 72.642 40.141 0 73.433-32.237 73.433-72.642C943.421 581.706 910.182 549.415 869.988 549.415zM85.854 499.374l0 95.133c0 65.844 21.439 129.003 60.946 181.628 60.894 81.119 156.87 127.686 258.06 127.686 101.244 0 197.218-46.566 258.115-127.738 39.452-52.625 60.891-115.731 60.891-181.575l0-95.133L85.854 499.375z" />
      <path d="M190.891 108.622c-12.221-7.744-16.014-24.02-8.167-36.293 7.796-12.221 24.232-15.909 36.558-8.218 4.372 2.739 8.691 5.9 12.8 9.009 8.903 6.847 17.385 14.38 25.181 22.492 20.173 21.069 36.872 47.725 38.243 77.645 0.263 6.109-0.053 12.166-1.055 18.224-5.004 30.342-25.6 54.101-49.462 72.063-13.327 10.062-24.916 23.071-25.177 40.613-0.213 12.538 5.213 25.285 11.481 35.872 5.373 9.009 11.958 17.491 19.017 25.232 5.11 5.584 10.798 11.273 16.75 16.013 11.378 9.114 13.118 25.759 3.898 37.084-5.056 6.216-12.589 9.798-20.596 9.798-6.109 0-11.905-2.055-16.696-5.9-4.058-3.264-8.063-6.952-11.8-10.535-8.219-7.956-15.963-16.488-22.916-25.548-18.173-23.599-32.659-52.361-32.238-82.807 0.526-34.555 19.175-61.367 46.145-81.753 14.118-10.642 30.499-26.811 29.604-46.04-0.474-10.956-5.9-21.49-12.223-30.235-7.005-9.745-16.013-18.542-25.231-26.181-3.213-2.687-6.585-5.267-9.957-7.691-1.369-1-2.737-1.896-4.108-2.844L190.891 108.622z" />
      <path d="M369.146 108.622c-12.221-7.744-15.961-24.02-8.165-36.293 7.848-12.221 24.283-15.909 36.557-8.218 4.372 2.739 8.691 5.9 12.799 9.009 8.902 6.847 17.385 14.38 25.181 22.492 20.174 21.069 36.871 47.725 38.243 77.645 0.262 6.109-0.054 12.166-1.055 18.224-5.003 30.342-25.6 54.101-49.464 72.063-13.325 10.062-24.914 23.071-25.178 40.613-0.21 12.538 5.216 25.285 11.484 35.872 5.371 9.009 11.958 17.491 19.015 25.232 5.11 5.584 10.799 11.273 16.752 16.013 11.431 9.114 13.115 25.759 3.898 37.084-5.058 6.216-12.589 9.798-20.596 9.798-6.112 0-11.96-2.055-16.7-5.9-4.056-3.264-8.007-6.952-11.747-10.535-8.216-7.956-15.96-16.488-22.914-25.548-18.173-23.548-32.713-52.361-32.237-82.807 0.526-34.555 19.226-61.421 46.196-81.753 14.119-10.642 30.448-26.811 29.606-46.04-0.476-10.956-5.902-21.49-12.222-30.235-7.008-9.745-16.014-18.542-25.231-26.181-3.213-2.687-6.585-5.267-9.956-7.691-1.372-1-2.793-1.896-4.163-2.844L369.146 108.622z" />
      <path d="M547.455 108.622c-12.274-7.744-16.014-24.073-8.166-36.293 7.795-12.221 24.285-15.909 36.611-8.218 4.373 2.739 8.691 5.9 12.747 9.009 8.901 6.847 17.385 14.38 25.181 22.492 20.173 21.069 36.871 47.725 38.242 77.645 0.262 6.109-0.053 12.166-1.055 18.224-5.004 30.342-25.6 54.101-49.463 72.063-13.328 10.062-24.917 23.071-25.179 40.613-0.21 12.538 5.214 25.285 11.484 35.872 5.371 9.009 11.955 17.491 19.015 25.232 5.11 5.584 10.799 11.273 16.75 16.013 11.378 9.114 13.117 25.759 3.954 37.084-5.059 6.216-12.645 9.798-20.651 9.798-6.057 0-11.957-2.106-16.646-5.9-4.055-3.264-8.059-6.952-11.799-10.535-8.219-7.956-15.959-16.488-22.912-25.548-18.174-23.599-32.714-52.361-32.238-82.756 0.526-34.554 19.174-61.418 46.145-81.752 14.115-10.64 30.443-26.813 29.604-46.039-0.475-10.958-5.9-21.494-12.221-30.236-10.432-14.486-24.652-26.655-39.35-36.716L547.455 108.622z" />
    </>
  );
}
function IconBriefcase() {
  return (
    <>
      <path d="M919.424 161.392a30.704 30.704 0 0 0-35.32 18.216c-5.864 4.144-27.592 11.704-64.712 11.704-38.192 0-63.096-8.144-69.68-13.16a30.68 30.68 0 0 0-28.976-20.528h-41.064c-73.456 0-124.336 61.712-135.288 131.808l-30.848 143.592-360.328 76.296C60.136 524.376 0 586.28 0 667.04v168.696a30.648 30.648 0 0 0 30.656 30.648h962.696a30.632 30.632 0 0 0 30.648-30.648V292.88c0-63.024-42.976-117.088-104.576-131.488z m43.28 643.696H61.304V667.04c0-59.56 52.528-89.256 103.144-97.456l21.984-4.672 35.704 52.68a30.56 30.56 0 0 0 25.4 13.408 30.64 30.64 0 0 0 25.336-47.824L251.216 551.2l65.776-13.928 39.24 57.928a30.624 30.624 0 0 0 42.568 8.208 30.64 30.64 0 0 0 8.168-42.56l-25.248-37.28 61.344-12.96c0.192 0.304 0.192 0.664 0.4 0.96l46.84 69.16a30.52 30.52 0 0 0 25.416 13.472 30.648 30.648 0 0 0 25.344-47.824l-33.496-49.432 38.12-8.056a30.624 30.624 0 0 0 23.584-23.552l35.68-166c0.48-2.112 22.712-81.984 74.712-80.392h24c28.856 30.856 93.392 33.688 115.72 33.688 24.488 0 74.472-2.984 103.144-25.296a73.416 73.416 0 0 1 40.168 65.568v512.184z" />
    </>
  );
}
function IconAward() {
  return (
    <>
      <path d="M976.639782 723.695661c-39.943981-39.975981-101.047953-46.151978-147.567931-18.711991l-59.927972-59.967972c32.063985-67.271968 36.495983-153.183928 11.231995-249.975883-32.663985-125.063941-111.343948-254.783881-221.487896-365.631829-2.015999-2.679999-3.759998-5.503997-6.199997-7.951996-1.175999-1.175999-2.687999-1.671999-3.959998-2.647999-70.223967-62.175971-232.351891 39.511981-355.271834 162.423924C68.664208 306.063857-34.567744 471.543779 33.680224 539.887747c0.4 0.408 0.936 0.536 1.336 0.904 1.111999 1.543999 1.743999 3.319998 3.119998 4.695997C149.52017 656.887692 280.224109 736.303655 406.16005 769.239639c42.08798 10.999995 82.135961 16.439992 119.503944 16.439993 40.647981 0 78.111963-6.503997 111.543947-19.183991l63.279971 63.31997c-35.679983 47.551978-31.919985 115.503946 11.303994 158.767926a120.735943 120.735943 0 0 0 85.79196 35.423983c31.063985 0 62.175971-11.807994 85.85596-35.487983a119.983944 119.983944 0 0 0 32.599985-60.503972 120.391944 120.391944 0 0 0 60.631971-32.671985c47.183978-47.351978 47.183978-124.287942-0.032-171.647919zM242.024127 229.799892C380.304062 91.551957 490.70401 57.079973 503.552004 70.023967c0.232 0.232 0.568 0.304 0.84 0.536 11.903994 15.055993-23.375989 124.263942-160.079925 260.999878C206.136143 469.66378 95.760195 504.175764 82.784201 491.32777c-0.232-0.232-0.568-0.336-0.831999-0.568-11.879994-15.095993 23.431989-124.287942 160.071925-260.959878z m181.503914 472.975779C330.760085 678.559682 234.67213 625.431707 146.704171 551.519741c75.831964-25.071988 168.799921-94.023956 246.167885-171.399919 76.535964-76.535964 144.751932-168.295921 170.47992-243.655886 73.575966 87.735959 126.407941 183.487914 150.551929 275.951871 28.167987 107.855949 14.087993 196.847908-39.711981 250.647882s-142.767933 67.943968-250.663883 39.711982z m504.551764 144.007932c-10.831995 10.863995-25.455988 16.303992-41.423981 14.887993a34.359984 34.359984 0 0 0-36.919982 36.959983c1.271999 15.831993-4.023998 30.519986-14.855993 41.31998-20.59199 20.51999-53.999975 20.59199-74.519965 0.064-20.55199-20.58399-20.55199-54.063975 0.168-74.791965 1.807999-1.871999 4.359998-3.823998 7.975996-6.231997a34.271984 34.271984 0 0 0 15.263993-25.215988 34.215984 34.215984 0 0 0-9.895996-27.703987l-74.287965-74.319965c8.087996-6.239997 15.895993-12.815994 23.175989-20.127991 2.679999-2.687999 4.759998-5.767997 7.271997-8.583996l72.311966 72.303967a34.311984 34.311984 0 0 0 48.559977 0c1.575999-1.535999 2.911999-3.151999 2.679999-3.151999 0 0-0.032 0-0.104 0.064 20.59199-20.51999 54.031975-20.58399 74.559965-0.064 20.49599 20.59999 20.49599 54.063975 0.04 74.591965z" />
    </>
  );
}
function IconProject() {
  return (
    <>
      <path d="M800 317.866667h-64v-49.066667c0-17.066667-14.933333-32-32-32h-174.933333c-38.4 0-74.666667-14.933333-102.4-44.8l-29.866667-32c-6.4-6.4-14.933333-10.666667-23.466667-10.666667h-51.2c-17.066667 0-32 14.933333-32 32v136.533334h-64V181.333333c0-53.333333 42.666667-96 96-96h51.2c25.6 0 51.2 10.666667 70.4 29.866667L473.6 149.333333c14.933333 14.933333 34.133333 23.466667 55.466667 23.466667H704c53.333333 0 96 42.666667 96 96v49.066667z" />
      <path d="M736 938.666667h-448c-68.266667 0-125.866667-51.2-136.533333-119.466667l-53.333334-362.666667C85.333333 381.866667 138.666667 311.466667 213.333333 298.666667c6.4 0 14.933333-2.133333 21.333334-2.133334h554.666666c76.8 0 138.666667 61.866667 138.666667 138.666667 0 6.4 0 12.8-2.133333 19.2l-53.333334 362.666667c-10.666667 70.4-68.266667 119.466667-136.533333 121.6zM234.666667 362.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v10.666667l55.466667 362.666667c6.4 36.266667 36.266667 64 74.666666 64h448c36.266667 0 68.266667-27.733333 74.666667-64l53.333333-362.666667c6.4-40.533333-21.333333-78.933333-61.866666-85.333333H234.666667z" />
      <path d="M640 524.8H384c-17.066667 0-32-14.933333-32-32s14.933333-32 32-32h256c17.066667 0 32 14.933333 32 32s-14.933333 32-32 32z" />
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
function DockIcon({ icon, active }) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={`h-6 w-6 ${active ? "dock-icon-active" : "dock-icon-inactive"}`}
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
  const [theme, setTheme] = useState(DEFAULT_SHARE_THEME);
  const [themeReady, setThemeReady] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const { data, error } = useMemo(() => {
    if (!ready) return { data: emptyData, error: "" };
    if (encoded) {
      try {
        return { data: decodeResumeData(encoded), error: "" };
      } catch {
        return { data: emptyData, error: "分享链接数据无效或已损坏。" };
      }
    }

    if (slug === defaultPublishedSlug) {
      const draft = loadEditorDraft();
      if (draft) {
        return { data: { ...cloneDefaultResumeTemplate(), ...draft }, error: "" };
      }
    }
    const snapshot = loadResumeSnapshot(slug);
    if (snapshot) return { data: snapshot, error: "" };
    if (slug === defaultPublishedSlug) {
      return { data: cloneDefaultResumeTemplate(), error: "" };
    }
    return { data: emptyData, error: "未找到该简历内容，请返回编辑器重新发布。" };
  }, [encoded, ready, slug]);
  const displayData = getResumeInLanguage(data, lang);
  const anchorPrefix = "share";
  const heroModelConfig = useMemo(
    () => ({
      ...heroSceneConfig,
      lights: {
        ...heroSceneConfig.lights,
        contactShadow:
          theme === "dark"
            ? {
                ...heroSceneConfig.lights.contactShadow,
                position: [
                  heroSceneConfig.lights.contactShadow.position?.[0] ?? 0,
                  (heroSceneConfig.lights.contactShadow.position?.[1] ?? 0) + DARK_THEME_SHADOW_Y_OFFSET,
                  heroSceneConfig.lights.contactShadow.position?.[2] ?? 0,
                ],
                scale: Number((heroSceneConfig.lights.contactShadow.scale * 1.12).toFixed(2)),
              }
            : {
                ...heroSceneConfig.lights.contactShadow,
                position: [
                  heroSceneConfig.lights.contactShadow.position?.[0] ?? 0,
                  (heroSceneConfig.lights.contactShadow.position?.[1] ?? 0) + LIGHT_THEME_SHADOW_Y_OFFSET,
                  heroSceneConfig.lights.contactShadow.position?.[2] ?? 0,
                ],
                scale: LIGHT_THEME_SHADOW_SCALE,
                blur: LIGHT_THEME_SHADOW_BLUR,
                opacity: LIGHT_THEME_SHADOW_OPACITY,
                far: LIGHT_THEME_SHADOW_FAR,
              },
      },
      model: {
        ...heroSceneConfig.model,
        assetPath: theme === "dark" ? DARK_THEME_MODEL_PATH : LIGHT_THEME_MODEL_PATH,
        motion: {
          ...heroSceneConfig.model.motion,
          interactionMultiplier: theme === "dark" ? 1 : 0.82,
        },
        transform:
          theme === "dark"
            ? {
                ...heroSceneConfig.model.transform,
                position: [
                  heroSceneConfig.model.transform.position?.[0] ?? 0,
                  (heroSceneConfig.model.transform.position?.[1] ?? 0) + DARK_THEME_MODEL_Y_OFFSET,
                  heroSceneConfig.model.transform.position?.[2] ?? 0,
                ],
                targetSize: Number((heroSceneConfig.model.transform.targetSize * DARK_THEME_MODEL_SCALE).toFixed(2)),
              }
            : {
                ...heroSceneConfig.model.transform,
                position: [
                  heroSceneConfig.model.transform.position?.[0] ?? 0,
                  (heroSceneConfig.model.transform.position?.[1] ?? 0) + LIGHT_THEME_MODEL_Y_OFFSET,
                  heroSceneConfig.model.transform.position?.[2] ?? 0,
                ],
              },
      },
    }),
    [theme]
  );

  const navItems = useMemo(() => {
    const validCustomSections = Array.isArray(data.customSections)
      ? data.customSections.filter((s) => s.title || s.content || (s.mediaItems && s.mediaItems.length))
      : [];
    const hasAwardsGallery = Array.isArray(data.mediaItems)
      ? data.mediaItems.some((item) => item?.url && (item.type === "image" || item.type === "video"))
      : false;
    const firstCustomTitle = String(validCustomSections[0]?.title || "").trim();
    const customLabel = firstCustomTitle || (lang === "en" ? "Custom Section" : "自定义板块");

    const items = [{ id: "home", label: lang === "en" ? "Home" : "首页", icon: <IconHome /> }];
    items.push({ id: "about", label: lang === "en" ? "About" : "关于我", icon: <IconProfile /> });
    if (String(data.experiences || "").trim()) items.push({ id: "experience", label: lang === "en" ? "Experience" : "经历", icon: <IconBriefcase /> });
    if (hasAwardsGallery) items.push({ id: "awards", label: lang === "en" ? "Awards" : "荣誉", icon: <IconAward /> });
    if ((Array.isArray(data.projectItems) && data.projectItems.length > 0) || String(data.projects || "").trim()) {
      items.push({ id: "projects", label: lang === "en" ? "Projects" : "项目", icon: <IconProject /> });
    }
    if (validCustomSections.length > 0) {
      items.push({ id: "custom", label: customLabel, icon: <IconSpark /> });
    }
    if (data.profileEmail || data.email) items.push({ id: "link", label: lang === "en" ? "Contact" : "联系", icon: <IconEmail /> });
    return items;
  }, [data, lang]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const nextTheme = resolveStoredShareTheme();
    const frame = window.requestAnimationFrame(() => {
      setTheme(nextTheme);
      setThemeReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !themeReady) return;
    window.localStorage.setItem(SHARE_THEME_STORAGE_KEY, theme);
  }, [theme, themeReady]);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return undefined;
    const previousScrollRestoration = window.history.scrollRestoration;
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    window.history.scrollRestoration = "manual";
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [ready, slug]);

  useEffect(() => {
    if (!themeOpen) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-theme-menu='true']")) return;
      setThemeOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [themeOpen]);

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

  const themeOptions = [
    { id: "light", label: "简洁明亮" },
    { id: "dark", label: "高级暗夜" },
    { id: "gradient", label: "炫彩渐变" },
  ];

  return (
    <>
      <Head>
        <title>{data.name ? `${data.name} - Resume` : "Resume"}</title>
        <meta name="description" content="Shared resume generated by MotionCV" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`resume-share theme-${theme} min-h-screen`}
        style={themeReady ? undefined : { visibility: "hidden" }}
      >
        <div className="fixed left-4 top-4 z-[60] md:left-6 md:top-6" data-theme-menu="true">
          <button
            type="button"
            onClick={() => setThemeOpen((prev) => !prev)}
            className="theme-trigger inline-flex h-11 w-11 items-center justify-center rounded-full border text-[var(--muted)] transition hover:text-[var(--text)]"
            aria-haspopup="menu"
            aria-expanded={themeOpen}
            aria-label="切换皮肤"
          >
            <svg viewBox="0 0 1024 1024" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
              <path d="M870 126H663.8c-17.4 0-32.9 11.9-37 29.3C614.3 208.1 567 246 512 246s-102.3-37.9-114.8-90.7c-4.1-17.4-19.5-29.3-37-29.3H154c-24.3 0-44 19.7-44 44v252c0 24.3 19.7 44 44 44h75v388c0 24.3 19.7 44 44 44h478c24.3 0 44-19.7 44-44V466h75c24.3 0 44-19.7 44-44V170c0-24.3-19.7-44-44-44z m-28 268H723v432H301V394H182V198h153.3c28.2 71.2 97.5 120 176.7 120s148.5-48.8 176.7-120H842v196z" />
            </svg>
          </button>
          {themeOpen && (
            <div className="theme-menu mt-2 w-44 rounded-xl border p-1.5 shadow-[0_10px_28px_rgba(20,20,20,0.14)] backdrop-blur-xl">
              {themeOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTheme(item.id);
                    setThemeOpen(false);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    theme === item.id ? "bg-[var(--text)] text-[var(--on-accent)]" : "text-[var(--text)] hover:bg-[var(--panel-soft)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="fixed right-4 top-4 z-[60] flex items-center gap-3 md:right-6 md:top-6">
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
            <Link href="/editor" className="share-editor-btn rounded-full border px-4 py-2 text-xs text-[var(--muted)] transition hover:text-[var(--text)]">
              返回编辑器
            </Link>
        </div>
        <main className="w-full px-0 pb-28 pt-2 md:pb-32 md:pt-4">

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
            <ResumeWebsite
              data={displayData}
              lang={lang}
              sectionIdPrefix={anchorPrefix}
              heroFullscreen
              heroModelConfig={heroModelConfig}
              heroInteractionTheme={theme === "dark" ? "dark" : theme === "gradient" ? "gradient" : "light"}
              heroInteractionAnchorY={theme === "dark" ? "66%" : "71%"}
            />
          </>
        )}
        </main>
        {ready && !error ? (
          <nav className="dock-shell fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-[2.2rem] px-4 py-3 shadow-[0_16px_44px_rgba(28,28,28,0.14)] backdrop-blur-xl">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onDockClick(item.id)}
                    className={`dock-btn relative rounded-[1.15rem] p-3.5 transition duration-200 ${activeNav === item.id ? "scale-[1.07] dock-btn-active shadow-[0_8px_20px_rgba(20,20,20,0.12)]" : "dock-btn-idle hover:scale-[1.05] active:scale-95"}`}
                  >
                    <DockIcon icon={item.icon} active={activeNav === item.id} />
                    {activeNav === item.id && (
                      <span className="absolute -bottom-2 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full bg-[rgba(120,120,120,0.45)]" />
                    )}
                  </button>
                  <div className="dock-tip pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 scale-90 whitespace-nowrap rounded-full px-3 py-1.5 text-xs leading-none text-[var(--muted)] opacity-0 shadow-[0_8px_16px_rgba(24,24,24,0.08)] transition duration-200 group-hover:scale-100 group-hover:opacity-100">
                    {item.label}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </>
  );
}
