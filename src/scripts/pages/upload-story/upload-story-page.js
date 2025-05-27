import { postGuestStory, postStory } from "../../data/api";
import { isMobile } from "../../utils/is-mobile";
import { startWebcam, stopWebcam, captureWebcamPhoto } from "../../utils/webcam";
import { updateCoordinates } from "../../utils/map";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinIcon from "../../../public/images/pin.png";

export default class UploadStoryPage {

  getToken() {
    return localStorage.getItem("token"); // Ambil token dari localStorage
  }
  
  async render() {
    const token = localStorage.getItem("token");
    const title = token ? "Add New Story" : "Add New Story (Guest)";

    return `
      <section class="container">
        <h1>${title}</h1>
        <form id="upload-form" tabindex="-1">
          <div id="photo-upload-section">
            <label for="photo">Photo:</label>
          </div>
          <div id="file-name" style="margin-top:8px; color: #555;"></div>
  
          <div>
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div>
            <label for="map">Select Location:</label>
            <div id="map" class="map"></div>
            <div class="coordinates-container" style="display: flex; margin-top: 8px;">
              <input type="text" id="lat-display" readonly style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" placeholder="Latitude">
              <input type="text" id="lon-display" readonly style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-left: 8px;" placeholder="Longitude">
            </div>
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
    const form = document.getElementById("upload-form");
    const resultDiv = document.getElementById("upload-result");
    const latInput = document.getElementById("lat");
    const lonInput = document.getElementById("lon");
    const latDisplay = document.getElementById("lat-display");
    const lonDisplay = document.getElementById("lon-display");
    const photoUploadSection = document.getElementById("photo-upload-section");
    const fileNameDiv = document.getElementById("file-name");
    document.getElementById("skip-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      const form = document.getElementById("upload-form");
      if (form) {
        form.focus();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    // Leaflet map
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
          updateCoordinates(latitude, longitude, latInput, lonInput, latDisplay, lonDisplay);
          marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      updateCoordinates(lat, lng, latInput, lonInput, latDisplay, lonDisplay);
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }
    });

    photoUploadSection.innerHTML += `
      <div style="display:flex; gap:10px; margin-top:8px;">
        <button type="button" id="gallery-button" style="flex:1; padding:10px; background-color:#2196f3; color:white; border:none; border-radius:8px;">Gallery</button>
        <button type="button" id="camera-button" style="flex:1; padding:10px; background-color:#4caf50; color:white; border:none; border-radius:8px;">Camera</button>
      </div>
      <input type="file" id="photo" name="photo" accept="image/*" style="display:none;" required />
    `;

    const photoInput = document.getElementById("photo");
    const galleryButton = document.getElementById("gallery-button");
    const cameraButton = document.getElementById("camera-button");

    const previewDiv = document.createElement("div");
    previewDiv.id = "photo-preview";
    previewDiv.style.marginTop = "8px";
    photoUploadSection.appendChild(previewDiv);

    let webcamStream = null;
    let webcamVideoElement = null;
    let captureButton = null;
    let closeCameraButton = null;

    galleryButton.addEventListener("click", () => {
      stopWebcam(webcamStream);
      webcamStream = null;
      photoInput.removeAttribute("capture");
      photoInput.click();
    });

    cameraButton.addEventListener("click", async () => {
      if (isMobile()) {
        stopWebcam(webcamStream);
        webcamStream = null;
        photoInput.setAttribute("capture", "environment");
        photoInput.click();
      } else {
        if (webcamStream) return;
        webcamVideoElement = document.createElement("video");
        webcamVideoElement.setAttribute("autoplay", "");
        webcamVideoElement.style.width = "100%";
        webcamVideoElement.style.marginTop = "8px";
        photoUploadSection.appendChild(webcamVideoElement);

        captureButton = document.createElement("button");
        captureButton.textContent = "Take Photo";
        captureButton.type = "button";
        Object.assign(captureButton.style, {
          marginTop: "8px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
        });
        photoUploadSection.appendChild(captureButton);

        closeCameraButton = document.createElement("button");
        closeCameraButton.textContent = "Close Camera";
        closeCameraButton.type = "button";
        Object.assign(closeCameraButton.style, {
          marginTop: "8px",
          backgroundColor: "#ff9800",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "8px",
        });
        photoUploadSection.appendChild(closeCameraButton);

        webcamStream = await startWebcam(webcamVideoElement);

        captureButton.addEventListener("click", () => {
          captureWebcamPhoto(webcamVideoElement, (file) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            photoInput.files = dataTransfer.files;
            fileNameDiv.textContent = `Photo captured from webcam`;

            const reader = new FileReader();
            reader.onload = (e) => {
              previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border: 1px solid #ccc; border-radius: 8px; margin-top: 8px;" />`;
            };
            reader.readAsDataURL(file);
          });
          stopWebcam(webcamStream);
          webcamStream = null;
          webcamVideoElement.remove();
          captureButton.remove();
          closeCameraButton.remove();
        });

        closeCameraButton.addEventListener("click", () => {
          stopWebcam(webcamStream);
          webcamStream = null;
          webcamVideoElement.remove();
          captureButton.remove();
          closeCameraButton.remove();
        });
      }
    });

    photoInput.addEventListener("change", () => {
      if (photoInput.files.length > 0) {
        fileNameDiv.textContent = `File selected: ${photoInput.files[0].name}`;

        const file = photoInput.files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            previewDiv.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border: 1px solid #ccc; border-radius: 8px; margin-top: 8px;" />`;
          };
          reader.readAsDataURL(file);
        } else {
          previewDiv.innerHTML = "<p style='color: red;'>Selected file is not an image.</p>";
        }
      } else {
        fileNameDiv.textContent = "";
        previewDiv.innerHTML = "";
      }
    });

    window.addEventListener("hashchange", () => {
      stopWebcam(webcamStream);
    });

    // === Form Submit ===
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const photo = document.getElementById("photo").files[0];
      const description = document.getElementById("description").value;
      const lat = latInput.value;
      const lon = lonInput.value;

      if (!photo) {
        resultDiv.innerHTML = `<p style="color: red;">Please select a photo before uploading!</p>`;
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = token
          ? await postStory({
              description,
              photo,
              lat: lat ? parseFloat(lat) : undefined,
              lon: lon ? parseFloat(lon) : undefined,
            })
          : await postGuestStory({
              description,
              photo,
              lat: lat ? parseFloat(lat) : undefined,
              lon: lon ? parseFloat(lon) : undefined,
            });

        resultDiv.innerHTML = `<p style="color: green;">${response.message}</p>`;
        form.reset();
        fileNameDiv.textContent = "";
        previewDiv.innerHTML = "";
        latDisplay.value = "";
        lonDisplay.value = "";

        if (marker) {
          map.removeLayer(marker);
          marker = null;
        }
      } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
      }
    });
  }
}
