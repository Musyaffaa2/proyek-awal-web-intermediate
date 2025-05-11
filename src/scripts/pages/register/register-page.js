import RegisterView from "./register-view";
import RegisterPresenter from "./register-presenter";
import { register } from "../../data/api";

const router = {
  redirectToLogin: () => {
    window.location.hash = "#/login";
  },
};

export default class RegisterPage {
  constructor() {
    this.view = new RegisterView();
    this.presenter = new RegisterPresenter(this.view, register, router);
  }

  async render() {
    return `
      <section class="container">
        <div id="login-header">
          <h1>Register Page</h1>
          <div id="fill-form"></div>
          <form id="login-form">
            <div id="name-form">
              <label for="username">Name</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div id="email-form">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div id="password-form">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Register</button>
          </form>
          <p id="reg_acc">
            Already have an account?<br>
            <a href="#/login">Login Here!</a>
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
