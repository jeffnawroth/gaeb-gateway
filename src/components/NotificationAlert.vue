<template>
  <v-alert
    id="notification"
    v-model="alert"
    :type="notification.type"
    text
    dense
    width="auto"
  >
    {{ notification.message }}

    <template #append>
      <v-progress-circular
        class="ml-2"
        size="26"
        :rotate="-90"
        :value="progress"
      >
        <v-icon
          small
          :color="notification.type"
          @click="alert = false"
        >
          mdi-close
        </v-icon>
      </v-progress-circular>
    </template>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
export default Vue.extend({
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    timeout: 0,
    interval: 0,
    alert: true,
    progress: 0,
  }),
  mounted() {
    this.timeout = setTimeout(() => {
      this.remove(this.notification);
    }, 6000);
    this.interval = setInterval(() => {
      if (this.progress !== 100) this.progress += 20;
    }, 1000);
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  },
  methods: mapActions("notification", ["remove"]),
});
</script>
