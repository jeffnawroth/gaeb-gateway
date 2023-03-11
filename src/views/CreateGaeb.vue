<template>
  <div class="d-flex">
    <v-col>
      <ModelViewer
        ref="modelViewer"
        @toggle-list-element="toggleListElement"
        @reset-selected-items="resetSelectedItems"
      />
    </v-col>
    <v-col class="d-flex flex-column">
      <ListOfPositions
        ref="listOfPositions"
        @highlight-model-element="highlightModelElement"
      />
      <v-spacer />
      <div class="d-flex justify-end">
        <v-btn
          width="350"
          @click="createGaeb"
        >
          Leistungsverzeichnis erstellen
        </v-btn>
      </div>
    </v-col>
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
    resetSelectedItems() {
      (
        this.$refs.listOfPositions as InstanceType<typeof ListOfPositions>
      ).selectedItems = [];
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
      /* const gaebFile = await convertAva2Gaeb(
        this.avaProject,
        destinationType,
        targetPhase
      ); */
    },
  },
});
</script>
