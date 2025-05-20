import BookmarkModel from "../model/bookmark-model.js";
import BookmarkView from "../../templates/bookmark-view.js";

const BookmarkPresenter = {
  async init({ container }) {
    this.container = container;
    await this.renderBookmarks();
    this._setupDeleteListeners();
  },

  async renderBookmarks() {
    const bookmarks = await BookmarkModel.getAll();
    this.container.innerHTML = BookmarkView.render(bookmarks);
  },

  _setupDeleteListeners() {
    this.container.addEventListener("click", async (event) => {
      if (event.target.classList.contains("btn-delete-bookmark")) {
        const id = event.target.dataset.id;
        await BookmarkModel.delete(id);
        await this.renderBookmarks();
      }
    });
  },
};

export default BookmarkPresenter;
