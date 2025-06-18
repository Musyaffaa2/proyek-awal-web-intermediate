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
    try {
      this._updateAuthButton();
      const url = getActiveRoute();
      const page = routes[url];

      if (page) {
        // Route exists, render the page normally
        await navigateWithTransition(async () => {
          this.#content.innerHTML = await page.render();
          if (page.afterRender) {
            await page.afterRender();
          }
        });
      } else {
        // Route doesn't exist, show 404 page
        await this._render404Page();
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      await this._render404Page();
    }
  }

  async _render404Page() {
    try {
      const notFoundPage = routes['/404'];
      
      if (notFoundPage) {
        await navigateWithTransition(async () => {
          this.#content.innerHTML = await notFoundPage.render();
          if (notFoundPage.afterRender) {
            await notFoundPage.afterRender();
          }
        });
      } else {
        // Fallback jika NotFoundPage tidak tersedia
        await navigateWithTransition(async () => {
          this.#content.innerHTML = `
            <div style="text-align: center; padding: 2rem; min-height: 60vh; display: flex; flex-direction: column; justify-content: center;">
              <h1 style="font-size: 4rem; color: #e74c3c; margin-bottom: 1rem;">404</h1>
              <h2 style="color: #2c3e50; margin-bottom: 1rem;">Halaman Tidak Ditemukan</h2>
              <p style="color: #7f8c8d; margin-bottom: 2rem;">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
              <div>
                <a href="#/" style="background: #3498db; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 5px; margin-right: 1rem;">
                  Kembali ke Beranda
                </a>
                <button onclick="history.back()" style="background: #95a5a6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 5px; cursor: pointer;">
                  Halaman Sebelumnya
                </button>
              </div>
            </div>
          `;
        });
      }
      
      // Update document title untuk SEO
      document.title = '404 - Halaman Tidak Ditemukan';
      
    } catch (error) {
      console.error('Error rendering 404 page:', error);
      this.#content.innerHTML = '<div style="text-align: center; padding: 2rem;">Error loading page</div>';
    }
  }
}

export default App;