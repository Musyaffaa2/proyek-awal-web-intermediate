import UploadStoryView from "./upload-story-view";
import { postStory, postGuestStory } from "../../data/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinIcon from "../../../public/images/pin.png";

// Fungsi utility untuk mengirim data cerita ke API
async function uploadStoryToApi({ photo, description, lat, lon }, token) {
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

const router = {
  redirectToHome: () => {
    window.location.hash = "#/";
  },
};

export default class UploadStoryPresenter {
  constructor() {
    this.view = new UploadStoryView();
    this.map = null;
    this.marker = null;
    this.token = null;
  }

  async render() {
    this.token = this.view.getToken(); // Ambil token dari View
    return this.view.render(this.token);
  }

  async afterRender() {
    this.view.init();
    this.setupMap();
    this.setupPhotoUpload();
    this.setupFormSubmit();
  }

  setupMap() {
    this.map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: pinIcon,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setView([latitude, longitude], 13);
          this.view.setLatitude(latitude);
          this.view.setLongitude(longitude);

          this.marker = L.marker([latitude, longitude], {
            icon: customIcon,
          }).addTo(this.map);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }

    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.view.setLatitude(lat);
      this.view.setLongitude(lng);

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
      }
    });
  }

  setupPhotoUpload() {
    this.view.onGalleryClick = () => {
      this.view.setCaptureMode("none");
      this.view.triggerFileInput();
    };

    this.view.onCameraClick = () => {
      this.view.setCaptureMode("environment");
      this.view.triggerFileInput();
    };

    this.view.addPhotoOptionButtons();
  }

  setupFormSubmit() {
    this.view.onSubmit = async (photo, description, lat, lon) => {
      try {
        this.view.showLoading();
        await uploadStoryToApi({ photo, description, lat, lon }, this.token);
        this.view.showSuccess("Story uploaded successfully!");
        setTimeout(() => {
          router.redirectToHome();
        }, 1500);
      } catch (error) {
        this.view.showError("Failed to upload story: " + error.message);
      }
    };
  }
}
