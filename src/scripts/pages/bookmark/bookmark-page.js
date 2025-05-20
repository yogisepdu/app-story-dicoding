import BookmarkPresenter from "../../presenter/bookmark-presenter.js";

const BookmarkPage = {
  async render() {
    return `<section id="bookmark-page" class="container">
      <h2>Bookmark Saya</h2>
      <div id="bookmark-list">Loading bookmarks...</div>
    </section>`;
  },

  async afterRender() {
    const container = document.getElementById("bookmark-list");
    await BookmarkPresenter.init({ container });
  },
};

export default BookmarkPage;
