
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import CONFIG from './config';

const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

registerRoute(
  ({ url, request }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return url.origin === baseUrl.origin === request.destination !== 'image' ;
  },
  new NetworkFirst({
    cacheName: 'api-cache',
  })
)

registerRoute(
  ({ url, request}) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return url.origin === baseUrl.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'image-cache',
  })
)

registerRoute(
  ({ url }) => {
    return url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('bootstrap-icons')
  },
  new CacheFirst({
    cacheName: 'bootstrap-icons',
  })
)

self.addEventListener('push', (event) => {
  let data = {
    title: 'Push Notification',
    body: 'This is a push notification',
  }

  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: 'images/logo.png',
    badge: 'images/logo.png',
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})
