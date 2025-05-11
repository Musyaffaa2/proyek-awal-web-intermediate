export default class LoginView {
    constructor() {
      this.form = null;
      this.result = null;
      this.submitButton = null;
      this.onSubmit = null;
    }
  
    init() {
      this.form = document.getElementById("login-form");
      this.result = document.getElementById("login-result");
      this.submitButton = this.form.querySelector("button[type='submit']");
  
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.onSubmit) {
          const email = this.form.email.value;
          const password = this.form.password.value;
          this.onSubmit(email, password);
        }
      });
    }
  
    showLoading() {
      this.submitButton.disabled = true;
      this.submitButton.innerText = "Loading...";
    }
  
    hideLoading() {
      this.submitButton.disabled = false;
      this.submitButton.innerText = "Login";
    }
  
    showSuccess(message) {
      this.result.innerHTML = `<p style="color: green;">${message}</p>`;
    }
  
    showError(message) {
      this.result.innerHTML = `<p style="color: red;">${message}</p>`;
    }
  }
  