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
      <BaseButton
        :disabled="selectedElements.length < 1"
        @click="createGaeb"
      >
        Leistungsverzeichnis erstellen
      </BaseButton>
    </v-toolbar>

    <v-row no-gutters>
      <v-col class="px-3">
        <ModelViewer
          ref="modelViewer"
          @toggle-list-element="toggleListElement"
        />
      </v-col>
      <v-col class="px-3">
        <ListOfPositions
          ref="listOfPositions"
          v-model="selectedElements"
          :items="items"
        />
        <BaseButton
          class="my-3"
          block
          :disabled="selectedElements.length < 1"
          @click="clearSelection"
        >
          Auswahl zurücksetzen
        </BaseButton>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ModelViewer from "@/components/CreateGaeb/ModelViewer.vue";
import ListOfPositions from "@/components/CreateGaeb/ListOfPositions.vue";
import { convertAva2Gaeb } from "@/helpers/AVACloudHelper";
import {
  DestinationGaebExchangePhase,
  DestinationGaebType,
  IElementDto,
  ProjectDto,
} from "@/AVACloudClient/api";
import { bus } from "@/main";
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
    selectedElements: [] as any,
    items: [
      {
        id: 6546,
        name: "Door",
        shortText: "Holztür; 2000x700mm; Rechtsöffnend",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 481,
        name: "Wall",
        shortText: "Betonwand",
        quantity: 20,
        unit: "m²",
      },
      {
        id: 7290,
        name: "Window",
        shortText: "Doppeltes Fenster; 150x150mm; Weiß hochglanz",
        quantity: 1,
        unit: "Stck",
      },
      {
        id: 7482,
        name: "Roof",
        shortText: "Flachdach; 10000x6000mm",
        quantity: 40,
        unit: "m²",
      },
    ] as any,
  }),
  methods: {
    clearSelection() {
      bus.$emit("clear-selection");
      this.selectedElements = [];
    },

    toggleListElement(modelId: number) {
      const listItemIndex = this.items.findIndex(
        (item: any) => item.id == modelId
      );
      if (listItemIndex === -1) return;

      this.selectedElements.includes(listItemIndex)
        ? this.selectedElements.splice(
            this.selectedElements.indexOf(listItemIndex),
            1
          )
        : this.selectedElements.push(listItemIndex);
    },

    async createGaeb() {
      const selectedElements = this.getSelectedItems();
      selectedElements.forEach((item: any) => {
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

    getSelectedItems() {
      const selectedItems: any[] = [];
      this.selectedElements.forEach((index: number) => {
        selectedItems.push(this.items[index]);
      });

      return selectedItems;
    },
  },
});
</script>
