import AboutPresenter from "../../presenter/about-presenter";

const AboutPage = {
  async render() {
    return await AboutPresenter.render();
  },

  async afterRender() {
    await AboutPresenter.afterRender();
  },
};

export default AboutPage;
