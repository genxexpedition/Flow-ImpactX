import { mintFlow, executeScript, sendTransaction, deployContractByName } from "@onflow/flow-js-testing";
import { getImpactXAdminAddress } from "./common";

export const types = {
	fishbowl: 1,
	fishhat: 2,
	milkshake: 3,
	tuktuk: 4,
	skateboard: 5
};

export const rarities = {
	blue: 1,
	green: 2,
	purple: 3,
	gold: 4
};

/*
 * Deploys NonFungibleToken and ImpactXItems contracts to ImpactXAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const deployImpactXItems = async () => {
	const ImpactXAdmin = await getImpactXAdminAddress();
	await mintFlow(ImpactXAdmin, "10.0");

	await deployContractByName({ to: ImpactXAdmin, name: "NonFungibleToken" });
	await deployContractByName({ to: ImpactXAdmin, name: "MetadataViews" });
	return deployContractByName({ to: ImpactXAdmin, name: "ImpactXItems" });
};

/*
 * Setups ImpactXItems collection on account and exposes public capability.
 * @param {string} account - account address
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const setupImpactXItemsOnAccount = async (account) => {
	const name = "ImpactXItems/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
};

/*
 * Returns ImpactXItems supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getImpactXItemSupply = async () => {
	const name = "ImpactXItems/get_ImpactX_items_supply";

	return executeScript({ name });
};

/*
 * Mints ImpactXItem of a specific **itemType** and sends it to **recipient**.
 * @param {UInt64} itemType - type of NFT to mint
 * @param {string} recipient - recipient account address
 * @returns {Promise<[{*} result, {error} error]>}
 * */
export const mintImpactXItem = async (recipient, itemType, itemRarity, cuts = [], royaltyDescriptions = [], royaltyBeneficiaries = []) => {
	const ImpactXAdmin = await getImpactXAdminAddress();

	const name = "ImpactXItems/mint_ImpactX_item";
	const args = [recipient, itemType, itemRarity, cuts, royaltyDescriptions, royaltyBeneficiaries];
	const signers = [ImpactXAdmin];

	return sendTransaction({ name, args, signers });
};

/*
 * Transfers ImpactXItem NFT with id equal **itemId** from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {UInt64} itemId - id of the item to transfer
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const transferImpactXItem = async (sender, recipient, itemId) => {
	const name = "ImpactXItems/transfer_ImpactX_item";
	const args = [recipient, itemId];
	const signers = [sender];

	return sendTransaction({ name, args, signers });
};

/*
 * Returns the ImpactXItem NFT with the provided **id** from an account collection.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getImpactXItem = async (account, itemID) => {
	const name = "ImpactXItems/get_ImpactX_item";
	const args = [account, itemID];

	return executeScript({ name, args });
};

/*
 * Returns the number of Flow-ImpactX in an account's collection.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getImpactXItemCount = async (account) => {
	const name = "ImpactXItems/get_collection_length";
	const args = [account];

	return executeScript({ name, args });
};
