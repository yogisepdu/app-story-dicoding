import { addStory } from "../data/api";

export default class AddStoryPresenter {
  constructor({ onSubmit, onSuccess, onError }) {
    this._onSubmit = onSubmit;
    this._onSuccess = onSuccess;
    this._onError = onError;
  }

  async handleSubmit(formData, photoBase64) {
    try {
      let photo = formData.get("photo");

      if (photoBase64) {
        const blob = await (await fetch(photoBase64)).blob();
        photo = new File([blob], "photo.jpg", { type: blob.type });
      }

      // if (!photo || photo.size === 0) {
      if (!photo || !photo.size) {
        this._onError("❌ Harap unggah atau ambil foto terlebih dahulu.");
        return;
      }

      if (!formData.get("description")?.trim()) {
        this._onError("❌ Deskripsi tidak boleh kosong.");
        return;
      }

      if (!formData.get("lat") || !formData.get("lon")) {
        this._onError("❌ Silakan pilih lokasi pada peta.");
        return;
      }

      const result = await addStory({
        description: formData.get("description"),
        photo,
        lat: formData.get("lat"),
        lon: formData.get("lon"),
      });

      if (result.error || !result) {
        const msg = result?.message || "Gagal menambahkan cerita.";
        this._onError(`❌ ${msg}`);
        return;
      }

      this._onSuccess("✅ Cerita berhasil ditambahkan!");
      this._onSubmit();
    } catch (error) {
      this._onError(`❌ Terjadi kesalahan: ${error.message}`);
    }
  }
}
