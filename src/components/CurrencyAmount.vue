<template>
  <span>
    {{ amount }}
    <AlephLogoIcon v-if="symbol == 'ALEPH'" height="0.9em" class="aleph-currency"/>
    <span v-else>{{ symbol }}</span>
  </span>
</template>
<script>
import AlephLogoIcon from "./icons/AlephLogoIcon.vue";

export default {
  name: "CurrencyAmount",
  props: ["amount", "symbol"],
  components: {
    AlephLogoIcon,
  },
};
</script>
<style scoped>
.aleph-currency {
  margin-top: 0.1em;
  margin-bottom: -0.1em;
  padding-left: 0.2em;
}
</style>
