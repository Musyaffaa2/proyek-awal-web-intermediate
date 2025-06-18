import Database from "../../data/db";
import { navigateWithTransition } from "../../utils/view-trans";
import BookmarkPresenter from "./bookmark-presenter";
import BookmarkView from "./bookmark-view";

export default class BookmarkPage {
  constructor() {
    this.view = new BookmarkView();
    this.presenter = new BookmarkPresenter(this.view, navigateWithTransition, Database);
  }

  async render() {
    if (!localStorage.getItem("token")) {
      window.location.hash = "#/login";
      return;
    }

    return `
      <section class="container">
        <h1>Bookmark Page</h1>
        <section id="bookmark-list" class="stories"></section>
        <div id="loading">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.view.init();
    console.log("BookmarkPage afterRender");
    await this.presenter.loadStoriesBookmark();
  }
}
