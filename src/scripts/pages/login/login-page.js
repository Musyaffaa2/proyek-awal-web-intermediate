import LoginView from "./login-view";
import LoginPresenter from "./login-presenter";
import { login } from "../../data/api";

const router = {
  redirectToHome: () => {
    window.location.hash = "#/";
  },
};

export default class LoginPage {
  constructor() {
    this.view = new LoginView();
    this.presenter = new LoginPresenter(this.view, login, router);
  }

  async render() {
    return `
      <section class="container">
        <div id="login-header">
          <h1>Login Page</h1>
          <div id="fill-form"></div>
          <form id="login-form">
            <div id="email-form">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div id="password-form">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Login</button>
          </form>
          <p id="reg_acc">
            Doesn't have an account?<br>
            <a href="#/register">Register Here!</a>
          </p>
          <div id="login-result"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.view.init();
  }
}
