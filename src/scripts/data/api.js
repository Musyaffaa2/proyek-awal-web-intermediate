import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_STORY: `${CONFIG.BASE_URL}/stories/:id`,
  POST_STORIES: `${CONFIG.BASE_URL}/stories`,
  POST_STORIES_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
};

export async function login(email, password) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Gagal login");
  }

  return await response.json();
}

export async function register(name, email, password) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Gagal mendaftar");
  }

  return await response.json();
}

export async function getStories(page = 1, size = 12, location = 0) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const url = new URL(ENDPOINTS.GET_STORIES);
  url.searchParams.append("page", page);
  url.searchParams.append("size", size);
  url.searchParams.append("location", location);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch stories");
  }

  const responseData = await response.json();

  if (!Array.isArray(responseData.listStory)) {
    throw new Error("Invalid response format: listStory is not an array");
  }

  return responseData.listStory;
}

export async function getStory(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.hash = "#/login";
    throw new Error("User is not authenticated");
  }

  const url = ENDPOINTS.GET_STORY.replace(":id", id);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch story details");
  }

  return await response.json();
}

export async function postStory({ description, photo, lat, lon }) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat) formData.append("lat", lat);
  if (lon) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.POST_STORIES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Gagal mengirim story");
  }

  return responseData;
}

export async function postGuestStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (lat) formData.append("lat", lat);
  if (lon) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.POST_STORIES_GUEST, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Gagal mengirim story");
  }

  return responseData;
}
