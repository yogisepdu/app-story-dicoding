// auth-model.js
export default class AuthModel {
  static async login({ email, password }) {
    const response = await fetch("https://story-api.dicoding.dev/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    localStorage.setItem("token", result.loginResult.token);
    localStorage.setItem("name", result.loginResult.name);

    return result.loginResult;
  }

  static async register({ name, email, password }) {
    const response = await fetch("https://story-api.dicoding.dev/v1/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.message;
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
  }

  static isLoggedIn() {
    return !!localStorage.getItem("token");
  }
}
