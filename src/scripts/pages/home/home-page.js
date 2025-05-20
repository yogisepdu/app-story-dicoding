import HomePresenter from "../../presenter/home-presenter";
import HomeModel from "../../model/home-model";
import HomeView from "../../../templates/home-view";
import { renderSubscribeButton } from "../../utils/push";
import { isAuthenticated } from "../../utils/auth";

const HomePage = {
  async render() {
    if (!isAuthenticated()) {
      window.location.hash = "#/login";
      return "<p>Mengalihkan ke halaman login...</p>";
    }

    return `
      <section class="home container">
        <h2>Beranda</h2>
        <div id="map" class="map" style="height: 400px; margin-bottom: 2rem;"></div>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    if (!isAuthenticated()) return;

    const view = new HomeView();
    const model = new HomeModel();
    const presenter = new HomePresenter({ view, model });

    presenter.init();
  },
};

export default HomePage;
