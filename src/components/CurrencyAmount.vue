<template>
  <span>
    {{amount}}
    <img src="~/assets/img/logo-white.svg" alt="ALEPH" style="height: 0.9em; margin-top: 0.1em; margin-bottom: -0.1em; padding-left: 0.2em;" v-if="symbol=='ALEPH'" />
    <span v-else>{{symbol}}</span>
  </span>
</template>
<script>
export default {
  name: 'CurrencyAmount',
  props: ['amount', 'symbol']
}
</script>