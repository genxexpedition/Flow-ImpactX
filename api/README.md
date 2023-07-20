# Flow-ImpactX API
The Flow-ImpactX API is a RESTful API built with [express](https://expressjs.com/) that sends transactions to Flow using the [Flow JS SDK](https://github.com/onflow/fcl-js/tree/master/packages/sdk). It contains endpoints for both the [ImpactX-items](src/services/ImpactX-items.ts) & [storefront](src/services/storefront.ts) services to read & write data to both the Flow blockchain and a SQL database.

## Getting Started

Here are some commands to help you get started with initializing and executing on the Flow-ImpactX API. See [Flow-ImpactX Service](#ImpactX-items-servicesrcservicesImpactX-itemsts) and [Storefront Service](#storefront-servicesrcservicesstorefrontts) for more details on these endpoints.

### Setup

Run the commands below to initialize the minter account.

- **/v1/ImpactX-items/setup**

```
curl --request POST \
--url http://localhost:3000/v1/ImpactX-items/setup \
--header 'Content-Type: application/json'
```

- **/v1/market/setup**

```
curl --request POST \
--url http://localhost:3000/v1/market/setup \
--header 'Content-Type: application/json'
```

### Minting

Run the commands below to mint new items and list them for sale.

- **/v1/ImpactX-items/mint**

```
curl --request POST \
--url http://localhost:3000/v1/ImpactX-items/mint \
--header 'Content-Type: application/json' \
--data '{
    "recipient": "'$ADMIN_ADDRESS'",
    "kind": 1
    }'
```

- **/v1/market/sell**

```
curl --request POST \
--url http://localhost:3000/v1/market/sell \
--header 'Content-Type: application/json' \
--data '{
    "itemID": 0,
    "price": 7.9
    }'
```

## Services
The Flow-ImpactX API contains four main services. These services synchronize data between the blockchain and the SQL database, and also provide API endpoints consumed by the Flow-ImpactX client-side application.

### [Flow Service](src/services/flow.ts)
This service contains functions that interact with the Flow blockchain using the [FCL JS](https://docs.onflow.org/fcl/) library. While it has no exposed endpoints, its methods used to read, write and authorize data on the chain are used extensively by its sister services and workers.

Notable functions:
- `sendTx()`: Takes a Cadence transaction as an arguement and sends it to write data into the Flow blockchain.
- `executeScript()`: Takes a Cadence script as an arguement and executes it to read data from the Flow blockchain. 
- `getLatestBlockHeight()`: Gets the most recent block from the Flow blockchain.
- `authorizeMinter()`: Returns an asynchronous method to authorize an account to mint Flow-ImpactX.

### [Block Cursor Service](src/services/block-cursor.ts)
This service watches for state-changing events emitted by the Flow-ImpactX contract and updates the SQL database accordingly.

Notable functions:
- `findOrCreateLatestBlockCursor()`: Queries the `block_cursor` table for the the last block check by the listing handler worker. If no row is found then insert a record with our current latest block height.
- `updateBlockCursorById()`: Updates the row with the latest block height that has been checked for events.

### [Flow-ImpactX Service](src/services/ImpactX-items.ts)
This service contains functions that utilize the Flow Service to send Cadence transactions and scripts that fetch and update Flow-ImpactX data.

You can also run the [transactions and scripts](../cadence) manually using the [Flow CLI](https://docs.onflow.org/flow-cli/).

[Exposed Endpoints](src/routes/ImpactX-items.ts):
- **POST `/v1/ImpactX-items/setup`** *[DEPRECATED]*: Sets up account with a resource that stores Flow-ImpactX in the admin minter account. The [startup script](/.ki-scripts/startup.js) directly sends the setup Cadence transaction instead of using this endpoint. Calls [setup_account.cdc](/cadence/transactions/ImpactXItems/setup_account.cdc)

- **POST `/v1/ImpactX-items/mint`** *[DEPRECATED]*: Mint a ImpactX Item and send it to a recipient account. Calls [mint_ImpactX_item.cdc](/cadence/transactions/ImpactXItems/mint_ImpactX_item.cdc)

- **POST `/v1/ImpactX-items/mint-and-list`**: Mint a ImpactX Item and immediately list it for sale. Called by the admin account to mint and sell new items. Calls [mint_and_list_ImpactX_item.cdc](/cadence/transactions/ImpactXItems/mint_and_list_ImpactX_item.cdc)

- **POST `/v1/ImpactX-items/transfer`**: Sends a ImpactX Item from the admin account to a recipient account. Calls [transfer_ImpactX_item.cdc](/cadence/transactions/ImpactXItems/transfer_ImpactX_item.cdc)

- **GET `/v1/ImpactX-items/collection/:account`**: Fetches a collection of ImpactX Item IDs for an account. Calls [get_collection_ids.cdc](/cadence/scripts/ImpactXItems/get_collection_ids.cdc)

- **GET `/v1/ImpactX-items/item/:address/:itemID`**: Fetches a specific ImpactX Item for an account. Calls [get_ImpactX_item.cdc](/cadence/scripts/ImpactXItems/get_ImpactX_item.cdc)

- **GET `/v1/ImpactX-items/supply`**: Fetches the total supply of Flow-ImpactX. Calls [get_ImpactX_items_supply.cdc](/cadence/scripts/ImpactXItems/get_ImpactX_items_supply.cdc).

### [Storefront Service](src/services/storefront.ts)
This service contains functions that read and write Flow-ImpactX listing data to both the Flow blockchain as well as the SQL database. These functions are exposed through endpoints to allow users to purchase and list their Flow-ImpactX on the marketplace. Similar to the Flow-ImpactX service, the Cadence scripts/transactions can be called in the [Flow-cli](https://docs.onflow.org/flow-cli/) and directly read/write to the Flow blockchain.

[Exposed Endpoints](src/routes/storefront.ts):
- **POST `/v1/market/setup`** *[DEPRECATED]*: Sets up account with a resource that stores listings for Flow-ImpactX in the admin account. The [startup script](/.ki-scripts/startup.js) directly sends the setup Cadence transaction instead of using this endpoint. Calls [setup_account.cdc](/cadence/transactions/nftStorefront/setup_account.cdc)

- **POST `/v1/market/buy`**: Takes payment and transfers ImpactXItem from seller account to recipient. Calls [purchase_listing.cdc](/cadence/transactions/nftStorefront/purchase_listing.cdc)

- **POST `/v1/market/sell`**: Creates Flow-ImpactX listing on the Flow blockchain. **Flow-ImpactX that associated to listings are not removed from the seller's account until item is purchased**. Calls [create_listing.cdc](/cadence/transactions/nftStorefront/create_listing.cdc)

- **GET `/v1/market/collection/:account`**: Fetches all the listings created by the account. Returns an array of `listing_resource_ids`. Calls [get_listings.cdc](/cadence/scripts/nftStorefront/get_listings.cdc)

- **GET `/v1/market/collection/:account/:item`**: Fetches a specific listing for account and itemID. Calls [get_listing.cdc](/cadence/scripts/nftStorefront/get_listing.cdc)

- **GET `/v1/market/latest`**: Queries the `listings` table with different parameters to fetch an array of listings in order of recency. Returns an array of listings.

- **GET `/v1/market/:id`**: Queries the `listings` table to fetch a specific `itemID`. Returns a specific listing.

## Database
>I thought Flow-ImpactX were NFTs that exist on the blockchain. Why do we need a database?

While a DB is not necessary to purchase, sell, and mint Flow-ImpactX, it greatly reduces the number of queries executed against the blockchain, creating a much more performant app! Since Flow-ImpactX listings are tied to the account that owns the ImpactX Item up for sale, we would need to query the blockchain for all accounts that have created ImpactX Item listings in order to create a collection of listings we could call a marketplace. Saving the listings in a database and updating the table when listings are created and deleted greatly reduces the number of calls needed to fetch accurate listing data.

### Tables
- **[listings](src/migrations/20201217175722_create_listings.ts)**: This table is used to store all listings on the marketplace and storefront. The difference between Storefront and Marketplace is that Flow-ImpactX listed by users are considered Marketplace listings and the items listed by the admin account and considered Storefront listings.
- **[block_cursor](src/migrations/20201214150404_create_block_cursor.ts )**: This table is used to record the last visited block on the Flow blockain. Workers use and update this row when checking the blockchain for listing events.

## Workers
In order to ensure the listing data in the database is consistent with the data on the blockchain, we must run a event handler worker that periodically checks windows of blocks on the Flow blockchain for listing events. When we come across a listing event, the handler will run a query to update the database to be consistant with the blockchain.

- **[base_event_handler](src/workers/base-event-handler.ts)**: This is an abstract class contains the logic to poll the blockchain for events we want to action on. The polling function first queries the blockchain and database to create a block search window. Then it queries the blockchain again for relevant events within the computed search window. Once the search is complete, the last seen block height is recorded in the database and the method recursively calls itself to continue polling.

- **[listing_handler.ts](src/workers/listing-handler.ts)**: This handler extends the base_event_handler and defines the listing events we want to check for. It also contains the `onEvent()` business logic to be ran when a listing event is found.
