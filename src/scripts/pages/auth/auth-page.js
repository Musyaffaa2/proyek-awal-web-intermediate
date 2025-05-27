import AuthView from "./auth-view.js";
import AuthPresenter from "./auth-presenter.js";
import { login as apiLogin, register as apiRegister } from "../../data/api.js";

/**
 * AuthPage bertindak sebagai pengganti Model dalam pola MVP.
 * Di sini dilakukan semua logika terkait data seperti memanggil API dan menyimpan token di localStorage.
 */
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
    this.mode = mode;
    this.view = new AuthView(this.mode);
    this.presenter = new AuthPresenter(this.view, this, router, this.mode);
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    this.view.init();
  }

  async login(email, password) {
    const response = await apiLogin(email, password);
    if (!response.error) {
      localStorage.setItem("token", response.loginResult.token);
    }
    return response;
  }

  async register(name, email, password) {
    return await apiRegister(name, email, password);
  }
}
