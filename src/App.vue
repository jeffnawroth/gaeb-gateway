<template>
  <v-app id="inspire">
    <AppBar />
    <v-main class="grey lighten-3">
      <NotificationContainer />
      <MainApp>
        <router-view />
      </MainApp>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NotificationContainer from "@/components/Notifcation/NotificationContainer.vue";
import AppBar from "@/components/Layout/AppBar.vue";
import MainApp from "@/views/MainApp.vue";
export default Vue.extend({
  components: {
    AppBar,
    MainApp,
    NotificationContainer,
  },
  data: () => ({}),
});
</script>
