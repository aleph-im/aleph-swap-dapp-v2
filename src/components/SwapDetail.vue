<template>
  <div class="q-mb-xl">
    <div class="row justify-between">
      <div class="text-h5">
        <q-tooltip>
          {{swap.content.source.amount}} ALEPH tokens from {{swap.content.source.chain}} to {{swap.content.target.chain}}
        </q-tooltip>
        <currency-amount :amount="swap.content.source.amount" :symbol="swap.content.symbol" />
      </div>
      <div class="text-subtitle2">
        <span class="text-grey text-italic">
          <q-tooltip>
            {{moment(swap.time * 1000).format("lll")}}
          </q-tooltip>
          {{moment(swap.time * 1000).fromNow()}}
        </span> 
        <span v-if="swap.content.source.height" class="text-caption q-ml-md text-bold"> Block {{swap.content.source.height}}</span>

        <span class="q-ml-md">
          <q-tooltip>
          {{swap.content.status}}
          </q-tooltip>
          <q-icon v-if="swap.content.status == 'pending'" name="schedule" />
          <q-icon v-else-if="swap.content.status == 'failed'" name="warning" />
          <q-icon v-else-if="swap.content.status == 'finished'" name="done" />
          <q-icon v-else name="help" />
        </span>
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section class="q-pb-sm">
        <div class="text-weight-bold linear-green">Swap Information</div>
      </q-card-section>

      <q-card-section horizontal class="justify-between">

        <q-card-section class="col">
          {{swap.content.source.chain}}<br />
          <Address :address="swap.content.source.address" :chain="swap.content.source.chain" /><br />

          <div v-if="swap.content.source.tx" class="text-subtitle2">
            TX FROM<br />
            <tx-hash :hash="swap.content.source.tx" :chain="swap.content.source.chain" />
          </div>
        </q-card-section>


        <q-card-section>
          <q-icon name="double_arrow" />
        </q-card-section>

        <q-card-section class="col">
          {{swap.content.target.chain}}<br />
          <Address :address="swap.content.target.target" :chain="swap.content.target.chain" /><br />
          <span v-if="swap.content.target.height" class="text-caption">Block {{swap.content.target.height}}</span>

          <div v-if="swap.content.target.tx" class="text-subtitle2">
            TX TO<br />
            <tx-hash :hash="swap.content.target.tx" :chain="swap.content.target.chain" />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import Address from './Address.vue'
import CurrencyAmount from './CurrencyAmount.vue'
import TxHash from './TxHash.vue'
import moment from 'moment'
export default {
  name: 'SwapDetail',
  props: ['swap'],
  components: {
    Address,
    CurrencyAmount,
    TxHash
  },
  data() {
    return {
      expanded: false,
      moment: moment
    }
  }
}
</script>
<style scoped>
span {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>