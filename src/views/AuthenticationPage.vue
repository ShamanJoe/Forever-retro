<script setup lang="ts">
import { authService } from "@/services/directus.service";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonListHeader,
  IonPage,
} from "@ionic/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import "nes.css/css/nes.min.css";
import "@fontsource/press-start-2p";

const router = useRouter();

/* State */
// The user can toggle between login and register mode in the form to show/hide additional fields
const inRegisterMode = ref(false);

// Provides two-way data binding between Vue and the input fields in the form
const userDetails = ref({
  firstName: "",
  email: "",
  password: "",
});

const login = async () => {
  try {
    await authService.login(
      userDetails.value.email,
      userDetails.value.password
    );
    router.replace("/home");
  } catch (error) {
    console.error(error);
  }
};
const guestSignIn = () => {
  router.replace("/home");
};
const register = async () => {
  try {
    await authService.register(
      userDetails.value.firstName,
      userDetails.value.email,
      userDetails.value.password
    );
    await login();
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <ion-page>
    <ion-content padding class="background">
      <ion-list-header>
        <ion-label class="headerlabel">Forever-retro</ion-label>
      </ion-list-header>

      <section class="icon-list">
        <i class="nes-bulbasaur"></i>
        <i class="nes-charmander"></i>
        <i class="nes-squirtle"></i>
      </section>

      <hr />

      <ion-item v-if="inRegisterMode" class="input-fields">
        <ion-label class="font" position="floating">Fornavn</ion-label>
        <ion-input v-model="userDetails.firstName"></ion-input>
      </ion-item>

      <ion-item class="input-fields">
        <ion-label position="floating" class="font">Email</ion-label>
        <ion-input type="email" v-model="userDetails.email"></ion-input>
      </ion-item>

      <ion-item class="input-fields">
        <ion-label class="font" position="floating">Passord</ion-label>
        <ion-input type="password" v-model="userDetails.password"></ion-input>
      </ion-item>

      <ion-button
        @click="inRegisterMode = !inRegisterMode"
        class="nes-btn is-warning"
        fill="clear"
      >
        <ion-label>Ny bruker?</ion-label>
      </ion-button>

      <ion-buttons>
        <ion-button
          v-if="inRegisterMode"
          @click="register"
          id="button-fix"
          class="nes-btn is-success"
          fill="clear"
        >
          Registrer deg
        </ion-button>
        <ion-button
          v-else
          @click="login"
          id="button-fix"
          class="nes-btn is-primary"
          fill="clear"
        >
          Logg inn 👾
        </ion-button>
      </ion-buttons>

      <ion-buttons>
        <ion-button
          @click="guestSignIn"
          id="button-fix"
          class="nes-btn is-warning"
          fill="clear"
        >
          Fortsett som gjest
        </ion-button>
      </ion-buttons>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content.background {
  --background: url(../../public/assets/landingpagebackground.jpeg) 0 0/100%
    100% no-repeat;
}

ion-button,
#ny-bruker {
  font-family: "Press Start 2P";
  margin: 10px auto;
  font-size: small;
  display: flex;
}
.headerlabel {
  text-align: center;
}
.font,
.headerlabel {
  font-family: "Press Start 2P";
}

.input-fields {
  border: #8a8a8a 1px solid;
  max-width: fit-content;
  margin: auto;
  border-radius: 20px;
}
</style>
