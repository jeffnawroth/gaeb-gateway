<template>
  <v-alert
    id="notification"
    :type="notification.type"
    text
    dense
    dismissible
    width="auto"
  >
    {{ notification.message }}
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
  }),
  mounted() {
    this.timeout = setTimeout(() => this.remove(this.notification), 5000);
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  methods: mapActions("notification", ["remove"]),
});
</script>
