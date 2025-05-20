import createAboutTemplate from "../../templates/about-page";

const AboutPresenter = {
  async render() {
    return createAboutTemplate();
  },

  async afterRender() {
    console.log("About page rendered");
  },
};

export default AboutPresenter;
