<template>
  <v-card
    style="max-height: 60vh"
    class="overflow-y-auto"
  >
    <v-list>
      <v-list-item-group
        :value="value"
        multiple
        @change="updateValue"
      >
        <v-list-item
          v-for="item in items"
          :key="item.id"
          @click="highlightModelElement(item.id)"
          @dblclick="zoomTo(item.id)"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.shortText }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { bus } from "@/main";
import Vue from "vue";
export default Vue.extend({
  props: {
    value: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    zoomTo(id: number) {
      bus.$emit("zoom-to", id);
    },
    highlightModelElement(id: number) {
      bus.$emit("highlight-model-element", id);
    },
    updateValue(value: any) {
      this.$emit("input", value);
    },
  },
});
</script>
