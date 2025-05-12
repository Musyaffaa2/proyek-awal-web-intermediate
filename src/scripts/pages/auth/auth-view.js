export default class AuthView {
  constructor(mode) {
    this.mode = mode;
    this.form = null;
    this.result = null;
    this.submitButton = null;
    this.onSubmit = null;
  }

  getTemplate() {
    const isLogin = this.mode === "login";

    return `
      <section class="container">
        <div id="auth-header">
          <h1>${isLogin ? "Login Page" : "Register Page"}</h1>
          <div id="fill-form"></div>
          <form id="auth-form">
            ${!isLogin ? `
              <div id="name-form">
                <label for="username">Name</label>
                <input type="text" id="username" name="username" required />
              </div>` : ""
            }
            <div id="email-form">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div id="password-form">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">${isLogin ? "Login" : "Register"}</button>
          </form>
          <p id="switch-mode">
            ${isLogin
              ? `Doesn't have an account?<br><a href="#/register">Register Here!</a>`
              : `Already have an account?<br><a href="#/login">Login Here!</a>`
            }
          </p>
          <div id="auth-result"></div>
        </div>
      </section>
    `;
  }

  init() {
    this.form = document.getElementById("auth-form");
    this.result = document.getElementById("auth-result");
    this.submitButton = this.form.querySelector("button[type='submit']");

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.onSubmit) {
        const email = this.form.email.value;
        const password = this.form.password.value;
        if (this.mode === "login") {
          this.onSubmit(email, password);
        } else {
          const name = this.form.username.value;
          this.onSubmit(name, email, password);
        }
      }
    });
  }

  showLoading() {
    this.submitButton.disabled = true;
    this.submitButton.innerText = "Loading...";
  }

  hideLoading() {
    this.submitButton.disabled = false;
    this.submitButton.innerText = this.mode === "login" ? "Login" : "Register";
  }

  showSuccess(message) {
    this.result.innerHTML = `<p style="color: green;">${message}</p>`;
  }

  showError(message) {
    this.result.innerHTML = `<p style="color: red;">${message}</p>`;
  }
}
