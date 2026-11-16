const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

export function mediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
