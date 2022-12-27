<template>
  <v-app>
    <v-main>
      <NotificationContainer />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import NotificationContainer from "@/components/NotificationContainer.vue";
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
