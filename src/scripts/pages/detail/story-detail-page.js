import StoryDetailPresenter from "../../presenter/story-detail-presenter";
import {
  getBookmark,
  addBookmark,
  deleteBookmark,
  getAllBookmarks,
} from "../../data/database";

const StoryDetailPage = {
  async render() {
    return `<section id="story-detail" class="container">Loading...</section>`;
  },

  async afterRender() {
    const hash = window.location.hash;
    const id = hash.split("/")[2];
    const container = document.getElementById("story-detail");

    await StoryDetailPresenter.init({
      id,
      render: async ({ story, error, message }) => {
        if (error) {
          container.innerHTML = `<p class="error">${message}</p>`;
          return;
        }

        const { name, description, photoUrl, createdAt, lat, lon } = story;

        container.innerHTML = `
          <div class="story-card">
            <h2>${name}</h2>
            <img src="${photoUrl}" alt="Story image" />
            <p>${description}</p>
            <small>Dibuat pada: ${new Date(createdAt).toLocaleString()}</small>

            <!-- Bookmark icon with badge -->
            <div id="bookmark-container" class="bookmark-container" title="Bookmark">
              <svg id="bookmark-icon" class="bookmark-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <div id="bookmark-count" class="bookmark-count">0</div>
            </div>

            <div id="map-container" style="margin-top: 20px;"></div>
          </div>
        `;
        // Map
        const mapContainer = document.getElementById("map-container");
        if (lat && lon && navigator.onLine) {
          try {
            mapContainer.innerHTML = `<div id="map" style="height: 300px;"></div>`;
            const map = L.map("map").setView([lat, lon], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "&copy; OpenStreetMap contributors",
            }).addTo(map);
            L.marker([lat, lon]).addTo(map);
          } catch {
            mapContainer.innerHTML = "";
          }
        } else {
          mapContainer.innerHTML = "";
        }

        const bookmarkIcon = document.getElementById("bookmark-icon");
        const bookmarkCount = document.getElementById("bookmark-count");

        // Update badge jumlah bookmark
        const updateBookmarkCount = async () => {
          const allBookmarks = await getAllBookmarks();
          bookmarkCount.textContent = allBookmarks.length;
        };

        // Update warna icon kalau sudah di bookmark
        const updateIconColor = async () => {
          const bookmarked = await getBookmark(id);
          if (bookmarked) {
            bookmarkIcon.style.color = "#28a745"; // hijau
          } else {
            bookmarkIcon.style.color = "#007bff"; // biru
          }
        };

        await updateBookmarkCount();
        await updateIconColor();

        bookmarkIcon.addEventListener("click", async () => {
          if (await getBookmark(id)) {
            await deleteBookmark(id);
          } else {
            await addBookmark({
              id,
              name,
              photoUrl,
              createdAt,
              description,
              lat,
              lon,
            });
          }
          await updateBookmarkCount();
          await updateIconColor();
        });
      },
    });
  },
};

export default StoryDetailPage;
