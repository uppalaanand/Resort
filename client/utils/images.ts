const API_URL = "http://localhost:5000";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path.replace(/\\/g, "/")}`;
};
export { getImageUrl };