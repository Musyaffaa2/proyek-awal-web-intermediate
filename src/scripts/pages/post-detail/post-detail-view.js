export default class PostDetailView {
  constructor() {
    this.storyDetailContainer = null;
    this.backButton = null;
    this.onBackClick = null;
  }

  init() {
    this.storyDetailContainer = document.getElementById("story-detail");
    this.backButton = document.getElementById("back-button-dtl");

    this.backButton.addEventListener("click", () => {
      if (this.onBackClick) {
        this.onBackClick();
      }
    });
  }

  showLoading() {
    this.storyDetailContainer.innerHTML = "Loading...";
  }

  showError(message) {
    this.storyDetailContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }

  showStoryDetail(story, placeName) {
    this.storyDetailContainer.innerHTML = `
        <h2>${story.name}</h2>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
        <p class="story-desc">${story.description}</p>
        <div class="story-image-container">
          <img class="story-image" src="${story.photoUrl}" alt="${story.name}'s story image" />
        </div>
        <div class="story-location">
          <div class="story-location-alt">
            <p>Latitude: ${story.lat}</p>
            <p>Longitude: ${story.lon}</p>
          </div>
          <p>${placeName}</p>
        </div>
      `;
  }
}
