import { getPlaceNameByCoordinate } from "../../utils/map";

export default class PostDetailPresenter {
  constructor(view, getStoryUseCase, router) {
    this.view = view;
    this.getStoryUseCase = getStoryUseCase;
    this.router = router;

    this.view.onBackClick = this.handleBackClick.bind(this);
  }

  async handleBackClick() {
    this.router.redirectToHome();
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
      const { story } = await this.getStoryUseCase(storyId);
      const placeName = await getPlaceNameByCoordinate(story.lat, story.lon);
      this.view.showStoryDetail(story, placeName);
    } catch (error) {
      this.view.showError(`Failed to fetch story details: ${error.message}`);
    }
  }
}
