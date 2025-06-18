export default class BookmarkPresenter {
  constructor(view, navigate, dbModel) {
    this.view = view;
    this.navigate = navigate;
    this.dbModel = dbModel;

    this.view.onStoryClick = this.handleStoryClick.bind(this);
  }

  async handleStoryClick(id) {
    await this.navigate(() => {
      window.location.hash = `#/story/${id}`;
    });
  }

  async loadStoriesBookmark() {
    const stories = await this.dbModel.getAllStories();

    if (stories.length === 0) {
      this.view.showEmptyState();
    } else {
      this.view.showStories(stories);
    }
  }
}
