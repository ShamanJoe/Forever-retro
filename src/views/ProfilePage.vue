<script setup lang="ts">
import {
  onIonViewDidEnter,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { directus } from "@/services/directus.service";

//"Dummy data" for displaying in the UI until we connect the app to an API
const listings = ref(null);

onIonViewDidEnter(() => {
  fetchListing();
  ("");
});

const fetchListing = async () => {
  const response = await directus.graphql.system(`
  query {
	users_me {
    first_name,
		email,
    password
	}
}`);

  if (response.status === 200 && response.data) {
    console.log("Data recieved");

    listings.value = response.data.users_me;
    console.log(listings.value);
  }
};
</script>

<style scoped>
ion-chip,
ion-card,
ion-content,
ion-page,
ion-header,
ion-title {
  font-family: "Press Start 2P";
}
</style>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/"
            class="nes-btn is-warning"
            id="button-fix"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Din profil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="listings">
      <ion-card>
        <ion-card-content> Navn : {{ listings.first_name }} </ion-card-content>
        <ion-card-content> Email : {{ listings.email }} </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
