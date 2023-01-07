<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
      elevation="0"
    />
    <v-navigation-drawer
      clipped
      app
    />
    <v-main>
      <NotificationContainer />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NotificationContainer from "@/components/Notifcation/NotificationContainer.vue";
export default Vue.extend({
  name: "App",
  components: {
    NotificationContainer,
  },
  data: () => ({
    //
  }),
});
</script>
