import routes from "../routes/routes.js";
import { getActiveRoute } from "../routes/url-parser.js";
import { generateSubscribeButtonTemplate } from "../../templates";
import { isServiceWorkerAvailable } from "../utils/index.js";
import {
  requestNotificationPermission,
  subscribeUserToPush,
  getPushSubscription,
  showNotificationPrompt,
} from "../utils/notification-helper.js";
import { renderSubscribeButton } from "../utils/push.js";
class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupSkipLink();
    this._setupDrawer();
  }

  #setupNavigationList() {
    console.log("setupNavigationList dipanggil");
  }

  _setupSkipLink() {
    const skipLink = document.querySelector(".skip-link");
    const mainContent = this.#content;

    if (skipLink && mainContent) {
      skipLink.addEventListener("click", (event) => {
        event.preventDefault();
        skipLink.blur();
        mainContent.focus();
        mainContent.scrollIntoView();
      });
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async setupPushNotification() {
    const pushNotificationTools = document.getElementById(
      "pushNotificationTools"
    );
    if (!pushNotificationTools) return;

    // Render tombol subscribe (selalu muncul)
    renderSubscribeButton(pushNotificationTools);

    const subscribeButton = document.getElementById("subscribe-button");
    if (!subscribeButton) return;

    subscribeButton.addEventListener("click", async () => {
      const granted = await requestNotificationPermission();
      if (granted !== "granted") {
        alert("Izin notifikasi diperlukan untuk subscribe.");
        return;
      }

      const token = localStorage.getItem("token");
      const success = await subscribeUserToPush(token);

      if (success) {
        // Tampilkan alert berhasil dari API (bisa menggunakan Swal atau alert biasa)
        alert("Berhasil subscribe notifikasi melalui API!");

        // Tampilkan notifikasi lokal dari service worker
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification("Berhasil subscribe notifikasi!", {
          body: "Kamu akan menerima notifikasi cerita baru.",
          icon: "/images/logo.png",
          badge: "/images/logo.png",
        });

        // Disable tombol agar tidak bisa klik lagi tapi tetap tampil
        // subscribeButton.disabled = true;
        subscribeButton.title = "Notifikasi sudah aktif";
        subscribeButton.style.opacity = "0.6";
      } else {
        alert("Gagal melakukan subscribe. Silakan coba lagi.");
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      this.#content.innerHTML = "<h2>404 - Halaman tidak ditemukan</h2>";
      return;
    }

    if (this._currentPage && typeof this._currentPage.destroy === "function") {
      this._currentPage.destroy();
    }

    this._currentPage = page;

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    scrollTo({ top: 0, behavior: "instant" });
    this.#setupNavigationList();

    if (isServiceWorkerAvailable()) {
      await this.setupPushNotification();
    }
  }
}

export default App;
