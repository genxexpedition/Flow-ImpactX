import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import * as fs from "fs"
import * as path from "path"
import {FlowService} from "./flow"

const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"'
const metadataViewsPath = '"../../contracts/MetadataViews.cdc"'
const ImpactXItemsPath = '"../../contracts/ImpactXItems.cdc"'
const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"'
const flowTokenPath = '"../../contracts/FlowToken.cdc"'
const storefrontPath = '"../../contracts/NFTStorefrontV2.cdc"'

enum Kind {
  Fishbowl = 0,
  Fishhat,
  Milkshake,
  TukTuk,
  Skateboard,
}

enum Rarity {
  Blue = 0,
  Green,
  Purple,
  Gold,
}

const randomKind = () => {
  const values = Object.keys(Kind)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n))

  const index = Math.floor(Math.random() * values.length)

  return values[index].toString();
}

const ITEM_RARITY_PROBABILITIES = {
  [Rarity.Gold]: "10",
  [Rarity.Purple]: "20",
  [Rarity.Green]: "30",
  [Rarity.Blue]: "40",
}

const randomRarity = () => {
  const rarities = Object.keys(ITEM_RARITY_PROBABILITIES)
  const rarityProbabilities = rarities.flatMap(rarity =>
    Array(ITEM_RARITY_PROBABILITIES[rarity]).fill(rarity)
  )

  const index = Math.floor(Math.random() * rarityProbabilities.length)

  return rarityProbabilities[index]
}

class ImpactXItemsService {
  constructor(
    private readonly flowService: FlowService,
    private readonly nonFungibleTokenAddress: string,
    private readonly metadataViewsAddress: string,
    private readonly ImpactXItemsAddress: string,
    private readonly fungibleTokenAddress: string,
    private readonly flowTokenAddress: string,
    private readonly storefrontAddress: string
  ) {}

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ImpactXItems/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(ImpactXItemsPath, fcl.withPrefix(this.ImpactXItemsAddress))

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    })
  }

  mint = async (recipient: string) => {
    const authorization = this.flowService.authorizeMinter()

    const kind = randomKind()
    const rarity = randomRarity()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ImpactXItems/mint_ImpactX_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(ImpactXItemsPath, fcl.withPrefix(this.ImpactXItemsAddress))

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(kind, t.UInt8),
        fcl.arg(rarity, t.UInt8),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
      skipSeal: true,
    })
  }

  mintAndList = async (recipient: string) => {
    const authorization = this.flowService.authorizeMinter()

    const kind = randomKind()
    const rarity = randomRarity()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ImpactXItems/mint_and_list_ImpactX_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(ImpactXItemsPath, fcl.withPrefix(this.ImpactXItemsAddress))
      .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
      .replace(flowTokenPath, fcl.withPrefix(this.flowTokenAddress))
      .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress))

    return this.flowService.sendTx({
      transaction,
      args: [
        fcl.arg(recipient, t.Address),
        fcl.arg(kind, t.UInt8),
        fcl.arg(rarity, t.UInt8),
      ],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
      skipSeal: true,
    })
  }

  transfer = async (recipient: string, itemID: number) => {
    const authorization = this.flowService.authorizeMinter()

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/ImpactXItems/transfer_ImpactX_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(ImpactXItemsPath, fcl.withPrefix(this.ImpactXItemsAddress))

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(itemID, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    })
  }

  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/ImpactXItems/get_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(ImpactXItemsPath, fcl.withPrefix(this.ImpactXItemsAddress))

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    })
  }

  getImpactXItem = async (itemID: string, address: string): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/ImpactXItems/get_ImpactX_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(metadataViewsPath, fcl.withPrefix(this.metadataViewsAddress))
      .replace(ImpactXItemsPath, fcl.withPrefix(this.ImpactXItemsAddress))

    return this.flowService.executeScript<number>({
      script,
      args: [fcl.arg(address, t.Address), fcl.arg(itemID, t.UInt64)],
    })
  }

  getSupply = async (): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/ImpactXItems/get_ImpactX_items_supply.cdc`
        ),
        "utf8"
      )
      .replace(ImpactXItemsPath, fcl.withPrefix(this.ImpactXItemsAddress))

    return this.flowService.executeScript<number>({script, args: []})
  }
}

export {ImpactXItemsService}
