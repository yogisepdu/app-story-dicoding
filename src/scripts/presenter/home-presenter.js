export default class HomePresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async init() {
    try {
      const response = await this._model.getData();
      this._view.renderStories(response.listStory);
      this._view.renderMap(response.listStory);
    } catch (error) {
      this._view.showError(error.message);
    }
  }
}
