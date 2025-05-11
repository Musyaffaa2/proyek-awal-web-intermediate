import HomePage from "../pages/home/home-page";
import UploadStoryPage from "../pages/upload-story/upload-story-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import PostDetailPage from "../pages/post-detail/post-detail-page";

const routes = {
  "/": new HomePage(),
  "/login": new LoginPage(),
  "/story": new UploadStoryPage(),
  "/register": new RegisterPage(),
  "/story/:id": new PostDetailPage(),
};

export default routes;
