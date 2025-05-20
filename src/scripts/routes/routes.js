import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import AddStoryPage from "../pages/add-story/add-story-page";
import Register from "../pages/register/register.js";
import Login from "../pages/login/login.js";
import StoryDetailPage from "../pages/detail/story-detail-page";
import BookmarkPage from "../pages/bookmark/bookmark-page.js";

const routes = {
  "/": HomePage,
  "/about": AboutPage,
  "/add-story": AddStoryPage,
  "/register": Register,
  "/login": Login,
  "/detail/:id": StoryDetailPage,
  "/bookmarks": BookmarkPage,
};

export default routes;
