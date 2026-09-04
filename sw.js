/* Service worker игры «Моя Жизнь» (PWA). Версия кэша = версия игры. */
const CACHE = 'moya-zhizn-v6.11d';

const ASSETS = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","sounds/alarm.ogg","sounds/applause.ogg","sounds/argue.ogg","sounds/baby_cry.ogg","sounds/beep.ogg","sounds/bell.ogg","sounds/bike.ogg","sounds/breath.ogg","sounds/brush.ogg","sounds/bus.ogg","sounds/cafe.ogg","sounds/camera.ogg","sounds/car.ogg","sounds/cash.ogg","sounds/cheer.ogg","sounds/chew.ogg","sounds/children.ogg","sounds/city.ogg","sounds/clean.ogg","sounds/club.ogg","sounds/cook.ogg","sounds/cough.ogg","sounds/creak.ogg","sounds/creak_floor.ogg","sounds/creak_short.ogg","sounds/creak_slow.ogg","sounds/dance.ogg","sounds/dig.ogg","sounds/door.ogg","sounds/eat.ogg","sounds/engine.ogg","sounds/fire.ogg","sounds/flight.ogg","sounds/gallery.ogg","sounds/garden.ogg","sounds/hair.ogg","sounds/hammer.ogg","sounds/heartbeat.ogg","sounds/home.ogg","sounds/hospital.ogg","sounds/keyring.ogg","sounds/knock.ogg","sounds/laugh.ogg","sounds/lecture.ogg","sounds/mall.ogg","sounds/message.ogg","sounds/metro.ogg","sounds/money.ogg","sounds/music.ogg","sounds/notif.ogg","sounds/nursery.ogg","sounds/page.ogg","sounds/park.ogg","sounds/phone.ogg","sounds/pray.ogg","sounds/pub.ogg","sounds/pump.ogg","sounds/rain.ogg","sounds/restaurant.ogg","sounds/school.ogg","sounds/shower.ogg","sounds/sip.ogg","sounds/sizzle.ogg","sounds/sleep.ogg","sounds/spa.ogg","sounds/splash.ogg","sounds/squeak.ogg","sounds/station.ogg","sounds/steam.ogg","sounds/step.ogg","sounds/step_boots.ogg","sounds/step_heels.ogg","sounds/step_indoor.ogg","sounds/step_light.ogg","sounds/step_soft.ogg","sounds/steps.ogg","sounds/stir.ogg","sounds/store.ogg","sounds/study.ogg","sounds/supermarket.ogg","sounds/talk.ogg","sounds/thunder.ogg","sounds/train.ogg","sounds/typing.ogg","sounds/ui.ogg","sounds/wash.ogg","sounds/water.ogg","sounds/waves.ogg","sounds/whistle.ogg","sounds/work.ogg","sounds/year.ogg"];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys
        .filter(function (key) { return key !== CACHE; })
        .map(function (key) { return caches.delete(key); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        var copy = response.clone();
        if (response && response.ok) {
          var url = new URL(request.url);
          if (url.origin === self.location.origin) {
            caches.open(CACHE).then(function (cache) { cache.put(request, copy); });
          }
        }
        return response;
      }).catch(function () {
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Response.error();
      });
    })
  );
});
