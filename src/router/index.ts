import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import DetailPage from "@/views/DetailPage.vue";
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import NewListing from "@/views/NewListing.vue";
import { authService } from "@/services/directus.service";
import { toastController } from "@ionic/vue";
import ProfilePage from "@/views/ProfilePage.vue";

const authenticationREquredRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");

  if (!userAccessToken) {
    return { name: "Login" };
  }

  const userAccessTokenExpiresAt = localStorage.getItem(
    "auth_expires_at"
  ) as unknown as number;

  if (userAccessTokenExpiresAt < new Date().getTime()) {
    const errorToast = await toastController.create({
      message: "Brukersesjon er utløpt – logg inn på nytt",
      duration: 3000,
      color: "warning",
    });

    await errorToast.present();

    await authService.logout();
    return { name: "Login" };
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/authentication",
    name: "Login",
    component: AuthenticationPage,
  },
  {
    path: "/profilepage",
    name: "Profile",
    component: ProfilePage,
    beforeEnter: [authenticationREquredRouteGuard],
  },
  {
    path: "/new-spot",
    name: "NewCampSpot",
    component: NewListing,
    beforeEnter: [authenticationREquredRouteGuard],
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
    beforeEnter: [authenticationREquredRouteGuard],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
