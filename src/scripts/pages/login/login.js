import LoginPresenter from "../../presenter/login-presenter";

const Login = {
  async render() {
    return `
      <section class="login container">
        <h2 class="login-title">Masuk ke Akun Anda</h2>
        <form id="loginForm" class="form-card" novalidate>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="alamat@email.com" required />
          </div>

          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" name="password" placeholder="Minimal 8 karakter" minlength="8" required />
          </div>

          <button type="submit" class="btn-primary">Masuk</button>
        </form>
        <div id="login-message" class="form-message" role="alert" aria-live="polite"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById("loginForm");
    const messageBox = document.getElementById("login-message");

    const presenter = new LoginPresenter({
      onSuccess: (user) => {
        messageBox.textContent = `✅ Login berhasil! Selamat datang, ${user.name}`;
        messageBox.className = "form-message success";
        setTimeout(() => {
          window.location.hash = "#/";
        }, 1500);
      },
      onError: (msg) => {
        messageBox.textContent = msg;
        messageBox.className = "form-message error";
      },
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      messageBox.textContent = "";
      messageBox.className = "form-message";

      const email = form.email.value.trim();
      const password = form.password.value;

      await presenter.login({ email, password });
    });
  },
};

export default Login;
