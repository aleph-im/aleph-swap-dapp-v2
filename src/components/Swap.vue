<template>
  <div>
    <h5><span class="text-light text-base text-white">01/</span> <span class="linear-green">Source chain</span></h5>

    <q-tabs
      v-model="source_chain"
      class="text-white text-rubik q-pb-lg"
      active-color="primary"
      no-caps
      align="left"
    >
      <q-tab v-for="chain of source_chains" :name="chain" :key="chain" :label="chain" />
    </q-tabs>

    <q-card>
      <q-card-section>
        <div v-if="['ETH', 'BSC', 'AVAX'].includes(source_chain)">
            <div v-if="(source_account==null)||(source_account.type != source_chain)">
              Login with
              <br />
              <q-btn color="primary" size="sm" @click="login_metamask" rounded standout>
                <img src="../assets/img/metamask.png" height="24px"> Browser wallet
              </q-btn>
            </div>
            <div v-else>
              <q-field rounded standout label="Address" stack-label>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{source_account.address}}</div>
                </template>
              </q-field>
            </div>
          </div>
          <div v-else-if="source_chain == 'NULS2'">
            <q-input rounded standout v-model.number="amount" label="Amount" type="number">
            </q-input>
          </div>
      </q-card-section>
    </q-card>

    <h5><span class="text-light text-base text-white">02/</span> <span class="linear-green">Destination chain</span></h5>

    <q-tabs
      v-model="target_chain"
      class="text-white text-rubik q-pb-lg"
      active-color="primary"
      no-caps
      align="left"
    >
      <q-tab v-for="chain of target_chains" :name="chain" :key="chain" :label="chain" />
    </q-tabs>
    
    <q-card>
      <q-card-section>
        <q-input rounded standout :bottom-slots="false" v-model="target_address" label="Target address" :error="check_address()" />
      </q-card-section>
    </q-card>

    <h5><span class="text-light text-base text-white">03/</span> <span class="linear-green">Amount</span></h5>
    <q-card>
      <q-card-section>
        <div>
          <q-input  rounded standout bottom-slots v-model.number="amount" label="Amount" type="number">
            <template v-slot:hint>
              <div class="row justify-between">
                <div v-if="aleph_balance">Current balance: {{aleph_balance}}.</div>
                <div v-if="fees[target_chain]" class="text-warning">⚠️ Fee of {{fees[target_chain]}} ALEPH applies.</div>
                <div v-if="target_amount" class="text-info">You will receive {{target_amount}} ALEPH.</div>
              </div>
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>


    <div class="text-center q-ma-lg q-pa-lg" v-if="(source_chain != 'NULS2')&&(source_account.address != undefined)&&!check_address()&&!out_txid">
      <q-btn @click="do_approve" color="glow-primary-raised"
              v-if="(source_account.meta === 'ETH') && !enough_allowance"
              class="text-bold text-rubik text-black shadow-glow" no-caps :loading="approving" rounded>
        Approve
      </q-btn>
      <q-btn @click="do_swap" color="glow-primary-raised" class="text-bold text-rubik text-black shadow-glow" v-if="can_swap" no-caps :loading="swapping" rounded>
        Swap {{amount}} ALEPH
      </q-btn>
    </div>

    <p class="text-center q-ma-lg" v-else-if="(source_chain == 'NULS2')&&!check_address()&&!out_txid">
      To proceed, please send <strong>{{amount}}</strong> ALEPH<br />
      to <strong>{{targets.NULS2}}</strong><br/>
      with remark <strong>{{prepared_target}}</strong>
    </p>
    <p v-if="out_txid"  class="text-center q-ma-lg">
      Transaction issued:<br />
      <tx-hash :hash="out_txid" :chain="source_chain" />
    </p>
  </div>
</template>
<script>
import { ethers } from "ethers";
import {
  get_nuls_balance_info, get_ethereum_balance_info, get_web3_balance_info
} from '../services/balances'

import TxHash from './TxHash.vue'
import { get_erc20_contract, get_swap_contract } from 'src/services/ethereum';
import { toRaw } from 'vue';

let provider = null;

