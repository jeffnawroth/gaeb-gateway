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
        :loading="creating"
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
          :items="getSortedElements"
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
import { bus } from "@/main";
import { mapActions, mapGetters, mapState } from "vuex";
import {
  DestinationGaebExchangePhase,
  DestinationGaebType,
  IElementDto,
  ProjectDto,
} from "@/AVACloud API";

export default Vue.extend({
  components: { ModelViewer, ListOfPositions },
  data: () => ({
    avaProject: {
      projectInformation: {
        name: "SampleHouse",
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
    creating: false,
  }),
  computed: {
    ...mapState("ifc", ["elements"]),
    ...mapGetters("ifc", ["getSortedElements"]),
  },
  async created() {
    await this.getBuildingElements();
  },
  methods: {
    ...mapActions("avacloud", ["convertAvaToGaeb"]),
    ...mapActions("ifc", ["getBuildingElements"]),

    clearSelection() {
      bus.$emit("clear-selection");
      this.selectedElements = [];
    },

    toggleListElement(modelId: number) {
      const listItemIndex = this.elements.findIndex(
        (item: any) => item.id == modelId
      );
      if (listItemIndex === -1) return;

      document.getElementById(modelId.toString())?.scrollIntoView();

      this.selectedElements.includes(listItemIndex)
        ? this.selectedElements.splice(
            this.selectedElements.indexOf(listItemIndex),
            1
          )
        : this.selectedElements.push(listItemIndex);
    },

    async createGaeb() {
      this.creating = true;
      const selectedElements = this.getSelectedItems();
      selectedElements.forEach((item: any) => {
        this.avaProject.serviceSpecifications?.[0].elements?.push({
          elementTypeDiscriminator: "PositionDto",
          //@ts-expect-error: Error
          shortText: item.description,
          unitTag: item.unit == "mm" ? "Stck." : item.unit,
          quantityComponents: [
            {
              formula: item.unit == "mm" ? 1 : item.volume,
            },
          ],
        });
      });

      const destinationType = DestinationGaebType.GaebXmlV33;
      const targetPhase = DestinationGaebExchangePhase.OfferRequest;
      await this.convertAvaToGaeb({
        avaProject: this.avaProject,
        destinationType,
        targetPhase,
        phaseId: 83,
        fileName: this.avaProject.projectInformation?.name,
      });
      this.creating = false;
    },

    getSelectedItems() {
      const selectedItems: any[] = [];
      this.selectedElements.forEach((index: number) => {
        selectedItems.push(this.elements[index]);
      });

      return selectedItems;
    },
  },
});
</script>
