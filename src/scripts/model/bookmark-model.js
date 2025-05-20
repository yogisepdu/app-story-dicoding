import { getAllBookmarks, deleteBookmark } from "../data/database.js";

const BookmarkModel = {
  async getAll() {
    return await getAllBookmarks();
  },

  async delete(id) {
    return await deleteBookmark(id);
  },
};

export default BookmarkModel;
