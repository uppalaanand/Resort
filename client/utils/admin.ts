// const API_URL = 'https://resort-4x9p.vercel.app/api';
const API_URL = 'http://localhost:5000/api';

const getToken = () => {
  const user = localStorage.getItem('vp_user');
  return user ? JSON.parse(user).token : null;
};

export const admin = {
  uploadRoom: async (formData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create room");
    }
    return result;
  },

  uploadBanquete: async (formData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/banquets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create banquete");
    }
    return result;
  },

  uploadEvent: async (formData: FormData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to create event");
    }
    return result;
  },
};