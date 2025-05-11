export default class HomePresenter {
  constructor(view, api, navigate) {
    this.view = view;
    this.api = api;
    this.navigate = navigate;
    this.currentPage = 1;
    this.pageSize = 12;

    this.view.onNext = this.handleNext.bind(this);
    this.view.onPrev = this.handlePrev.bind(this);
    this.view.onStoryClick = this.handleStoryClick.bind(this);
  }

  async loadStories() {
    try {
      this.view.showLoading();
      const stories = await this.api.getStories(this.currentPage, this.pageSize);
      if (stories.length === 0 && this.currentPage > 1) {
        this.currentPage--;
        return this.loadStories();
      }
      this.view.renderStories(stories, this.currentPage, this.pageSize);
      this.view.map.setView([stories[0]?.lat || 0, stories[0]?.lon || 0], 5);
    } catch (e) {
      this.view.showError(e.message);
    } finally {
      this.view.hideLoading();
    }
  }

  handleNext() {
    this.currentPage++;
    this.loadStories();
  }

  handlePrev() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStories();
    }
  }

  async handleStoryClick(id) {
    await this.navigate(() => {
      window.location.hash = `#/story/${id}`;
    });
  }
}
