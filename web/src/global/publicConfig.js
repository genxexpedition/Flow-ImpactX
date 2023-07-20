const appTitle = "Flow-ImpactX"

const isDev = process.env.NODE_ENV === "development"

const chainEnv = process.env.NEXT_PUBLIC_CHAIN_ENV
if (!chainEnv) throw new Error("Missing NEXT_PUBLIC_CHAIN_ENV")

const flowAccessApiUrl = process.env.NEXT_PUBLIC_FLOW_ACCESS_API_URL
if (!flowAccessApiUrl)
  throw new Error("Missing NEXT_PUBLIC_FLOW_ACCESS_API_URL")

const appUrl = process.env.NEXT_PUBLIC_APP_URL
if (!appUrl) throw new Error("Missing NEXT_PUBLIC_APP_URL")

const walletDiscovery = process.env.NEXT_PUBLIC_WALLET_DISCOVERY
if (!walletDiscovery) throw new Error("Missing NEXT_PUBLIC_WALLET_DISCOVERY")

const apiImpactXItemMint = process.env.NEXT_PUBLIC_API_ImpactX_ITEM_MINT
if (!apiImpactXItemMint)
  throw new Error("Missing NEXT_PUBLIC_API_ImpactX_ITEM_MINT")

const apiImpactXItemMintAndList =
  process.env.NEXT_PUBLIC_API_ImpactX_ITEM_MINT_AND_LIST
if (!apiImpactXItemMintAndList)
  throw new Error("Missing NEXT_PUBLIC_API_ImpactX_ITEM_MINT_AND_LIST")

const apiMarketItemsList = process.env.NEXT_PUBLIC_API_MARKET_ITEMS_LIST
if (!apiMarketItemsList)
  throw new Error("Missing NEXT_PUBLIC_API_MARKET_ITEMS_LIST")

const apiUrl = process.env.NEXT_PUBLIC_API_URL
if (!apiUrl) throw new Error("Missing NEXT_PUBLIC_API_URL")

const contractFungibleToken = process.env.NEXT_PUBLIC_CONTRACT_FUNGIBLE_TOKEN
if (!contractFungibleToken)
  throw new Error("Missing NEXT_PUBLIC_CONTRACT_FUNGIBLE_TOKEN")

const contractNonFungibleToken =
  process.env.NEXT_PUBLIC_CONTRACT_NON_FUNGIBLE_TOKEN
if (!contractNonFungibleToken)
  throw new Error("Missing NEXT_PUBLIC_CONTRACT_NON_FUNGIBLE_TOKEN")

const contractMetadataViews = process.env.NEXT_PUBLIC_CONTRACT_METADATA_VIEWS
if (!contractMetadataViews)
  throw new Error("Missing NEXT_PUBLIC_CONTRACT_METADATA_VIEWS")

const flowAddress = process.env.NEXT_PUBLIC_FLOW_ADDRESS
if (!flowAddress) throw new Error("Missing NEXT_PUBLIC_FLOW_ADDRESS")

const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_URL
if (!avatarUrl) throw new Error("Missing NEXT_PUBLIC_AVATAR_URL")

const contractImpactXItems = process.env.NEXT_PUBLIC_CONTRACT_ImpactX_ITEMS
if (!contractImpactXItems)
  throw new Error("Missing NEXT_PUBLIC_CONTRACT_ImpactX_ITEMS")

const contractNftStorefront = process.env.NEXT_PUBLIC_CONTRACT_NFT_STOREFRONT
if (!contractNftStorefront)
  throw new Error("Missing NEXT_PUBLIC_CONTRACT_NFT_STOREFRONT")

const contractFlowToken = process.env.NEXT_PUBLIC_CONTRACT_FLOW_TOKEN
if (!contractFlowToken)
  throw new Error("Missing NEXT_PUBLIC_CONTRACT_FLOW_TOKEN")

const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID
const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

const publicConfig = {
  appTitle,
  isDev,
  faucetAddress: process.env.NEXT_PUBLIC_FAUCET_ADDRESS,
  chainEnv,
  flowAccessApiUrl,
  appUrl,
  walletDiscovery,
  apiImpactXItemMint,
  apiMarketItemsList,
  apiImpactXItemMintAndList,
  apiUrl,
  flowAddress,
  avatarUrl,
  contractFungibleToken,
  contractNonFungibleToken,
  contractMetadataViews,
  contractFlowToken,
  contractImpactXItems,
  contractNftStorefront,
  gaTrackingId,
  mixpanelToken,
}

export default publicConfig
