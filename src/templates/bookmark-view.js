const BookmarkView = {
  render(bookmarks) {
    if (!bookmarks.length) {
      return `<p class="no-bookmarks">Belum ada bookmark yang disimpan.</p>`;
    }

    return bookmarks
      .map(
        (bookmark) => `
      <div class="bookmark-item" data-id="${bookmark.id}">
        <img class="bookmark-img" src="${bookmark.photoUrl}" alt="${bookmark.name}" />
        <div class="bookmark-info">
          <h3 class="bookmark-title">${bookmark.name}</h3>
          <p class="bookmark-description">${bookmark.description}</p>
          <button class="btn-delete-bookmark" data-id="${bookmark.id}" aria-label="Hapus Bookmark ${bookmark.name}">
            <i class="fas fa-trash-alt"></i> Hapus
          </button>
        </div>
      </div>`
      )
      .join("");
  },
};

export default BookmarkView;
