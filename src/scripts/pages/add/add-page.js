import { postData } from '../../scripts/data/api.js';

export default class AddPage {
  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita</h1>
        <form id="story-form">
          <label for="name">Nama:</label>
          <input type="text" id="name" name="name" required />

          <label for="description">Deskripsi:</label>
          <textarea id="description" name="description" required></textarea>

          <label for="photo">Ambil Gambar:</label>
          <video id="camera" autoplay></video>
          <button type="button" id="take-photo">Ambil Foto</button>
          <canvas id="snapshot" style="display: none;"></canvas>

          <label for="location">Klik di peta untuk lokasi:</label>
          <div id="map" style="height: 200px;"></div>

          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Kamera
    const video = document.getElementById('camera');
    const canvas = document.getElementById('snapshot');
    const button = document.getElementById('take-photo');
    let stream;

    if (navigator.mediaDevices.getUserMedia) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    }

    button.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      canvas.style.display = 'block';
    });

    // Map
    let lat = 0;
    let lon = 0;
    const map = L.map('map').setView([-6.200000, 106.816666], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    let marker;

    map.on('click', function (e) {
      lat = e.latlng.lat;
      lon = e.latlng.lng;
      if (marker) marker.remove();
      marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`Lokasi dipilih: ${lat}, ${lon}`).openPopup();
    });

    // Form submit
    const form = document.getElementById('story-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = form.name.value;
      const description = form.description.value;
      const photo = canvas.toDataURL();
      const data = { name, description, photo, lat, lon };

      const token = 'YOUR_TOKEN_HERE';
      await postData(data, token);
      alert('Cerita berhasil ditambahkan!');
      stream.getTracks().forEach((track) => track.stop());
      location.hash = '/';
    });
  }
}
