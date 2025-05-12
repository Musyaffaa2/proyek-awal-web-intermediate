import AuthView from "./auth-view.js";
import AuthPresenter from "./auth-presenter.js";
import { login, register } from "../../data/api.js";

const router = {
  redirectToHome: () => {
    window.location.hash = "#/";
  },
  redirectToLogin: () => {
    window.location.hash = "#/login";
  },
  redirectToRegister: () => {
    window.location.hash = "#/register";
  }
};

export default class AuthPage {
  constructor(mode = "login") {
    this.mode = mode; // "login" or "register"
    this.view = new AuthView(this.mode);
    this.presenter = new AuthPresenter(this.view, { login, register }, router, this.mode);
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    this.view.init();
  }
}
