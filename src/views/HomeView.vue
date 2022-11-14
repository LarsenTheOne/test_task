<template>
  <MainScreen />
</template>

<script>
import { defineComponent } from "vue";

// Components
import MainScreen from "../components/MainScreen.vue";

export default defineComponent({
  name: "HomeView",

  components: {
    MainScreen,
  },
});
</script>
