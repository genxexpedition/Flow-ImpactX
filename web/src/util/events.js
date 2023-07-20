import * as fcl from "@onflow/fcl"
import publicConfig from "src/global/publicConfig"

export const EVENT_ITEM_MINTED = "ImpactXItems.Minted"
export const EVENT_ImpactX_ITEM_DEPOSIT = "ImpactXItems.Deposit"

export const EVENT_LISTING_AVAILABLE = "NFTStorefrontV2.ListingAvailable"
export const EVENT_LISTING_COMPLETED = "NFTStorefrontV2.ListingCompleted"

export const getImpactXItemsEventByType = (events, type) => {
  return events.find(
    event =>
      event.type ===
      `A.${fcl.sansPrefix(publicConfig.contractImpactXItems)}.${type}`
  )
}

export const getStorefrontEventByType = (events, type) => {
  return events.find(
    event =>
      event.type ===
      `A.${fcl.sansPrefix(publicConfig.contractNftStorefront)}.${type}`
  )
}
