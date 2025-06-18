import { getPlaceNameByCoordinate } from "../../utils/map";
import Database from "../../data/db"; 

export default class PostDetailPresenter {
  constructor(view, getStoryUseCase, router) {
    this.view = view;
    this.getStoryUseCase = getStoryUseCase;
    this.router = router;
    this.currentStory = null;

    this.view.onBackClick = this.handleBackClick.bind(this);
    this.view.onBookmarkToggle = this.handleBookmarkToggle.bind(this);
  }

  async handleBackClick() {
    this.router.redirectToHome();
  }

  async handleBookmarkToggle(story, isCurrentlyBookmarked) {
    try {
      if (isCurrentlyBookmarked) {
        // Remove bookmark
        const success = await Database.removeStory(story.id);
        if (success) {
          this.view.updateBookmarkButton(false);
          this.view.showBookmarkMessage("Story removed from bookmarks!", true);
        } else {
          this.view.showBookmarkMessage("Failed to remove bookmark. Please try again.", false);
        }
      } else {
        // Add bookmark
        const success = await Database.saveStory(story);
        if (success) {
          this.view.updateBookmarkButton(true);
          this.view.showBookmarkMessage("Story bookmarked successfully!", true);
        } else {
          // Check if story already exists
          const isAlreadySaved = await Database.isStorySaved(story.id);
          if (isAlreadySaved) {
            this.view.updateBookmarkButton(true);
            this.view.showBookmarkMessage("Story is already bookmarked!", true);
          } else {
            this.view.showBookmarkMessage("Failed to bookmark story. Please try again.", false);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      this.view.showBookmarkMessage("An error occurred. Please try again.", false);
    }
  }

  async loadStory() {
    const url = location.hash.split("/");
    const storyId = url[url.length - 1];

    if (!storyId || storyId === "story") {
      this.view.showError("No story ID provided");
      return;
    }

    try {
      this.view.showLoading();
      
      // Fetch story details
      const { story } = await this.getStoryUseCase(storyId);
      this.currentStory = story;
      
      // Get place name
      const placeName = await getPlaceNameByCoordinate(story.lat, story.lon);
      
      // Check if story is bookmarked
      const isBookmarked = await Database.isStorySaved(story.id);
      
      // Display story with bookmark status
      this.view.showStoryDetail(story, placeName, isBookmarked);
    } catch (error) {
      this.view.showError(`Failed to fetch story details: ${error.message}`);
    }
  }

  // Additional method to get bookmark status
  async getBookmarkStatus(storyId) {
    try {
      return await Database.isStorySaved(storyId);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return false;
    }
  }

  // Method to get all bookmarked stories (useful for navigation)
  async getAllBookmarkedStories() {
    try {
      return await Database.getAllStories();
    } catch (error) {
      console.error("Error getting bookmarked stories:", error);
      return [];
    }
  }
}