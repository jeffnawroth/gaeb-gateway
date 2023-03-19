<template>
  <div>
    <v-data-table
      :items="flattenItems(items)"
      :headers="headers"
      class="ma-2 grey-rows"
      :items-per-page="-1"
      show-expand
      disable-sort
      :item-class="itemRowBackground"
    >
      <template #top="{ items }">
        <TableToolbar
          v-model="file"
          :calculating="calculating"
          @gaeb-2-ava="convertGAEBtoAVA"
          @ava-2-ava="convertAVAtoAVA(items)"
          @open-converter="convertDialog = true"
        />
      </template>
      <!-- Type -->
      <template #[`item.type`]="{ item }">
        <td :class="groupTextBold(item)">
          <span />{{ getElementTypeLabel(item) }}
        </td>
      </template>

      <!-- Short Text -->
      <template #[`item.shortText`]="{ item }">
        <span :class="groupTextBold(item)">{{
          item.elementType == "ExecutionDescriptionDto"
            ? item.label
            : item.shortText
        }}</span>
      </template>

      <!-- Quantity + Unit -->
      <template #[`item.quantityUnit`]="{ item }">
        <td v-if="item.quantity">
          {{ item.quantity }}
          <span v-if="item.unitTag">{{ item.unitTag }}</span>
        </td>
      </template>

      <!-- Unit Price -->
      <template #[`item.unitPrice`]="{ item }">
        <v-edit-dialog
          :return-value.sync="item.totalPrice"
          persistent
          large
          cancel-text="Abbrechen"
          save-text="Speichern"
        >
          <!--  @save="convertAVAtoAVA(item)" -->
          <td v-if="item.elementType == 'PositionDto'">
            {{ getFormattedPrice(item.unitPrice) }}
          </td>
          <template #input>
            <v-text-field
              v-model.number="item.unitPrice"
              label="Bearbeiten"
              single-line
              counter
            />
          </template>
        </v-edit-dialog>
      </template>

      <!-- Total Price -->
      <template #[`item.totalPrice`]="{ item }">
        <td
          v-if="showTotalPrice(item)"
          :class="groupTextBold(item)"
        >
          {{ getFormattedPrice(item.totalPrice) }}
        </td>
      </template>

      <!-- Total Price Gross Deducted -->
      <template #[`item.totalPriceGrossDeducted`]="{ item }">
        <td
          v-if="showTotalPrice(item)"
          :class="groupTextBold(item)"
        >
          {{ getFormattedPrice(item.totalPriceGrossDeducted) }}
        </td>
      </template>

      <!-- Expanded Item -->
      <template #expanded-item="{ item }">
        <td :colspan="headers.length">
          <span v-if="item.shortText"><span class="font-weight-bold">Kurztext:</span> {{ item.shortText
          }}<br></span>
          <span v-else-if="item.label"><span class="font-weight-bold">Kurztext:</span> {{ item.label
          }}<br></span>
          <span v-if="item.longText"><span class="font-weight-bold">Langtext:</span> {{ item.longText
          }}<br></span>
          <div v-if="showTotalPrice(item)">
            <span v-if="item.totalPrice != null"><span class="font-weight-bold">Netto Gesamtpreis:</span>
              {{ getFormattedPrice(item.totalPrice) }}<br></span>
            <span v-if="item.taxRate && item.taxRate != 0"><span class="font-weight-bold">Mehrwersteuersatz:</span>
              {{ getFormattedTaxRate(item) }}<br></span>
            <span v-if="item.totalPriceGrossDeducted != null"><span class="font-weight-bold">Brutto Gesamtpreis nach Nachlass:</span>
              {{ getFormattedPrice(item.totalPriceGrossDeducted) }}<br></span>
          </div>
        </td>
      </template>
    </v-data-table>
    <GaebConverterDialog
      v-model="convertDialog"
      :exporting="exporting"
      @close-converter="convertDialog = false"
      @click-cancel="convertDialog = false"
      @convert="(selectedItem) => exportGaeb(selectedItem)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  convertAva2Ava,
  convertAva2Gaeb,
  getAvaProject,
} from "@/helpers/AVACloudHelper";
import { PriceTypeDto, ProjectDto } from "@/AVACloudClient/api";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import GaebConverterDialog from "@/components/ReadGaeb/GaebConverterDialog.vue";
import TableToolbar from "@/components/ReadGaeb/TableToolbar.vue";
export default Vue.extend({
  components: { GaebConverterDialog, TableToolbar },
  data: () => ({
    convertDialog: false,
    file: null,
    items: [] as any[],
    headers: [
      {
        text: "Typ",
        value: "type",
      },
      {
        text: "Kurztext",
        value: "shortText",
      },
      {
        text: "Menge",
        value: "quantityUnit",
      },
      {
        text: "Einheitspreis",
        value: "unitPrice",
      },
      {
        text: "Netto",
        value: "totalPrice",
      },
      {
        text: "Brutto nach Nachlass",
        value: "totalPriceGrossDeducted",
      },
      { text: "", value: "data-table-expand" },
    ],
    avaProject: {} as ProjectDto,
    calculating: false,
    exporting: false,
  }),

  computed: {
    currency() {
      return this.avaProject.projectInformation?.currencyShort ?? "";
    },
    projectName() {
      return this.avaProject.projectInformation?.name ?? "";
    },
    totalPriceProject() {
      return this.avaProject.serviceSpecifications
        ? this.avaProject.serviceSpecifications[0].totalPrice
        : 0;
    },
    totalPriceGrossDeductedProject() {
      return this.avaProject.serviceSpecifications
        ? this.avaProject.serviceSpecifications[0].totalPriceGrossDeducted
        : 0;
    },
  },

  methods: {
    itemRowBackground({ elementType }: any) {
      return elementType == "GroupSum" || elementType == "GroupSumTotal"
        ? "background-color: grey"
        : "";
    },

    getElementTypeLabel(item: any) {
      switch (item.elementType) {
        case "NoteTextDto":
          return "Hinweistext";
        case "ExecutionDescriptionDto":
          return `Ausführungsbeschreibung ${item.identifier}`;
        case "ServiceSpecificationGroupDto":
          return `Gruppe ${item.itemNumber.stringRepresentation}`;
        case "PositionDto":
          return `Position ${item.itemNumber.stringRepresentation}`;
        case "GroupSum":
          return `Summe Gruppe ${item.itemNumber.stringRepresentation}`;
        case "ServiceDescription":
          return `Leistungsbeschreibung "${item.projectName}"`;
        case "GroupSumTotal":
          return `Summe Leistungsbeschreibung "${item.projectName}"`;
        case "NoteTextBlock":
          return "Block";
      }
    },

    groupTextBold({ elementType }: any) {
      return elementType === "ServiceSpecificationGroupDto" ||
        elementType === "GroupSum" ||
        elementType === "GroupSumTotal"
        ? "font-weight-bold"
        : "";
    },

    showTotalPrice({ elementType }: any) {
      return (
        elementType == "GroupSum" ||
        elementType == "GroupSumTotal" ||
        elementType == "PositionDto"
      );
    },

    getFormattedPrice(price: number) {
      return `${price.toLocaleString("de-De")} ${this.currency}`;
    },

    getFormattedTaxRate({ taxRate }: any) {
      return `${taxRate * 100} %`;
    },

    async convertGAEBtoAVA() {
      if (!this.file) {
        this.items = [];
        return;
      }
      this.avaProject = await getAvaProject(this.file);
      this.setupItems();
    },

    setupItems() {
      if (this.avaProject.serviceSpecifications) {
        this.items = this.avaProject.serviceSpecifications[0].elements ?? [];

        this.items?.unshift({
          id: uuidv4(),
          elementType: "ServiceDescription",
          projectName: this.projectName ?? "",
        });

        this.items?.push({
          id: uuidv4(),
          elementType: "GroupSumTotal",
          projectName: this.projectName ?? "",
          totalPrice: this.totalPriceProject,
          totalPriceGrossDeducted: this.totalPriceGrossDeductedProject,
        });
      }
    },

    async convertAVAtoAVA(items: any) {
      if (items.length == 0) return;
      this.calculating = true;
      items.forEach((item: any) => {
        if (item.unitPrice) {
          item.priceType = PriceTypeDto.WithTotal;
          item.unitPriceOverride = item.unitPrice;
        }
      });

      let avaProjectCopy = _.cloneDeep(this.avaProject);

      const servSpec = avaProjectCopy.serviceSpecifications;
      if (servSpec && servSpec[0].priceInformation) {
        servSpec[0].priceInformation.taxRate = 0.19;
        servSpec[0].elements?.splice(0, 1);
        servSpec[0].elements?.splice(servSpec[0].elements.length - 1, 1);
      }

      this.avaProject = await convertAva2Ava(avaProjectCopy);

      this.setupItems();
      this.calculating = false;
    },

    async exportGaeb(selectedItem: any) {
      if (!this.file) {
        this.items = [];
        return;
      }

      this.exporting = true;

      let avaProjectCopy = _.cloneDeep(this.avaProject);

      const servSpec = avaProjectCopy.serviceSpecifications;
      if (servSpec) {
        servSpec[0].elements?.splice(0, 1);
        servSpec[0].elements?.splice(servSpec[0].elements.length - 1, 1);
      }

      await convertAva2Gaeb(
        avaProjectCopy,
        selectedItem.destinationType,
        selectedItem.targetPhase,
        selectedItem.phaseId,
        (this.file as File).name
      );
      this.exporting = false;
      this.convertDialog = false;
    },

    flattenItems(items: any[]): any[] {
      const result = [];
      for (const item of items) {
        result.push(item);
        if (item.elements) {
          result.push(...this.flattenItems(item.elements));
        }
        if (item.blocks) {
          for (const block of item.blocks) {
            block.elementType = "NoteTextBlock";
          }
          result.push(...this.flattenItems(item.blocks));
        }
        if (item.elementType == "ServiceSpecificationGroupDto") {
          result.push({
            id: uuidv4(),
            elementType: "GroupSum",
            totalPrice: item.totalPrice,
            totalPriceGrossDeducted: item.totalPriceGrossDeducted,
            itemNumber: {
              stringRepresentation: item.itemNumber.stringRepresentation,
            },
          });
        }
      }
      return result;
    },
  },
});
</script>