export default {
  name: 'Swap',
  props: [],
  components: {
    TxHash
  },
  data() {
    return {
      source_chain: 'ETH',
      source_account: {},
      source_balances: {},
      source_allowance: null,
      target_chain: 'AVAX',
      target_address: '',
      approving: false,
      swapping: false,
      eth_chain_id: null,
      out_txid: null,
      amount: 0,
      source_chains: [
        'ETH',
        'AVAX',
        'BSC',
        'NULS2'
      ],
      target_chains: [
        'ETH',
        'AVAX',
        'BSC',
        'NULS2'
      ],
      contracts: {
        'NULS2': 'NULSd6HgyZkiqLnBzTaeSQfx1TNg2cqbzq51h',
        'ETH': '0x27702a26126e0B3702af63Ee09aC4d1A084EF628',
        'BSC': '0x82D2f8E02Afb160Dd5A480a617692e62de9038C4',
        'NEO': '2efdb22c152896964665d0a8214dc7bd59232162',
        'AVAX': '0xc0Fbc4967259786C743361a5885ef49380473dCF'
      },
      targets: {
        'NULS2': 'NULSd6HgUUzDe6HxEB3SoyPR2V1DTvnaBFnVV',
        'ETH': '0x047f18e7F21Aa714c6a5f4B346318Eb384434A4b',
        'BSC': '0x5594eA3f85272784f66A282FB3D78fe002B92356',
        'AVAX': '0x5594eA3f85272784f66A282FB3D78fe002B92356'
      },
      chain_ids: {
        'ETH': 1,
        'BSC': 56,
        'AVAX': 43114,
      },
      fees: {
        'NULS2': 0,
        'ETH': 40,
        'BSC': 5,
        'AVAX': 10
      }
    }
  },
  computed: { 
    aleph_balance() {
      return (this.source_balances.ALEPH != undefined) ? this.source_balances.ALEPH : 0
    },
    target_amount() {
      if (this.fees[this.target_chain]) {
        return Math.max(this.amount - this.fees[this.target_chain], 0)
      } else {
        return this.amount
      }
    },
    prepared_target() {
      let target = this.target_address
      if ((this.target_chain === 'BSC') ||
          (this.target_chain === 'ETH') ||
          (this.target_chain === 'AVAX')) {
        target = `${this.target_address}@eip155:${this.chain_ids[this.target_chain]}`
      } else if (this.target_chain === 'NULS2') {
        target = `${this.target_address}@nuls`
      }
      return target
    },
    rev_chain_ids() {
      let val = {}
      Object.keys(this.chain_ids).forEach(
        (x => { val[this.chain_ids[x]] = x }))
      return val
    },
    enough_allowance() {
      if (this.source_account.meta === 'ETH') {
        if (this.source_allowance < this.target_amount)
          return false
      }
      return true
    },
    can_swap() {
      if (this.target_amount <= 0)
        return false
      if (this.amount > this.source_balances.ALEPH)
        return false
      if (!this.enough_allowance)
        return false

      return true
    }
  },
  methods: {
    async update_eth_account() {
      this.source_chain = this.rev_chain_ids[this.eth_chain_id]
      let signer = provider.getSigner()
      this.source_account = {
        'meta': 'ETH',
        'type': this.source_chain,
        'address': await signer.getAddress(),
        'signer': signer,
        'source': 'signer'
      }
    },
    async login_metamask() {
      if (window.ethereum) {
      try {
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        provider = new ethers.providers.Web3Provider(window.ethereum)

        // MetaMask requires requesting permission to connect users accounts
        provider.send("eth_requestAccounts", []);


        provider.on("network", async (newNetwork, oldNetwork) => {
          console.log(newNetwork, oldNetwork)
          this.eth_chain_id = newNetwork.chainId
          if (Object.values(this.chain_ids).includes(newNetwork.chainId)) {
            await this.update_eth_account()
          }
        });
        provider.on('accountsChanged', () => {
          console.log("hu hu")
        })
        // setAccounts(accounts);
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
        }

        console.log(error)
      }
    }

      // await window.ethereum.enable()
      // this.provider = new ethers.providers.Web3Provider(window.ethereum)
    },
    async refresh_account() {
      this.source_balances = await this.get_source_balances(this.source_account)
      this.source_allowance = await this.get_source_allowance(this.source_account)
    },
    async get_source_allowance(account) {
      if (account.meta === 'ETH') {
        let contract = await get_erc20_contract(
          this.contracts[account.type], provider.getSigner())
        let allowance = await contract.allowance(
          account.address,
          this.targets[account.type]
        )
        let decimals = await contract.decimals()
        return allowance / (10**decimals)
      }
    },
    async get_source_balances(account) {
      if (account.type === 'NULS2') {
        return await get_nuls_balance_info(
          account.address, 'https://nuls.world'
        )
      } else if (account.type === 'ETH') {
        return {
          ALEPH: await get_web3_balance_info(
            account.address, provider,
            this.contracts['ETH']
          )}
      } else if (account.type === 'AVAX') {
        return {
          ALEPH: await get_web3_balance_info(
            account.address, provider,
            this.contracts['AVAX']
          )}
      } else if (account.type === 'BSC') {
        return {
          ALEPH: await get_web3_balance_info(
            account.address, provider,
            this.contracts['BSC']
          )}
      } else {
        return {}
      }
    },
    guess_address_type(address) {
      let address_length = address.length
      if (address.startsWith("0x") && (address_length == 42))
          return "ETH"
      else if (address.startsWith("NULSd6") && (address_length == 37))
          return "NULS2"
      else if (address.startsWith("A") && (address_length == 34))
          return "NEO"
      else if (address.startsWith("tz") && (address_length == 36))
          return "TEZOS"
      else
          return null
    },
    check_address() {
      let address_type = this.guess_address_type(this.target_address)
      if (address_type != null) {
        if ((address_type === 'ETH') && (['AVAX', 'BSC'].includes(this.target_chain)))
          return false

        this.target_chain = address_type
        return false
      }
      return true
    },
    async do_approve() {
      try {
        if (this.source_account.meta == "ETH") {
          this.approving = true
          let contract = get_erc20_contract(
            this.contracts[this.source_account.type],
            provider.getSigner())
          let transaction = await contract.approve(
            this.targets[this.source_account.type],
            ethers.utils.parseUnits('500000000', 18))
          let receipt = await transaction.wait(3)
          await this.refresh_account()
          this.approving = false
        }
      }
      catch (e) {
        console.log(e)
      }
    },
    async do_swap() {
      if (this.source_account.meta == 'ETH') {
        this.swapping = true
        let contract = get_swap_contract(
          this.targets[this.source_account.type],
          provider.getSigner())
        let transaction = await contract.logSendMemo(
          ethers.utils.parseUnits(this.amount.toString(), 18),
          this.prepared_target)
        this.out_txid = transaction.hash
        console.log(transaction)
        let receipt = await transaction.wait(3)
        console.log(receipt)
        await this.refresh_account()
        await this.$emit('sent')
        this.swapping = false
      }
    }
  },
  mounted() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        await this.login_metamask()
      })

      window.ethereum.on('chainChanged', async (chainId) => {
        await this.login_metamask()
      })
    }
  },
  watch: {
    async source_account(new_account) {
      await this.refresh_account()
    }
  }
}
</script>
<style scoped>
</style>