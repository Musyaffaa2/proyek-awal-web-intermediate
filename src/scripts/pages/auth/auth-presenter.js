export default class AuthPresenter {
  constructor(view, page, router, mode) {
    this.view = view;
    this.page = page;
    this.router = router;
    this.mode = mode;

    this.view.onSubmit = this.mode === "login"
      ? this.handleLogin.bind(this)
      : this.handleRegister.bind(this);
  }

  async handleLogin(email, password) {
    try {
      this.view.showLoading();
      const response = await this.page.login(email, password);

      if (!response.error) {
        this.view.showSuccess(response.message);
        this.router.redirectToHome();
      } else {
        this.view.showError(response.message);
      }
    } catch (error) {
      this.view.showError(`Login gagal: ${error.message}`);
    } finally {
      this.view.hideLoading();
    }
  }

  async handleRegister(name, email, password) {
    try {
      this.view.showLoading();
      const response = await this.page.register(name, email, password);

      if (!response.error) {
        this.view.showSuccess(response.message);
        this.router.redirectToLogin();
      } else {
        this.view.showError(response.message);
      }
    } catch (error) {
      this.view.showError(`Register gagal: ${error.message}`);
    } finally {
      this.view.hideLoading();
    }
  }
}
