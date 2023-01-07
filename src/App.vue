<template>
  <v-app>
    <NavigationLayout />
    <v-main>
      <NotificationContainer />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NotificationContainer from "@/components/Notifcation/NotificationContainer.vue";
import NavigationLayout from "@/components/NavigationLayout.vue";
export default Vue.extend({
  name: "App",
  components: {
    NotificationContainer,
    NavigationLayout,
  },
  data: () => ({}),
});
</script>
