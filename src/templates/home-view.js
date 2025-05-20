export default class HomeView {
  renderStories(stories) {
    const container = document.getElementById("story-list");
    container.innerHTML = "";

    stories.forEach((story) => {
      const card = document.createElement("div");
      card.className = "story-card";
      card.innerHTML = `
        <img src="${story.photoUrl}" alt="${story.name}" />
        <h3>${story.name}</h3>
        <p>${story.description.slice(0, 100)}...</p>
        <a href="#/detail/${story.id}" class="btn-detail">
        <span>Lihat Detail</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      `;
      container.appendChild(card);
    });
  }

  renderMap(stories) {
    const mapElement = document.getElementById("map");

    // Jangan render map kalau tidak ada koneksi
    if (!navigator.onLine) {
      mapElement.style.display = "none";
      return;
    }

    if (this._map) {
      this._map.remove();
    }

    this._map = L.map("map").setView([-2.5489, 118.0149], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this._map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        L.marker([story.lat, story.lon])
          .addTo(this._map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }

  showError(message) {
    const container = document.getElementById("story-list");
    container.innerHTML = `<p class="error">${message}</p>`;
  }
}
