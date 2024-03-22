<template>
  <div class="notification-container">
    <NotificationAlert
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import NotificationAlert from "./NotificationAlert.vue";
export default Vue.extend({
  components: {
    NotificationAlert,
  },
  computed: mapState("notification", ["notifications"]),
});
</script>

<style scoped>
.notification-container {
  top: 0;
  right: 0;
  position: absolute;
  margin: 12px;
}
</style>
