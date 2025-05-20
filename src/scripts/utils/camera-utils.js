export async function getDataFromCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement("video");
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.play();
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Ambil snapshot sebagai base64 (atau bisa disesuaikan dengan format lain)
      const photo = canvas.toDataURL("image/png");
      stream.getTracks().forEach((track) => track.stop()); // Nonaktifkan stream setelah mengambil gambar
      resolve(photo);
    };
  });
}
