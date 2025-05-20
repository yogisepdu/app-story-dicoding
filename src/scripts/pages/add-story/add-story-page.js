import AddStoryPresenter from "../../presenter/add-story-presenter";
import L from "leaflet";

let stream = null;
let map, marker;

const AddStoryPage = {
  async render() {
    return `
      <section class="add-story container">
        <h2 class="add-story-title">Tambah Cerita Baru</h2>

        <form id="story-form" class="form-card" enctype="multipart/form-data" novalidate>
          <div class="camera-section">
            <button type="button" id="start-camera"><i class="fas fa-camera"></i> Aktifkan Kamera</button>
            <video id="camera-stream" autoplay playsinline style="display: none;"></video>
            <canvas id="snapshot" style="display: none;"></canvas>
            <input type="hidden" id="photoData" name="photoData">
            <button type="button" id="take-photo" style="display: none;"><i class="fas fa-camera-retro"></i> Ambil Foto</button>
          </div>

          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" rows="4" placeholder="Ceritakan sesuatu..." required></textarea>
          </div>

          <div class="form-group">
            <label for="lat">Latitude</label>
            <input type="number" id="lat" name="lat" step="any" required readonly />
          </div>

          <div class="form-group">
            <label for="lon">Longitude</label>
            <input type="number" id="lon" name="lon" step="any" required readonly />
          </div>

          <div id="map" class="map"></div>

          <button type="submit" class="btn-primary">Kirim Cerita</button>
        </form>
        <div id="form-message" class="form-message" role="alert" aria-live="polite"></div>
      </section>
    `;
  },

  async afterRender() {
    const form = document.getElementById("story-form");
    const canvas = document.getElementById("snapshot");
    const video = document.getElementById("camera-stream");
    const photoDataInput = document.getElementById("photoData");
    const message = document.getElementById("form-message");
    const latInput = document.getElementById("lat");
    const lonInput = document.getElementById("lon");

    this.setupMap(latInput, lonInput);
    this.setupCamera(video, canvas, photoDataInput);

    const presenter = new AddStoryPresenter({
      onSubmit: () => {
        form.reset();
        canvas.style.display = "none";
        photoDataInput.value = "";
        if (marker) map.removeLayer(marker);
        setTimeout(() => (message.textContent = ""), 3000);
      },
      onSuccess: (msg) => {
        message.textContent = msg;
        message.classList.add("success");
      },
      onError: (msg) => {
        message.textContent = msg;
        message.classList.add("error");
      },
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      message.textContent = "";
      message.className = "form-message";

      const formData = new FormData(form);
      await presenter.handleSubmit(formData, photoDataInput?.value);
    });

    window.addEventListener("beforeunload", this.stopCamera);
  },

  setupMap(latInput, lonInput) {
    map = L.map("map").setView([-6.2, 106.8], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lonInput.value = lng.toFixed(6);

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });
  },

  setupCamera(video, canvas, photoDataInput) {
    const startCameraBtn = document.getElementById("start-camera");
    const takePhotoBtn = document.getElementById("take-photo");

    // Tambahkan dukungan untuk getUserMedia lama
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    startCameraBtn.addEventListener("click", () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = mediaStream;
            video.style.display = "block";
            takePhotoBtn.style.display = "inline-block";
          })
          .catch((err) => {
            alert("Tidak bisa mengakses kamera: " + err.message);
          });
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { video: true },
          (mediaStream) => {
            stream = mediaStream;
            video.srcObject = mediaStream;
            video.style.display = "block";
            takePhotoBtn.style.display = "inline-block";
          },
          (err) => {
            alert("Tidak bisa mengakses kamera (versi lama): " + err.message);
          }
        );
      } else {
        alert("Kamera tidak didukung di browser ini.");
      }
    });

    takePhotoBtn.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.style.display = "block";

      const imageData = canvas.toDataURL("image/jpeg");
      photoDataInput.value = imageData;

      this.stopCamera();
      video.style.display = "none";
      takePhotoBtn.style.display = "none";
    });
  },

  stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  },

  destroy() {
    this.stopCamera();
    if (map) {
      if (marker) {
        map.removeLayer(marker);
      }
      map.remove();
      map = null;
      marker = null;
    }
  },
};

export default AddStoryPage;
