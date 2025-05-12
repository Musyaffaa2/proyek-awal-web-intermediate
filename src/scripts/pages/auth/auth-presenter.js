export default class AuthPresenter {
  constructor(view, useCases, router, mode) {
    this.view = view;
    this.mode = mode;
    this.useCases = useCases;
    this.router = router;

    this.view.onSubmit = this.mode === "login"
      ? this.handleLogin.bind(this)
      : this.handleRegister.bind(this);
  }

  async handleLogin(email, password) {
    try {
      this.view.showLoading();
      const response = await this.useCases.login(email, password);

      if (!response.error) {
        this.view.showSuccess(response.message);
        localStorage.setItem("token", response.loginResult.token);
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
      const response = await this.useCases.register(name, email, password);
      this.view.showSuccess(response.message);
      this.router.redirectToLogin();
    } catch (error) {
      this.view.showError(`Register gagal: ${error.message}`);
    } finally {
      this.view.hideLoading();
    }
  }
}
