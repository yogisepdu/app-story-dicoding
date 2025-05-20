import AuthModel from "../scripts/model/auth-model.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginNav = document.getElementById("login-nav");
  const registerNav = document.getElementById("register-nav");
  const logoutNav = document.getElementById("logout-nav");
  const logoutLink = document.getElementById("logout-link");

  if (AuthModel.isLoggedIn()) {
    loginNav.style.display = "none";
    registerNav.style.display = "none";
    logoutNav.style.display = "block";
  } else {
    loginNav.style.display = "block";
    registerNav.style.display = "block";
    logoutNav.style.display = "none";
  }

  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    AuthModel.logout();
    location.href = "#/login";
    location.reload();
  });
});

document.getElementById("skip-link").addEventListener("click", function () {
  this.style.display = "none";
});
