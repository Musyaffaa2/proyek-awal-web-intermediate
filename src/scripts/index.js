import { Workbox } from "workbox-window";
import "../styles/styles.css";
import CONFIG from "./config";
import App from "./pages/app";
import { subscribeNotification } from "./data/api";

const updateActiveNavLink = () => {
  const navLinks = document.querySelectorAll("#nav-list a");
  const currentHash = window.location.hash || "#/";

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentHash) {
      link.style.backgroundColor = "#d1ecf1";
      link.style.borderRadius = "8px";
      link.style.padding = "8px 12px";
    } else {
      link.style.backgroundColor = "";
      link.style.borderRadius = "";
      link.style.padding = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", updateActiveNavLink);
window.addEventListener("hashchange", updateActiveNavLink);

document.addEventListener("DOMContentLoaded", async () => {
  registerSW();

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  document.querySelector("#enable-push").addEventListener("click", initPush);

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});

// Register service worker
const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const wb = new Workbox("./sw.js");
      wb.register();
    });
  }
};

// Subscribe to push notifications
async function initPush() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.error('Permission for notifications was denied');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.error('Service worker not registered');
      return;
    }

    // check if the user is already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
      console.log('Already subscribed to push notifications:', existingSubscription);
      alert('Already subscribed to push notifications, unsubscribing...');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: CONFIG.PUBLIC_VAPID_KEY
    });
    if (!subscription) {
      console.error('Failed to subscribe to push notifications');
      return;
    }

    const subsJson = subscription.toJSON();
    const res = await subscribeNotification({
      endpoint: subscription.endpoint,
      keys: {
        auth: subsJson.keys.auth,
        p256dh: subsJson.keys.p256dh
      },
    });

    alert('Subscribed to push notifications successfully');
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return;
  }
}
