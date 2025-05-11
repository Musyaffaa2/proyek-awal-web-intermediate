import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pinIcon from "/images/pin.png";

export default class HomeView {
  constructor() {
    this.storiesContainer = null;
    this.mapElement = null;
    this.map = null;
    this.prevButton = null;
    this.nextButton = null;
    this.currentPageText = null;
    this.loadingElement = null;

    this.onNext = null;
    this.onPrev = null;
    this.onStoryClick = null;

    this.customIcon = L.icon({
      iconUrl: pinIcon,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });
  }

  init() {
    this.storiesContainer = document.querySelector(".stories");
    this.mapElement = document.getElementById("map");
    this.prevButton = document.getElementById("prev-page");
    this.nextButton = document.getElementById("next-page");
    this.currentPageText = document.getElementById("current-page");
    this.loadingElement = document.getElementById("loading");

    // Inisialisasi peta
    this.map = L.map(this.mapElement).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    // Event pagination
    this.prevButton.addEventListener("click", () => {
      if (this.onPrev) this.onPrev();
    });

    this.nextButton.addEventListener("click", () => {
      if (this.onNext) this.onNext();
    });
  }

  renderStories(stories, currentPage, pageSize) {
    const html = stories
      .map(
        (story) => `
        <div class="story" data-id="${story.id}">
          <h2>${story.name}</h2>
          <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
          <p>${story.description}</p>
          <div class="story-image-container">
            <img class="story-image" src="${story.photoUrl}" alt="${story.name}'s story image" />
          </div>
        </div>
      `
      )
      .join("");

    this.storiesContainer.innerHTML = html;
    this.currentPageText.textContent = `Page ${currentPage}`;
    this.prevButton.disabled = currentPage === 1;
    this.nextButton.disabled = stories.length < pageSize;

    // Hapus marker lama
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    // Tambahkan marker baru
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon], { icon: this.customIcon })
          .addTo(this.map)
          .bindPopup(this.getPopupHTML(story));

        marker.on("popupopen", () => {
          const previewButton = document.getElementById(`preview-${story.id}`);
          if (previewButton) {
            previewButton.addEventListener("click", () => {
              if (this.onStoryClick) this.onStoryClick(story.id);
            });
          }
        });
      }
    });

    // Tambahkan event click ke story di bawah peta
    document.querySelectorAll(".story").forEach((storyElement) => {
      storyElement.addEventListener("click", () => {
        const id = storyElement.getAttribute("data-id");
        if (this.onStoryClick) this.onStoryClick(id);
      });
    });
  }

  getPopupHTML(story) {
    return `
      <div style="text-align: center;">
        <img src="${story.photoUrl}" alt="${story.name}" 
          style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
        <p><b>${story.name}</b></p>
        <button id="preview-${story.id}" 
          style="background-color: #4caf50; color: white; border: none; padding: 5px 10px; 
                 border-radius: 5px; cursor: pointer;">
          View Details
        </button>
      </div>
    `;
  }

  showError(message) {
    this.storiesContainer.innerHTML = `<p class="error-message" style="color: red;">${message}</p>`;
    this.prevButton.disabled = true;
    this.nextButton.disabled = true;
  }

  showLoading() {
    this.loadingElement.style.display = "block";
    this.prevButton.disabled = true;
    this.nextButton.disabled = true;
  }

  hideLoading() {
    this.loadingElement.style.display = "none";
  }
}
