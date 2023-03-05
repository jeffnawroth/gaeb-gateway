<template>
  <div>
    <v-file-input
      v-model="file"
      class="mx-3"
      @change="convert"
    />

    <v-data-table
      :items="flattenItems(items)"
      :headers="headers"
      class="ma-2 grey-rows"
      :items-per-page="-1"
      show-expand
      disable-sort
      :item-class="itemRowBackground"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
    >
      <!-- Type -->
      <template #[`item.type`]="{ item }">
        <td :class="groupTextBold(item)">
          <span />{{ getElementTypeLabel(item) }}
        </td>
      </template>

      <!-- Short Text -->
      <template #[`item.shortText`]="{ item }">
        <span :class="groupTextBold(item)">{{
          checkElementType(item, "ExecutionDescriptionDto")
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
        <td v-if="checkElementType(item, 'PositionDto')">
          {{ getFormattedPrice(item.unitPrice) }}
        </td>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAccessToken, getAvaProject } from "@/AVACloudHelper";
import { IElementDto, ProjectDto } from "@/AVACloudClient/api";
import { v4 as uuidv4 } from "uuid";
export default Vue.extend({
  data: () => ({
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
  async created() {
    await getAccessToken();
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
      }
    },

    checkElementType({ elementType }: any, type: string) {
      return elementType == type;
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

    async convert() {
      if (!this.file) {
        this.items = [];
        return;
      }

      this.avaProject = await getAvaProject(this.file);
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

    flattenItems(items: any[]): any[] {
      const result = [];
      for (const item of items) {
        if (item.elementType == "ServiceSpecificationGroupDto") {
          result.push(item);
          if (item.elements) {
            result.push(...this.flattenItems(item.elements));
          }
          if (item.blocks) {
            result.push(...this.flattenItems(item.blocks));
          }
          result.push({
            id: uuidv4(),
            elementType: "GroupSum",
            totalPrice: item.totalPrice,
            totalPriceGrossDeducted: item.totalPriceGrossDeducted,
            itemNumber: {
              stringRepresentation: item.itemNumber.stringRepresentation,
            },
          });
        } else {
          result.push(item);
        }
      }
      return result;
    },
  },
});
</script>
