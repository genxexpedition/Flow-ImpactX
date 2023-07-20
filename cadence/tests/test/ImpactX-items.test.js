import path from "path";

import { 
	emulator,
	init,
	getAccountAddress,
	shallPass,
	shallResolve,
	shallRevert,
} from "@onflow/flow-js-testing";

import { getImpactXAdminAddress } from "../src/common";
import {
	deployImpactXItems,
	getImpactXItemCount,
	getImpactXItemSupply,
	mintImpactXItem,
	setupImpactXItemsOnAccount,
	transferImpactXItem,
	types,
	rarities,
} from "../src/ImpactX-items";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(100000);

describe("Flow-ImpactX", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../");
		await init(basePath);
		await emulator.start();
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		await emulator.stop();
	});

	it("should deploy ImpactXItems contract", async () => {
		await shallPass(deployImpactXItems());
	});

	it("supply should be 0 after contract is deployed", async () => {
		// Setup
		await deployImpactXItems();
		const ImpactXAdmin = await getImpactXAdminAddress();
		await shallPass(setupImpactXItemsOnAccount(ImpactXAdmin));

		const [supply] = await shallResolve(getImpactXItemSupply())
		expect(supply).toBe("0");
	});

	it("should be able to mint a ImpactX item", async () => {
		// Setup
		await deployImpactXItems();
		const Alice = await getAccountAddress("Alice");
		await setupImpactXItemsOnAccount(Alice);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintImpactXItem(Alice, types.fishbowl, rarities.blue));
	});

	it("should be able to create a new empty NFT Collection", async () => {
		// Setup
		await deployImpactXItems();
		const Alice = await getAccountAddress("Alice");
		await setupImpactXItemsOnAccount(Alice);

		// shall be able te read Alice collection and ensure it's empty
		const [itemCount] = await shallResolve(getImpactXItemCount(Alice))
		expect(itemCount).toBe("0");
	});

	it("should not be able to withdraw an NFT that doesn't exist in a collection", async () => {
		// Setup
		await deployImpactXItems();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupImpactXItemsOnAccount(Alice);
		await setupImpactXItemsOnAccount(Bob);

		// Transfer transaction shall fail for non-existent item
		await shallRevert(transferImpactXItem(Alice, Bob, 1337));
	});

	it("should be able to withdraw an NFT and deposit to another accounts collection", async () => {
		await deployImpactXItems();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupImpactXItemsOnAccount(Alice);
		await setupImpactXItemsOnAccount(Bob);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintImpactXItem(Alice, types.fishbowl, rarities.blue));

		// Transfer transaction shall pass
		await shallPass(transferImpactXItem(Alice, Bob, 0));
	});

	it("misc test", async () => {

	})
});
