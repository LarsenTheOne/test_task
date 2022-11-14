<template>
  <div>
    <div class="titleWrap">
      <h2>Документы</h2>
    </div>
    <div class="inputWrap">
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        clear-icon="mdi-window-close"
        bg-color="inherit"
        dense="true"
        color="blue"
        placeholder="Поиск"
        v-model="search_value"
        clearable
      >
      </v-text-field>
    </div>

    <div class="catWrap">
      <v-expansion-panels v-model="panels" variant="accordion" multiple>
        <draggable
          :list="doc_data.categorys"
          group="categorys"
          :disabled="drag_disabled"
        >
          <v-expansion-panel
            v-for="(item, index) in filterDocuments.categorys"
            :key="item.id"
            :itemId="item.id"
          >
            <v-expansion-panel-title hide-actions>
              <div class="flexAlign">
                <v-btn
                  :icon="getActiveIcon(index)"
                  variant="outlined"
                  size="small"
                  color="blue"
                ></v-btn>
                <h3 clickable>{{ item.title }}</h3>
                <div
                  v-for="(color, colorIndex) in item.status"
                  :key="colorIndex"
                >
                  <v-icon
                    variant="text"
                    icon="mdi-record"
                    :color="color"
                    size="small"
                  ></v-icon>
                </div>
                <h5>{{ getDesctiprion(item.description) }}</h5>
              </div>
              <div>
                <v-btn
                  variant="text"
                  icon="mdi-pencil"
                  size="small"
                  color="grey"
                ></v-btn>
                <v-btn
                  variant="text"
                  icon="mdi-trash-can"
                  size="small"
                  color="red"
                ></v-btn>
                <v-btn
                  variant="text"
                  icon="mdi-arrow-up-down"
                  size="small"
                  color="grey"
                  @pointerenter="onDragging"
                  @pointerleave="onDragging"
                ></v-btn>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <docTable
                :documents_data="item.documents"
                :drag_data="doc_data.categorys[index].documents"
                :drag_disabled="drag_disabled"
                @draging="onDragging"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </draggable>
      </v-expansion-panels>
    </div>
    <div class="uncatWrap" v-if="!!filterDocuments.uncategorized">
      <draggable
        :list="doc_data.uncategorized"
        group="categorys"
        :disabled="drag_disabled"
      >
        <docTable
          :documents_data="filterDocuments.uncategorized"
          :drag_data="doc_data.uncategorized"
          :drag_disabled="drag_disabled"
          @draging="onDragging"
        />
      </draggable>
    </div>
  </div>
</template>

<script>
import { debounce, getData } from "@/helpers";
import { VueDraggableNext } from "vue-draggable-next";

import docTable from "./DocumentsTable.vue";
export default {
  name: "MainScreen",
  data: () => ({
    filter_fields: ["title", "description"],
    children_key: "documents",
    drag_disabled: true,
    search_value: null,
    doc_data: {},
    panels: [],
  }),
  computed: {
    filterDocuments: function () {
      const sValue = this.search_value != null ? this.search_value : "";
      const oDocuments = this.doc_data;
      const aFilterFields = this.filter_fields;
      let oFiltredSections = {};
      for (let sKey in oDocuments) {
        const aCurSection = oDocuments[sKey];
        oFiltredSections[sKey] = filterData(
          sValue,
          aCurSection,
          aFilterFields,
          this.children_key
        );
      }
      return oFiltredSections;
    },
  },
  components: {
    docTable,
    draggable: VueDraggableNext,
  },
  async beforeMount() {
    const oData = await getData("data.json");
    this.doc_data = oData;
  },
  methods: {
    filterWithDebounce: function () {
      debounce(() => this.filterDocuments(), 300);
    },
    onDragging: function () {
      this.drag_disabled = !this.drag_disabled;
    },
    getActiveIcon: function (nIndex) {
      const aPanels = this.panels;
      for (let i = 0; i < aPanels.length; i++) {
        const nPanel = aPanels[i];
        if (nPanel == nIndex) {
          return "mdi-arrow-up";
        }
      }
      return "mdi-arrow-down";
    },
    getDesctiprion: function (sValue) {
      console.log(sValue);
      if (sValue && sValue.length > 10) {
        return sValue.slice(0, 77) + "...";
      }
      return sValue;
    },
  },
};

//----------------------------------------------------Private---------------------------------------------------
function filterData(
  sFilterValue,
  aData,
  aFilterKeys,
  sChildrenKey = undefined
) {
  let aFiltredData = [];
  if (aData === undefined) return [];
  aData.forEach((oData) => {
    let oDataClone = { ...oData };
    for (let i = 0; i < aFilterKeys.length; i++) {
      let sCurFilterKey = aFilterKeys[i];
      if (
        oDataClone[sCurFilterKey] !== null &&
        oDataClone[sCurFilterKey] !== undefined &&
        oDataClone[sCurFilterKey]
          .toUpperCase()
          .indexOf(sFilterValue.toUpperCase().trim()) > -1
      ) {
        aFiltredData.push(oDataClone);
        break;
      } else if (
        i === aFilterKeys.length - 1 &&
        sChildrenKey !== undefined &&
        oDataClone[sChildrenKey] !== undefined &&
        oDataClone[sChildrenKey].length > 0
      ) {
        let aFiltredChildren = filterData(
          sFilterValue,
          oDataClone[sChildrenKey],
          aFilterKeys,
          sChildrenKey
        );
        if (aFiltredChildren.length > 0) {
          oDataClone[sChildrenKey] = aFiltredChildren;
          aFiltredData.push(oDataClone);
        }
      }
    }
  });
  return aFiltredData;
}

//--------------------------------------------------------------------------------------------------------------
</script>
<style>
.flexAlign {
  display: flex;
  justify-content: start;
  align-items: center;
}
.flexAlign > * {
  margin: 0 5px;
}
.titleWrap {
  margin: 10px 1em;
}
.inputWrap {
  width: 45em;
  margin: 10px 1em;
}
.catWrap {
  display: inline-block;
  margin: 10px 1em;
}

.uncatWrap {
  /* background-color: aquamarine; */
  display: block;
  min-height: 2em;
  margin: 1em 15px;
  width: 1042.31px;
}

.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
</style>
