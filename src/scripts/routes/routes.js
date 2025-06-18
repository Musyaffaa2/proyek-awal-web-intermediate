import HomePage from "../pages/home/home-page";
import UploadStoryPage from "../pages/upload-story/upload-story-page";
import AuthPage from "../pages/auth/auth-page.js";
import PostDetailPage from "../pages/post-detail/post-detail-page";
import BookmarkPage from "../pages/bookmark/bookmark-page";
import NotFoundPage from "../pages/not-found/not-found-page.js";

const routes = {
  "/": new HomePage(),
  "/login": new AuthPage("login"),
  "/register": new AuthPage("register"),
  "/story": new UploadStoryPage(),
  "/story/:id": new PostDetailPage(),
  "/bookmark": new BookmarkPage(),
  "/404": new NotFoundPage(),
};

export default routes;