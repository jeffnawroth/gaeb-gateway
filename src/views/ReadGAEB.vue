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
      :item-class="itemRowBackground"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
    >
      <template #[`body.prepend`]>
        <tr v-if="avaProject.id">
          <td>Leistungsbeschreibung "{{ projectName }}"</td>
          <td
            v-for="n in 6"
            :key="n"
          />
        </tr>
      </template>
      <template #[`item.quantityUnit`]="{ item }">
        <td v-if="item.quantity">
          {{ item.quantity }}
          <span v-if="item.unitTag">{{ item.unitTag }}</span>
        </td>
      </template>
      <template #[`item.type`]="{ item }">
        <td v-if="item.elementType == 'NoteTextDto'">
          Hinweistext
        </td>
        <td v-else-if="item.elementType == 'ExecutionDescriptionDto'">
          Ausführungsbeschreibung {{ item.identifier }}
        </td>
        <td v-else-if="item.elementType == 'ServiceSpecificationGroupDto'">
          <span class="font-weight-bold">
            Gruppe {{ item.itemNumber.stringRepresentation }}
          </span>
        </td>
        <td v-else-if="item.elementType == 'PositionDto'">
          Position {{ item.itemNumber.stringRepresentation }}
        </td>
        <td
          v-else-if="item.elementType == 'GroupSum'"
          class="font-weight-bold"
        >
          Summe Gruppe {{ item.itemNumber.stringRepresentation }}
        </td>
      </template>
      <template #[`item.shortText`]="{ item }">
        <span
          :class="
            item.elementType == 'ServiceSpecificationGroupDto'
              ? 'font-weight-bold'
              : ''
          "
        >{{
          item.elementType == "ExecutionDescriptionDto"
            ? item.label
            : item.shortText
        }}</span>
      </template>
      <template #[`item.totalPrice`]="{ item }">
        <td
          v-if="
            item.elementType == 'PositionDto' || item.elementType == 'GroupSum'
          "
          :class="item.elementType == 'GroupSum' ? 'font-weight-bold' : ''"
        >
          {{ item.totalPrice + " " + currency }}
        </td>
      </template>
      <template #[`item.unitPrice`]="{ item }">
        <td v-if="item.elementType == 'PositionDto'">
          {{ item.unitPrice + " " + currency }}
        </td>
      </template>
      <template #[`item.totalPriceGrossDeducted`]="{ item }">
        <td
          v-if="
            item.elementType == 'PositionDto' || item.elementType == 'GroupSum'
          "
          :class="item.elementType == 'GroupSum' ? 'font-weight-bold' : ''"
        >
          {{ item.totalPriceGrossDeducted + " " + currency }}
        </td>
      </template>
      <template #expanded-item="{ item }">
        <td
          :colspan="headers.length"
          class="pt-1"
        >
          <span v-if="item.shortText"><span class="font-weight-bold">Kurztext:</span> {{ item.shortText
          }}<br></span>
          <span v-if="item.longText"><span class="font-weight-bold">Langtext:</span> {{ item.longText
          }}<br></span>
          <div
            v-if="
              item.elementType == 'PositionDto' ||
                item.elementType == 'GroupSum'
            "
          >
            <span v-if="item.totalPrice != null"><span class="font-weight-bold">Netto Gesamtpreis:</span>
              {{ item.totalPrice + " " + currency }}<br></span>
            <span v-if="item.taxRate && item.taxRate != 0"><span class="font-weight-bold">Mehrwersteuersatz:</span>
              {{ item.taxRate * 100 }} %<br></span>
            <span v-if="item.totalPriceGrossDeducted != null"><span class="font-weight-bold">Brutto Gesamtpreis nach Nachlass:</span>
              {{ item.totalPriceGrossDeducted + " " + currency }}<br></span>
            <br>
          </div>
        </td>
      </template>
      <template #[`body.append`]>
        <tr
          v-if="avaProject.id"
          style="background-color: #9e9e9e"
        >
          <td class="font-weight-bold">
            Summe Leistungsbeschreibung "{{ projectName }}"
          </td>
          <td
            v-for="n in 3"
            :key="n"
          />
          <td class="font-weight-bold">
            {{ totalPrice + " " + currency }}
          </td>
          <td class="font-weight-bold">
            {{ totalPriceGrossDeducted + " " + currency }}
          </td>
          <td />
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAccessToken, getAvaProject } from "@/AVACloudHelper";
import { IElementDto, ProjectDto } from "@/AVACloudClient/api";
export default Vue.extend({
  data: () => ({
    file: null,
    items: [] as IElementDto[] | undefined,
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
    /*  flattenItems() {
      let flattenItems: any[] = [];
      this.items?.forEach((group: any) => {
        flattenItems.push(group);
        group.elements?.forEach((subGroup: any) => {
          flattenItems.push(subGroup);
          subGroup.elements?.forEach((position: any) => {
            flattenItems.push(position);
            position.blocks?.forEach((block: any) => {
              flattenItems.push(block);
            });
          });
        });
      });
      return flattenItems;
    }, */
    currency() {
      return this.avaProject.projectInformation?.currencyShort ?? "";
    },
    projectName() {
      return this.avaProject.projectInformation?.name ?? "";
    },
    totalPrice() {
      return this.avaProject.serviceSpecifications
        ? this.avaProject.serviceSpecifications[0].totalPrice
        : 0;
    },
    totalPriceGrossDeducted() {
      return this.avaProject.serviceSpecifications
        ? this.avaProject.serviceSpecifications[0].totalPriceGrossDeducted
        : 0;
    },
  },
  async created() {
    await getAccessToken();
  },

  methods: {
    itemRowBackground(item: any) {
      return item.elementType == "GroupSum" ? "background-color: grey" : "";
    },

    async convert() {
      if (!this.file) {
        this.items = [];
        return;
      }

      this.avaProject = await getAvaProject(this.file);
      console.log("AvaProject", this.avaProject);
      if (this.avaProject.serviceSpecifications) {
        this.items = this.avaProject.serviceSpecifications[0].elements;
      }
    },
    /* flattenItems(items: any[]): any[] {
  const result = [];
  for (const item of items) {
    result.push(item);
    if (item.elements) {
      result.push(...this.flattenItems(item.elements));
    }
    if (item.blocks) {
      result.push(...this.flattenItems(item.blocks));
    }
  }
  return result;
} */
    flattenItems(items: any[]): any[] {
      const result = [];
      for (const item of items) {
        if (item.elementType == "ServiceSpecificationGroupDto") {
          let groupTotalPrice = 0;
          let groupTotalPriceGrossDeducted = 0;
          result.push(item);
          if (item.elements) {
            result.push(...this.flattenItems(item.elements));
            groupTotalPrice += item.elements.reduce(
              (total: any, element: { totalPrice: any }) =>
                total + (element.totalPrice || 0),
              0
            );
            groupTotalPriceGrossDeducted += item.elements.reduce(
              (total: any, element: { totalPriceGrossDeducted: any }) =>
                total + (element.totalPriceGrossDeducted || 0),
              0
            );
          }
          if (item.blocks) {
            result.push(...this.flattenItems(item.blocks));
          }
          result.push({
            id: Date.now(),
            elementType: "GroupSum",
            itemNumber: {
              stringRepresentation: item.itemNumber.stringRepresentation,
            },
            totalPrice: groupTotalPrice,
            totalPriceGrossDeducted: groupTotalPriceGrossDeducted,
          });
        } else {
          result.push(item);
        }
      }
      console.log(JSON.parse(JSON.stringify(result)));

      return result;
    },
  },
});
</script>

<style scoped>
.grey-rows .v-data-table__row.groupsum {
  background-color: orange;
}
</style>
