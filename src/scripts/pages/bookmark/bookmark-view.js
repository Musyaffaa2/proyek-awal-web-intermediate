export default class BookmarkView {
  constructor() {
    this.container = null
    this.onStoryClick = null;
  }

  init() {
    this.storiesContainer = document.getElementById("bookmark-list");
    this.loadingContainer = document.getElementById("loading");
  }

  showLoading() {
    this.storiesContainer.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
  }

  showError(message) {
    this.storiesContainer.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
  }

  showStories(stories) {
    const html = stories
      .map(
        (story) => `
          <div class="story" data-id="${story.id}">
            <h2>${story.name}</h2>
            <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
            <p class="story-desc">${story.description}</p>
            <div class="story-image-container">
              <img class="story-image" src="${story.photoUrl}" alt="${story.name}'s story image" />
            </div>
          </div>
        `
      )
      .join("");

    this.storiesContainer.innerHTML = html;

    this.storiesContainer.querySelectorAll(".story").forEach((storyElement) => {
      storyElement.addEventListener("click", () => {
        const storyId = storyElement.getAttribute("data-id");
        if (this.onStoryClick) {
          this.onStoryClick(storyId);
        }
      });
    });

    console.log("BookmarkView: showStories", stories);
  }

  showEmptyState() {
    this.storiesContainer.innerHTML = `
      <div class="empty-state">
        <p>No bookmarks found.</p>
      </div>
    `;
  }
}
