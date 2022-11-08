<script setup lang="ts">
import router from "@/router";
import { directus } from "@/services/directus.service";
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCard,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  RefresherCustomEvent,
} from "@ionic/vue";
import { ref } from "vue";
import "nes.css/css/nes.min.css";
import "@fontsource/press-start-2p";

const listings = ref([]);
const userAccessToken = localStorage.getItem("auth_token");

//Henter annonser når du trykker inn på siden
onIonViewDidEnter(() => {
  fetchListings();
});
//Dra opp for å refreshe siden
const refreshListings = async (event: RefresherCustomEvent) => {
  await fetchListings();
  event.target.complete();
};

//Logge ut av applikasjonen / fjerner nåværende auth_token
const logOut = () => {
  localStorage.clear();
  router.replace("/authentication");
};

//GraphQL query
const fetchListings = async () => {
  const response = await directus.graphql.items(`
    query {
      listings_collection {
        id,
        title,
        image{
          id
        },
        description,
        platform,
        price,
        user_created {
          first_name
        }
      }
    }
  `);

  //Sjekke om graphql query kom igjennom
  if (response.status === 200 && response.data) {
    console.log("tiddies");
    listings.value = [...response.data.listings_collection];
    console.log(listings.value);
  }
};

/*const checkIfLoggedIn = () => {
  if (!userAccessToken) {
    router.replace("/authentication");
  }
};*/
</script>

<style scoped>
ion-title,
ion-card-header,
ion-content,
ion-card-content {
  font-family: "Press Start 2P";
}

ion-button {
  font-family: "Press Start 2P";
  margin: 10px auto;
  font-size: small;
}

#button-fix {
  border: 2px;
  font-family: "Press Start 2P";
  font-size: small;
}

ion-content {
  overflow-y: scroll;
}
</style>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Annonser</ion-title>
        <ion-buttons slot="end">
          <ion-button
            id="button-fix"
            class="nes-btn is-warning"
            color="dark"
            router-link="/profilepage"
            >👤</ion-button
          >
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            id="button-fix"
            class="nes-btn is-success"
            color="dark"
            router-link="/new-spot"
            >+</ion-button
          >
        </ion-buttons>
        <ion-buttons slot="start">
          <ion-button class="nes-btn is-error" id="button-fix" @click="logOut"
            ><i class="nes-icon close is-small"></i
          ></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="refreshListings($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-card
        class="nes-container is-white with-title"
        v-for="listing in listings"
        :key="listing.id"
        :router-link="'/detail/' + listing.id"
        :id="listing.id"
      >
        <img
          :src="`https://xqiwp95r.directus.app/assets/${listing.image.id}`"
        />
        <ion-card-header>
          <ion-card-title class="title">{{ listing.title }}</ion-card-title>
          <ion-card-subtitle>{{ listing.platform }}</ion-card-subtitle>
          <ion-card-content>{{ listing.price + ",-" }}</ion-card-content>
        </ion-card-header>

        <ion-card-content class="nes-container is-dark is-centered">
          {{ listing.description }}
          {{ listings.first_name }}
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
