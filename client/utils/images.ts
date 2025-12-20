// const API_URL = "resort-4x9p.vercel.app";

// const getImageUrl = (path: string) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   return `${API_URL}/${path.replace(/\\/g, "/")}`;
// };
// export { getImageUrl };


const API_URL = "https://resort-4x9p.vercel.app";

const getImageUrl = (path: string) => {
  if (!path) return "https://via.placeholder.com/600x400?text=No+Image";

  // If already full URL
  if (path.startsWith("http")) return path;

  // If local upload path → fallback
  if (path.startsWith("uploads")) {
    return "https://via.placeholder.com/600x400?text=Room+Image";
  }

  return `${API_URL}/${path.replace(/\\/g, "/")}`;
};

export { getImageUrl };
