<template>
  <BaseDialog
    :value="value"
    @click-cancel="closeDialog"
  >
    <template #card-title>
      GAEB exportieren
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
        Exportieren
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
  destinationType: DestinationGaebType | undefined;
  targetPhase: DestinationGaebExchangePhase | undefined;
  phaseId: number;
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
      /*  {
        name: "Keine Transformation",
        destinationType: undefined,
        targetPhase: undefined,
      }, */
      {
        name: "Angebotsaufforderung (83)",
        destinationType: DestinationGaebType.GaebXml_V3_3,
        targetPhase: DestinationGaebExchangePhase.OfferRequest,
        phaseId: 83,
      },
      {
        name: "Angebot (84)",
        destinationType: DestinationGaebType.GaebXml_V3_3,
        targetPhase: DestinationGaebExchangePhase.Offer,
        phaseId: 84,
      },
      {
        name: "Preisanfrage (93)",
        destinationType: DestinationGaebType.GaebXml_V3_3_Commerce,
        targetPhase: undefined,
        phaseId: 93,
      },
      {
        name: "Preisangebot (94)",
        destinationType: DestinationGaebType.GaebXml_V3_3_Commerce,
        targetPhase: undefined,
        phaseId: 94,
      },
    ] as ConvertItem[],
    selectedItem: {
      name: "Keine Transformation",
      destinationType: undefined,
      targetPhase: undefined,
    } as ConvertItem,
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
