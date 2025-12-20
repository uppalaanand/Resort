const API_URL = "resort-4x9p-jik1rc54n-uppalaanands-projects.vercel.app";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path.replace(/\\/g, "/")}`;
};
export { getImageUrl };