import CONFIG from "../config";

const ENDPOINTS = {
  BASE: CONFIG.BASE_URL,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  PUSH_SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  PUSH_UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/unsubscribe`, // opsional
};

// GET stories
export async function getData() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(ENDPOINTS.STORIES, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: true,
        message: errorData.message || "Gagal mengambil data",
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch stories error:", error);
    return { error: true, message: "Gagal mengambil cerita" };
  }
}

// POST /register
export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Register error:", error);
    return { error: true, message: "Register gagal" };
  }
}

// POST /login
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { error: true, message: "Login gagal" };
  }
}

// POST /stories
export async function addStory({ description, photo, lat, lon }) {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(ENDPOINTS.STORIES, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Add story error:", error);
    return { error: true, message: "Gagal menambahkan cerita" };
  }
}

// Push Notification Subscription
export async function subscribePushToAPI(subscription, token) {
  try {
    const response = await fetch(ENDPOINTS.PUSH_SUBSCRIBE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || "Gagal subscribe push notification.");
    }

    return data;
  } catch (error) {
    console.error("Subscribe error:", error);
    return { error: true, message: error.message || "Gagal subscribe push" };
  }
}

// DELETE /notifications/subscribe
export async function unsubscribePushFromAPI(endpoint, token) {
  try {
    const response = await fetch(ENDPOINTS.PUSH_SUBSCRIBE, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.message || "Gagal unsubscribe push notification.");
    }

    return data;
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return { error: true, message: error.message || "Gagal unsubscribe push" };
  }
}

export async function getStoryDetail(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: true,
        message: errorData.message || "Gagal mengambil detail story",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Detail story error:", error);
    return { error: true, message: "Gagal mengambil detail story" };
  }
}
