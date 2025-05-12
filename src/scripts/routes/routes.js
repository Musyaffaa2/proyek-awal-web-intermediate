import HomePage from "../pages/home/home-page";
import UploadStoryPage from "../pages/upload-story/upload-story-page";
import AuthPage from "../pages/auth/auth-page.js";
import PostDetailPage from "../pages/post-detail/post-detail-page";

const routes = {
  "/": new HomePage(),
  "/login": new AuthPage("login"),
  "/register": new AuthPage("register"),
  "/story": new UploadStoryPage(),
  "/story/:id": new PostDetailPage(),
};

export default routes;
