<script setup lang="ts">
import {
  onIonViewDidEnter,
  IonBackButton,
  IonCardHeader,
  IonCardSubtitle,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from "@ionic/vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { directus } from "@/services/directus.service";

//Henter data fra brukers "nåværende" route
const route = useRoute();

/* Retrieve the id parameter from the current route's query string (/detail/:id) */
const { id } = route.params;
const userAccessToken = localStorage.getItem("auth_token");

//Default data før API kobles opp til appen
const listings = ref(null);

//Tilstand
const isLoadingListings = ref(true);

onIonViewDidEnter(() => {
  fetchListing();
  ("");
});

//GraphQL query som henter detaljene fra annonse basert på ID
const fetchListing = async () => {
  const response = await directus.graphql.items(`
    query {
      listings_collection_by_id(id: ${id}) {
        id,
        title,
        image{
          id,
        }
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
    listings.value = response.data.listings_collection_by_id;
    console.log(listings.value);
  }

  isLoadingListings.value = false;
};
</script>

<style scoped>
ion-chip,
ion-card {
  font-family: "Press Start 2P";
}

#header-title {
  font-size: 60%;
  margin-left: 10px;
}
</style>

<template>
  <ion-page>
    <!-- Header  -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/"
            class="nes-btn is-warning"
            id="button-fix"
          ></ion-back-button>
        </ion-buttons>
        <ion-title v-if="isLoadinglistings">
          <ion-spinner></ion-spinner>
        </ion-title>
        <ion-title v-if="listings" id="header-title">{{
          listings.title
        }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="listings && !isLoadingListings">
      <!-- Bilde seksjon -->
      <img
        :src="`https://xqiwp95r.directus.app/assets/${listings.image.id}?access_token=${userAccessToken}`"
      />

      <!-- Annonse informasjon  -->
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Annonse beskrivelse</ion-card-subtitle>
        </ion-card-header>
        <ion-chip
          v-for="platform in listings.platform"
          :key="platform"
          id="platform"
          class="nes-container is-rounded is-dark"
          color="dark"
          >#{{ platform }}</ion-chip
        >
        <ion-card-content>
          {{ listings.description }}
        </ion-card-content>
        <ion-card-content>
          {{ listings.price + ",-" }}
          {{ listings.first_name }}
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
