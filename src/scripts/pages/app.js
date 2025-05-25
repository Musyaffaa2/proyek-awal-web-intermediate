import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { navigateWithTransition } from "../utils/view-trans";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _updateAuthButton() {
    const authButton = document.getElementById("auth-button");
    const token = localStorage.getItem("token");

    if (token) {
      authButton.innerHTML = '<a href="#" id="logout-link">Logout</a>';
      const logoutLink = document.getElementById("logout-link");
      logoutLink?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.hash = "#/login";
      });
    } else {
      authButton.innerHTML = '<a href="#/login">Login</a>';
    }
  }

  async renderPage() {
    this._updateAuthButton();
    const url = getActiveRoute();
    const page = routes[url];

    await navigateWithTransition(async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });
  }
}

export default App;
