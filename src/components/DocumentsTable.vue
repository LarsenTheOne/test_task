<template>
  <v-card class="docsWrapp">
    <draggable
      tag="div"
      :list="drag_data"
      group="documents"
      :disabled="drag_disabled"
    >
      <div v-for="item in documents_data" :key="item.id" class="docRow">
        <div>
          <div class="flexAlign">
            <div class="flexAlign">
              <h4 clickable>{{ item.title }}</h4>
              <div v-for="(color, colorIndex) in item.status" :key="colorIndex">
                <v-icon
                  variant="text"
                  icon="mdi-record"
                  :color="color"
                  size="small"
                ></v-icon>
              </div>
              <strong v-if="!!item.required" clickable class="text-red">
                Обязательный
              </strong>
              <h5>{{ getDesctiprion(item.description) }}</h5>
            </div>
          </div>
        </div>
        <div>
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
              @pointerenter="$emit('draging')"
              @pointerleave="$emit('draging')"
            ></v-btn>
          </div>
        </div>
      </div>
    </draggable>
  </v-card>
</template>
<script>
import { VueDraggableNext } from "vue-draggable-next";

export default {
  name: "DocumentsTable",
  props: {
    documents_data: Array,
    drag_data: Array,
    drag_disabled: Boolean,
  },
  data: () => ({
    // content: [],
  }),
  emits: ["dragEnd", "dragStart", "draging"],
  beforeMount() {
    // this.content = this.documents_data;
  },
  components: {
    draggable: VueDraggableNext,
  },
  methods: {
    getDesctiprion: function (sValue) {
      console.log(sValue);
      if (sValue && sValue.length > 10) {
        return sValue.slice(0, 77) + "...";
      }
      return sValue;
    },
  },
};
</script>

<style scoped>
.flexAlign {
  display: flex;
  justify-content: start;
  align-items: center;
}
.docsWrapp {
  display: block;
  border: 0.2px lightgray solid;
}
.docsWrapp .docRow {
  border-bottom: 0.2px lightgray solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
}
</style>
