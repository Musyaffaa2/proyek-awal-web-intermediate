import HomeView from "./home-view";
import HomePresenter from "./home-presenter";
import { getStories } from "../../data/api";
import { navigateWithTransition } from "../../utils/view-trans";

export default class HomePage {
  constructor() {
    this.view = new HomeView();
    this.presenter = new HomePresenter(this.view, { getStories }, navigateWithTransition);
  }

  async render() {
    if (!localStorage.getItem("token")) {
      window.location.hash = "#/login";
      return;
    }

    return `
      <section class="container">
        <h1>Home Page</h1>
        <section id="main-content" class="stories" tabindex="-1"></section>
        <div id="map" class="map"></div>
        <div id="loading">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
        <div class="pagination">
          <button id="prev-page" disabled>Prev</button>
          <span id="current-page">Page 1</span>
          <button id="next-page">Next</button>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.view.init();
    await this.presenter.loadStories();

    document.getElementById("skip-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      const content = document.getElementById("main-content");
      if (content) {
        content.focus();
        content.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}
