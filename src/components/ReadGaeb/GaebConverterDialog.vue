<template>
  <BaseDialog
    :value="value"
    @click-cancel="closeDialog"
  >
    <template #card-title>
      GAEB konvertieren
    </template>
    <template #card-text>
      <v-select
        v-model="selectedItem"
        placeholder="Transformation wählen"
        class="mt-10"
        outlined
        :items="converterItems"
        item-value="target"
        item-text="name"
        return-object
      />
    </template>

    <template #card-actions>
      <BaseButton
        large
        @click="closeDialog"
      >
        Abbrechen
      </BaseButton>

      <BaseButton
        large
        @click="$emit('convert', selectedItem)"
      >
        Konvertieren
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import Vue from "vue";
import {
  DestinationGaebExchangePhase,
  DestinationGaebType,
} from "@/AVACloudClient/api";

interface ConvertItem {
  name: string;
  destinationType: DestinationGaebType;
  targetPhase: DestinationGaebExchangePhase;
}
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    converterItems: [
      {
        name: "Angebotsaufforderung (83)",
        destinationType: DestinationGaebType.GaebXml_V3_3,
        targetPhase: DestinationGaebExchangePhase.OfferRequest,
      },
      {
        name: "Angebot (84)",
        destinationType: DestinationGaebType.GaebXml_V3_3,
        targetPhase: DestinationGaebExchangePhase.Offer,
      },
      {
        name: "Preisanfrage (93)",
        destinationType: DestinationGaebType.GaebXml_V3_3_Commerce,
        targetPhase: DestinationGaebExchangePhase.OfferRequest,
      },
      {
        name: "Preisangebot (94)",
        destinationType: DestinationGaebType.GaebXml_V3_3_Commerce,
        targetPhase: DestinationGaebExchangePhase.Offer,
      },
    ] as ConvertItem[],
    selectedItem: {} as ConvertItem,
    convertDialog: false,
  }),
  methods: {
    closeDialog() {
      this.$emit("close-converter");
      this.selectedItem = {} as ConvertItem;
    },
  },
});
</script>
