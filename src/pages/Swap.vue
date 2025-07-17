<template>
  <q-page class="" padding>
    <div class="content">
      <h1 class="text-h4">
        Bridge $ALEPH
      </h1>
      <swap />
    </div>
  </q-page>
</template>

<script>
import Swap from '../components/Swap.vue'
// import { mapState } from 'vuex'
import { posts } from 'aleph-js'
export default {
  name: 'PageIndex',
  computed: {
  },
  data() {
    return {
      api_server: 'https://api2.aleph.im',
      swap_address: '0xED9d5B040386F394B9ABd34fD59152756b126710'
    }
  },
  components: {
    Swap
  },
  methods: {
  },
  mounted() {
  }
}
</script>
