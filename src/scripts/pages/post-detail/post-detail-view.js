export default class PostDetailView {
  constructor() {
    this.storyDetailContainer = null;
    this.backButton = null;
    this.bookmarkButton = null;
    this.onBackClick = null;
    this.onBookmarkToggle = null;
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

  showStoryDetail(story, placeName, isBookmarked = false) {
    const bookmarkIcon = isBookmarked ? '❤️' : '🤍';
    const bookmarkText = isBookmarked ? 'Remove Bookmark' : 'Add Bookmark';
    
    this.storyDetailContainer.innerHTML = `
        <div class="story-header">
          <h2>${story.name}</h2>
          <button id="bookmark-button" class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                  title="${bookmarkText}">
            <span class="bookmark-icon">${bookmarkIcon}</span>
            <span class="bookmark-text">${bookmarkText}</span>
          </button>
        </div>
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
        ${isBookmarked ? '<p class="bookmark-status">📚 This story is bookmarked</p>' : ''}
      `;

    // Add event listener to bookmark button
    this.bookmarkButton = document.getElementById("bookmark-button");
    this.bookmarkButton.addEventListener("click", () => {
      if (this.onBookmarkToggle) {
        this.onBookmarkToggle(story, isBookmarked);
      }
    });
  }

  updateBookmarkButton(isBookmarked) {
    if (this.bookmarkButton) {
      const bookmarkIcon = isBookmarked ? '❤️' : '🤍';
      const bookmarkText = isBookmarked ? 'Remove Bookmark' : 'Add Bookmark';
      
      this.bookmarkButton.className = `bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`;
      this.bookmarkButton.title = bookmarkText;
      this.bookmarkButton.querySelector('.bookmark-icon').textContent = bookmarkIcon;
      this.bookmarkButton.querySelector('.bookmark-text').textContent = bookmarkText;
      
      // Update bookmark status message
      const existingStatus = this.storyDetailContainer.querySelector('.bookmark-status');
      if (isBookmarked && !existingStatus) {
        const statusElement = document.createElement('p');
        statusElement.className = 'bookmark-status';
        statusElement.textContent = '📚 This story is bookmarked';
        this.storyDetailContainer.appendChild(statusElement);
      } else if (!isBookmarked && existingStatus) {
        existingStatus.remove();
      }
    }
  }

  showBookmarkMessage(message, isSuccess = true) {
    // Create temporary message element
    const messageElement = document.createElement('div');
    messageElement.className = `bookmark-message ${isSuccess ? 'success' : 'error'}`;
    messageElement.textContent = message;
    
    // Add to container
    this.storyDetailContainer.insertBefore(messageElement, this.storyDetailContainer.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }
}