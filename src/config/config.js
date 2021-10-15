import { config } from "@onflow/fcl"

config({
  "accessNode.api": process.env.REACT_APP_ACCESS_NODE,
  "discovery.wallet": process.env.REACT_APP_WALLET_DISCOVERY,
  "0xFungibleTokenContract": process.env.REACT_APP_FT_CONTRACT,
  "0xNonFungibleTokenContract": process.env.REACT_APP_NFT_CONTRACT,
  "0xFUSDContract": process.env.REACT_APP_FUSD_CONTRACT,
  "0xMyWContract": process.env.REACT_APP_MYW_CONTRACT,
  "0xMyWArtContract": process.env.REACT_APP_MYWART_CONTRACT,
  "0xMyWMarketContract": process.env.REACT_APP_MYWMARKET_CONTRACT
})