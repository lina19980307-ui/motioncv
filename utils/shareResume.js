export function toSlug(name) {
  const base = (name || "resume")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const unique = Date.now().toString(36);
  return `${base || "resume"}-${unique}`;
}

function toBase64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const normalized = pad ? `${base64}${"=".repeat(4 - pad)}` : base64;
  const binary = atob(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeResumeData(data) {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  return toBase64Url(bytes);
}

export function decodeResumeData(encoded) {
  const bytes = fromBase64Url(encoded);
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

const SNAPSHOT_PREFIX = "motioncv:resume:";

function clearOldSnapshotsExcept(slug) {
  if (typeof window === "undefined") return;
  const keepRawKey = `${SNAPSHOT_PREFIX}${slug}`;
  const keepEncodedKey = `${SNAPSHOT_PREFIX}${encodeURIComponent(slug)}`;
  const keysToDelete = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    if (key.startsWith(SNAPSHOT_PREFIX) && key !== keepRawKey && key !== keepEncodedKey) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach((key) => window.localStorage.removeItem(key));
}

export function saveResumeSnapshot(slug, data) {
  if (typeof window === "undefined" || !slug) return { ok: false, reason: "unavailable" };

  const rawKey = `${SNAPSHOT_PREFIX}${slug}`;
  const encodedKey = `${SNAPSHOT_PREFIX}${encodeURIComponent(slug)}`;
  const payload = JSON.stringify(data);

  try {
    window.localStorage.setItem(rawKey, payload);
    if (encodedKey !== rawKey) {
      window.localStorage.setItem(encodedKey, payload);
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      try {
        clearOldSnapshotsExcept(slug);
        window.localStorage.setItem(rawKey, payload);
        if (encodedKey !== rawKey) {
          window.localStorage.setItem(encodedKey, payload);
        }
        return { ok: true };
      } catch (retryError) {
        if (retryError instanceof DOMException && retryError.name === "QuotaExceededError") {
          return { ok: false, reason: "quota" };
        }
        return { ok: false, reason: "unknown" };
      }
    }
    return { ok: false, reason: "unknown" };
  }
}

export function loadResumeSnapshot(slug) {
  if (typeof window === "undefined" || !slug) return null;

  const candidates = Array.from(
    new Set([
      slug,
      (() => {
        try {
          return decodeURIComponent(slug);
        } catch {
          return slug;
        }
      })(),
      encodeURIComponent(slug),
    ])
  );

  for (const candidate of candidates) {
    const raw = window.localStorage.getItem(`${SNAPSHOT_PREFIX}${candidate}`);
    if (!raw) continue;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}
