import RegisterPresenter from "../../presenter/register-presenter";

const Register = {
  async render() {
    return `
      <section class="register container">
        <h2 class="register-title">Buat Akun Baru</h2>
        <form id="registerForm" class="form-card" novalidate>
          <div class="form-group">
            <label for="name">Nama Lengkap</label>
            <input type="text" id="name" name="name" placeholder="Nama Anda" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="alamat@email.com" required />
          </div>

          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" name="password" placeholder="Minimal 8 karakter" minlength="8" required />
          </div>

          <button type="submit" class="btn-primary">Daftar Sekarang</button>
        </form>
        <div id="register-message" class="form-message" role="alert" aria-live="polite"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById("registerForm");
    const messageBox = document.getElementById("register-message");

    const presenter = new RegisterPresenter({
      onSuccess: (message) => {
        messageBox.textContent = `✅ ${message}`;
        messageBox.className = "form-message success";
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 1500);
      },
      onError: (message) => {
        messageBox.textContent = `❌ ${message}`;
        messageBox.className = "form-message error";
      },
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      messageBox.textContent = "";
      messageBox.className = "form-message";

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      await presenter.register({ name, email, password });
    });
  },
};

export default Register;
