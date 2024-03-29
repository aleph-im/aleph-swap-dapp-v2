import axios from 'axios'
import { get_erc20_contract } from './ethereum'

export async function get_nuls_balance_info(address, explorer_url) {
  let response = await axios.get(`${explorer_url}/addresses/${address}.json`)
  let balance_info = {
    'ALEPH': 0,
    'NULS': 0
  }
  if ((response.data.unspent_info.unspent_value !== undefined))
  {
    balance_info['NULS'] = response.data.unspent_info.unspent_value / (10**8)
  }
  for (let holding of response.data.token_holdings) {
    balance_info[holding.symbol] = holding.balance / (10**holding.decimals)
  }
  return balance_info
}

export async function get_web3_balance_info(address, provider, erc20_adress) {
  console.log(address, provider, erc20_adress)
  const contract = get_erc20_contract(erc20_adress, provider)
  console.log(contract)
  try {
    let balance = await contract.balanceOf(address)
    let decimals = await contract.decimals()
    console.log(balance, decimals)
    return balance / (10**decimals)
  } catch (e) {
    console.log(e)
    return 0
  }
}

export async function get_ethereum_balance_info(address, explorer_url) {
  let response = await axios.get(`${explorer_url}/getAddressInfo/${address}?apiKey=freekey`)

  let balance_info = {
    'ALEPH': 0,
    'ETH': 0
  }
  if ((response.data.ETH.balance !== undefined))
  {
    balance_info['ETH'] = response.data.ETH.balance
  }
  if(response.data.tokens !== undefined)
  for (let holding of response.data.tokens) {
    let decimals = Number(holding.tokenInfo.decimals)
    balance_info[holding.tokenInfo.symbol] = holding.balance / (10**decimals)
  }
  return balance_info
}