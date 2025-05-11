import UploadStoryView from "./upload-story-view";
import UploadStoryPresenter from "./upload-story-presenter";
import { postStory, postGuestStory } from "../../data/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinIcon from "../../../public/images/pin.png";

const router = {
  redirectToHome: () => {
    window.location.hash = "#/";
  },
};

export default class UploadStoryPage {
  constructor() {
    this.view = new UploadStoryView();
    this.presenter = new UploadStoryPresenter(this.view, this.uploadStoryUseCase.bind(this), router);
  }

  async render() {
    const token = localStorage.getItem("token");
    const title = token ? "Add New Story" : "Add New Story (Guest)";

    return `
      <section class="container">
        <h1>${title}</h1>
        <form id="upload-form">
          <div id="photo-upload-section">
            <label for="photo">Photo:</label>
            <!-- Ini akan diisi di afterRender -->
          </div>
          <div id="file-name" style="margin-top:8px; color: #555;"></div>

          <div>
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div>
            <label for="map">Select Location:</label>
            <div id="map" class="map"></div>
          </div>
          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />
          <button type="submit">Upload</button>
        </form>
        <div id="upload-result"></div>
      </section>
    `;
  }

  async afterRender() {
    this.view.init();
    this.setupMap();
    this.setupPhotoUpload();
  }

  setupMap() {
    const map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: pinIcon,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    let marker;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          this.view.latInput.value = latitude;
          this.view.lonInput.value = longitude;

          marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.view.latInput.value = lat;
      this.view.lonInput.value = lng;

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }
    });
  }

  setupPhotoUpload() {
    const photoUploadSection = this.view.photoUploadSection;
    const photoInput = this.view.photoInput;

    photoUploadSection.innerHTML += `
      <div style="display:flex; gap:10px; margin-top:8px;">
        <button type="button" id="gallery-button" style="flex:1; padding:10px; background-color:#2196f3; color:white; border:none; border-radius:8px;">Gallery</button>
        <button type="button" id="camera-button" style="flex:1; padding:10px; background-color:#4caf50; color:white; border:none; border-radius:8px;">Camera</button>
      </div>
    `;

    const galleryButton = document.getElementById("gallery-button");
    const cameraButton = document.getElementById("camera-button");

    galleryButton.addEventListener("click", () => {
      photoInput.removeAttribute("capture");
      photoInput.click();
    });

    cameraButton.addEventListener("click", () => {
      photoInput.setAttribute("capture", "environment");
      photoInput.click();
    });

    photoInput.addEventListener("change", () => {
      if (photoInput.files.length > 0) {
        this.view.updateFileName(photoInput.files[0].name);
      }
    });
  }

  async uploadStoryUseCase(photo, description, lat, lon) {
    const token = localStorage.getItem("token");
    const storyData = {
      description,
      photo,
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
    };

    if (token) {
      return await postStory(storyData);
    } else {
      return await postGuestStory(storyData);
    }
  }
}
