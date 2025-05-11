import "../styles/styles.css";
import App from "./pages/app";

const updateActiveNavLink = () => {
  const navLinks = document.querySelectorAll("#nav-list a");
  const currentHash = window.location.hash || "#/";

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentHash) {
      link.style.backgroundColor = "#d1ecf1";
      link.style.borderRadius = "8px";
      link.style.padding = "8px 12px";
    } else {
      link.style.backgroundColor = "";
      link.style.borderRadius = "";
      link.style.padding = "";
    }
  });
};

document.addEventListener("DOMContentLoaded", updateActiveNavLink);
window.addEventListener("hashchange", updateActiveNavLink);

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
