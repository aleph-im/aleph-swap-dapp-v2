<template>
    <q-page class="" padding>
      <div class="content">
        <h1 class="text-h4 row justify-between">
          History
          <q-btn
            round
            flat
            dense
            :icon="refreshing ? 'wait' : 'refresh'"
            :active="!refreshing"
            @click="get_swaps"
          />
        </h1>
        <div v-for="swap of swaps" :key="swap.original_item_hash">
          <swap-detail :swap="swap" />
        </div>
      </div>
    </q-page>
  </template>

  <script>
  import Swap from '../components/Swap.vue'
  import SwapDetail from '../components/SwapDetail.vue'
  // import { mapState } from 'vuex'
  import { posts } from 'aleph-js'
  export default {
    name: 'PageIndex',
    computed: {
    },
    data() {
      return {
        api_server: 'https://api2.aleph.im',
        swap_address: '0xED9d5B040386F394B9ABd34fD59152756b126710',
        swaps: [],
        refreshing: false
      }
    },
    components: {
      Swap,
      SwapDetail
    },
    methods: {
      async get_swaps() {
        this.refreshing = true
        let result = await posts.get_posts('xchain-swap', {
          addresses: [this.swap_address],
          api_server: this.api_server,
          pagination: 50
        })
        console.log(result)
        this.swaps = result.posts
        this.refreshing = false
      }
    },
    mounted() {
      this.get_swaps()
    }
  }
  </script>
