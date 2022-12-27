<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        fill-height
      >
        <NotificationContainer />
        <router-view />
      </v-container>
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
