import * as StoryApiService from "../data/api";
import Swal from "sweetalert2";

const publicVapidKey =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  return await Notification.requestPermission();
}

export async function subscribeUserToPush(token) {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
    }

    const formatted = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
        auth: arrayBufferToBase64(subscription.getKey("auth")),
      },
    };

    await StoryApiService.subscribePushToAPI(formatted, token);
    return true;
  } catch (error) {
    console.error("Push subscription failed:", error);
    return false;
  }
}

export async function unsubscribeUserFromPush(token) {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log("Tidak ada subscription yang aktif.");
      return false;
    }

    const endpoint = subscription.endpoint;

    await subscription.unsubscribe(); // unsubscribe dari browser
    const result = await StoryApiService.unsubscribePushFromAPI(
      endpoint,
      token
    ); // hapus dari backend

    if (!result.error) {
      Swal.fire("Berhasil", "Notifikasi dinonaktifkan.", "success");
      return true;
    } else {
      Swal.fire("Gagal", result.message || "Gagal unsubscribe.", "error");
      return false;
    }
  } catch (error) {
    console.error("Unsubscribe failed:", error);
    Swal.fire("Error", error.message || "Gagal unsubscribe.", "error");
    return false;
  }
}

export async function getPushSubscription() {
  if (!("serviceWorker" in navigator)) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}

export async function showNotificationPrompt(token) {
  try {
    const result = await Swal.fire({
      title: "Aktifkan Notifikasi",
      text: "Ingin menerima notifikasi ketika ada cerita baru?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, aktifkan",
      cancelButtonText: "Nanti saja",
    });

    if (result.isConfirmed) {
      const success = await subscribeUserToPush(token);
      if (success) {
        Swal.fire("Berhasil!", "Notifikasi diaktifkan.", "success");
      } else {
        Swal.fire("Gagal", "Tidak dapat mengaktifkan notifikasi.", "error");
      }
      return success;
    }
    return false;
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    return false;
  }
}

async function handleSubscribeButtonClick(token) {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Cek apakah sudah ada subscription
    const existingSubscription =
      await registration.pushManager.getSubscription();

    if (existingSubscription) {
      alert("Notifikasi sudah di subscribe / diizinkan.");
      return;
    }

    // Kalau belum subscribe, lakukan subscribe
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
      ),
    });

    const result = await subscribePushToAPI(newSubscription, token);

    if (!result.error) {
      alert("Subscribe push notification berhasil!");
    } else {
      alert("Gagal subscribe push notification: " + result.message);
    }
  } catch (error) {
    console.error("Error subscribe:", error);
    alert("Terjadi kesalahan saat subscribe push notification.");
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
