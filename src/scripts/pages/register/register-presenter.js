export default class RegisterPresenter {
    constructor(view, registerUseCase, router) {
      this.view = view;
      this.registerUseCase = registerUseCase;
      this.router = router;
  
      this.view.onSubmit = this.handleRegister.bind(this);
    }
  
    async handleRegister(name, email, password) {
      try {
        this.view.showLoading();
        const response = await this.registerUseCase(name, email, password);
        this.view.showSuccess(response.message);
        this.router.redirectToLogin();
      } catch (error) {
        this.view.showError(error.message);
      } finally {
        this.view.hideLoading();
      }
    }
  }
  