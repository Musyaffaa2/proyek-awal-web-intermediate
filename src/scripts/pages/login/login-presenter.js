export default class LoginPresenter {
    constructor(view, loginUseCase, router) {
      this.view = view;
      this.loginUseCase = loginUseCase;
      this.router = router;
  
      this.view.onSubmit = this.handleLogin.bind(this);
    }
  
    async handleLogin(email, password) {
      try {
        this.view.showLoading();
        const response = await this.loginUseCase(email, password);
  
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
  }
  