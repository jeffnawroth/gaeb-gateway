<template>
  <div>
    <v-toolbar
      flat
      rounded="lg"
    >
      <v-file-input
        dense
        outlined
        placeholder="Durchsuchen..."
        hide-details="auto"
        accept=".ifc"
      />
      <v-spacer />
      <BaseButton @click="createGaeb">
        Leistungsverzeichnis erstellen
      </BaseButton>
    </v-toolbar>
    <v-row no-gutters>
      <v-col class="px-3">
        <ModelViewer
          ref="modelViewer"
          @toggle-list-element="toggleListElement"
          @reset-selected-items="resetSelectedItems"
        />
      </v-col>
      <v-col class="px-3">
        <ListOfPositions
          ref="listOfPositions"
          @highlight-model-element="highlightModelElement"
        />
        <BaseButton
          class="my-3"
          block
          @click="clearSelection"
        >
          Reset
        </BaseButton>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ModelViewer from "@/components/CreateGaeb/ModelViewer.vue";
import ListOfPositions from "@/components/CreateGaeb/ListOfPositions.vue";
import { convertAva2Gaeb, getAccessToken } from "@/AVACloudHelper";
import {
  DestinationGaebExchangePhase,
  DestinationGaebType,
  IElementDto,
  ProjectDto,
} from "@/AVACloudClient/api";
export default Vue.extend({
  components: { ModelViewer, ListOfPositions },
  data: () => ({
    avaProject: {
      projectInformation: {
        name: "FourWallsDoorWindowsRoof",
        currencyShort: "€",
      },
      serviceSpecifications: [
        {
          priceInformation: {
            taxRate: 0.19,
          },
          elements: [] as IElementDto[],
        },
      ],
    } as ProjectDto,
  }),
  async created() {
    await getAccessToken();
  },
  methods: {
    clearSelection() {
      (
        this.$refs.modelViewer as InstanceType<typeof ModelViewer>
      ).clearSelection();

      (
        this.$refs.listOfPositions as InstanceType<typeof ListOfPositions>
      ).selectedItems = [];
    },
    highlightModelElement(id: number) {
      (
        this.$refs.modelViewer as InstanceType<typeof ModelViewer>
      ).highlightModelElement(id);
    },
    toggleListElement(id: number) {
      (
        this.$refs.listOfPositions as InstanceType<typeof ListOfPositions>
      ).toggleListElement(id);
    },
    async createGaeb() {
      const selectedItems = (
        this.$refs.listOfPositions as InstanceType<typeof ListOfPositions>
      ).getSelectedItems();

      selectedItems.forEach((item) => {
        this.avaProject.serviceSpecifications?.[0].elements?.push({
          //@ts-expect-error: error
          elementTypeDiscriminator: "PositionDto",
          shortText: item.shortText,
          unitTag: item.unit,
          quantityComponents: [
            {
              formula: item.quantity,
            },
          ],
        });
      });

      const destinationType = DestinationGaebType.GaebXml_V3_3;
      const targetPhase = DestinationGaebExchangePhase.OfferRequest;
      await convertAva2Gaeb(
        this.avaProject,
        destinationType,
        targetPhase,
        83,
        this.avaProject.projectInformation?.name
      );
    },
  },
});
</script>
