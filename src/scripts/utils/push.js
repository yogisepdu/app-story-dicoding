const publicVapidKey =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register(
      "/sw.bundle.js"
    );
    return registration;
  }
  return null;
}

export async function subscribeToPush(registration) {
  const vapidPublicKey =
    "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  return await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export function renderSubscribeButton(container) {
  container.innerHTML = `
    <button id="subscribe-button" class="fab-notification" title="Aktifkan Notifikasi">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon-bell" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a7 7 0 0 0-7 7v4.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 13.586V9a7 7 0 0 0-7-7zm0 20a2.5 2.5 0 0 0 2.45-2h-4.9a2.5 2.5 0 0 0 2.45 2z"/>
      </svg>
    </button>
  `;
}

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
