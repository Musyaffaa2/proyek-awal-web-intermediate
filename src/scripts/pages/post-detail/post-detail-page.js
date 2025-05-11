import PostDetailView from "./post-detail-view";
import PostDetailPresenter from "./post-detail-presenter";
import { getStory } from "../../data/api";

const router = {
  redirectToHome: () => {
    window.location.hash = "#/";
  },
};

export default class PostDetailPage {
  constructor() {
    this.view = new PostDetailView();
    this.presenter = new PostDetailPresenter(this.view, this.getStoryUseCase.bind(this), router);
  }

  async render() {
    return `
      <section class="container">
        <button id="back-button-dtl">Back</button>
        <h1>Story Detail</h1>
        <div id="story-detail"></div>
      </section>
    `;
  }

  async afterRender() {
    this.view.init();
    this.presenter.loadStory();

    document.getElementById("skip-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      const content = document.getElementById("story-detail");
      if (content) {
        content.focus();
        content.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  async getStoryUseCase(storyId) {
    return await getStory(storyId);
  }
}
