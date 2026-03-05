export function parseItems(text, keys) {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      return keys.reduce((acc, key, index) => ({ ...acc, [key]: parts[index] || "" }), {});
    });
}
