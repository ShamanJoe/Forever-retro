<script setup lang="ts">
import { directus } from "@/services/directus.service";
import { Camera, CameraResultType } from "@capacitor/camera";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  toastController,
} from "@ionic/vue";
import { add, trashOutline } from "ionicons/icons";
import { ref } from "vue";

// Keeps track of the input field for new hashtags
const newPlatform = ref("");
const isUploadingListing = ref(false);

// Keeps track of all data input from the user towards adding a new camp spot
const newListing = ref({
  title: "",
  image: "",
  description: "",
  platform: [],
  price: "",
});

// Add whatever is in the hashtag input field to the camp spot's array of hashtags
const addPlatform = () => {
  // Avoid adding empty hashtags
  if (newPlatform.value) {
    newListing.value.platform.push(newPlatform.value); // LES: Det er ikke farlig hvis du får røde squiggly lines her, det skal vi senere fikse med TypeScript
    newPlatform.value = "";
  }
};

// Handle data POSTing
const postnewListing = async () => {
  if (!newListing.value.image) {
    alert("Du må laste opp bilde");
    return;
  }

  try {
    isUploadingListing.value = true;
    const response = await fetch(newListing.value.image);
    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append("file", imageBlob);
    const fileUpload = await directus.files.createOne(formData);

    if (fileUpload) {
      await directus.items("listings_collection").createOne({
        title: newListing.value.title,
        image: fileUpload.id,
        description: newListing.value.description,
        platform: newListing.value.platform,
        price: newListing.value.price,
      });

      const successToast = await toastController.create({
        message: "Din annonse ble lastet opp!",
        duration: 1500,
        position: "bottom",
        color: "success",
      });

      await successToast.present();
    }

    isUploadingListing.value = false;
  } catch (error) {
    const errorToast = await toastController.create({
      message: "Noe gikk galt ved opplasting av annonse!",
      duration: 2500,
      position: "bottom",
      color: "danger",
    });

    await errorToast.present();
    console.error(error);
    isUploadingListing.value = false;
  }
};

// Open the device's camera and/or file picker UI
const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 10,
    width: 10,
    height: 10,
    allowEditing: false,
    resultType: CameraResultType.Uri,
  });

  if (photo.webPath) {
    newListing.value.image = photo.webPath;
  }
};

// Handle (preview) image removal
const removeImagePreview = () => {
  newListing.value.image = "";
};
</script>

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
        <ion-title>Legg ut</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <!-- Logic for file picking / using camera will be added later -->
        <ion-button
          @click="triggerCamera"
          class="nes-btn is-primary"
          id="image-selector"
          fill="clear"
        >
          Bilde
        </ion-button>

        <section v-if="newListing.image">
          <ion-button
            @click="removeImagePreview"
            fill="default"
            class="remove-image-preview"
          >
            <ion-icon
              slot="icon-only"
              :icon="trashOutline"
              color="danger"
            ></ion-icon>
          </ion-button>
          <img :src="newListing.image" />
        </section>

        <ion-item>
          <ion-input
            type="text"
            class="nes-btn is-disabled"
            placeholder="Tittel"
            v-model="newListing.title"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-textarea
            type="password"
            class="nes-btn is-disabled"
            placeholder="Beskrivelse"
            v-model="newListing.description"
          ></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-input
            class="nes-btn is-disabled"
            placeholder="Plattform"
            type="text"
            v-model="newPlatform"
          ></ion-input>

          <ion-button
            slot="end"
            class="nes-btn is-success"
            fill="clear"
            color="dark"
            @click="addPlatform"
          >
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item lines="none">
          <ion-chip v-for="tag in newListing.platform" :key="tag">{{
            tag
          }}</ion-chip>
        </ion-item>

        <ion-item>
          <ion-input
            type="text"
            class="nes-btn is-disabled"
            placeholder="Pris"
            v-model="newListing.price"
          ></ion-input>
        </ion-item>
        <ion-button
          @click="postnewListing"
          :disabled="isUploadingListing"
          class="nes-btn is-warning"
          id="button-add"
          fill="clear"
          color="dark"
          size="default"
        >
          <ion-spinner v-if="isUploadingListing" name="dots"></ion-spinner>
          <span v-else>Send inn</span>
        </ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-list {
  display: flex;
  flex-direction: column;
}

ion-button,
ion-input,
ion-textarea {
  border: 2px;
}

#inputfield {
}
.label-mild {
  --color: #8a8a8a !important;
}

#image-selector {
  height: 20vh;
  margin: 10px;
  border: 2px;
  border-radius: 8px;
  font-size: medium;
}

.remove-image-preview {
  position: absolute;
  right: 0;
}

#button-add {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
